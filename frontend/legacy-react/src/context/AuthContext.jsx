import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const TOKEN_KEY = "quizarena_token";
const USER_KEY = "quizarena_user";

const AuthContext = createContext(null);

function readStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (_error) {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

function persistSession(payload) {
  localStorage.setItem(TOKEN_KEY, payload.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
}

function persistUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSessionStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => readStoredUser());
  const [initialized, setInitialized] = useState(false);

  const refreshProfile = useCallback(
    async (sessionToken = token) => {
      if (!sessionToken) {
        setUser(null);
        return null;
      }

      const profile = await api.get("/users/me", { token: sessionToken });
      persistUser(profile);
      setUser(profile);
      return profile;
    },
    [token]
  );

  const consumeAuthResponse = useCallback(
    async (payload) => {
      persistSession(payload);
      setToken(payload.access_token);
      setUser(payload.user);

      try {
        return await refreshProfile(payload.access_token);
      } catch (_error) {
        return payload.user;
      }
    },
    [refreshProfile]
  );

  const login = useCallback(
    async (credentials) => {
      const payload = await api.post("/auth/login", credentials);
      return consumeAuthResponse(payload);
    },
    [consumeAuthResponse]
  );

  const register = useCallback(
    async (credentials) => {
      const payload = await api.post("/auth/register", credentials);
      return consumeAuthResponse(payload);
    },
    [consumeAuthResponse]
  );

  const loginWithGoogle = useCallback(
    async (credential) => {
      const payload = await api.post("/auth/google", { credential });
      return consumeAuthResponse(payload);
    },
    [consumeAuthResponse]
  );

  const logout = useCallback(() => {
    clearSessionStorage();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;

    async function initializeSession() {
      if (!token) {
        if (active) {
          setInitialized(true);
        }
        return;
      }

      try {
        await refreshProfile(token);
      } catch (error) {
        if (error.status === 401) {
          clearSessionStorage();
          if (active) {
            setToken(null);
            setUser(null);
          }
        }
      } finally {
        if (active) {
          setInitialized(true);
        }
      }
    }

    initializeSession();

    return () => {
      active = false;
    };
  }, [refreshProfile, token]);

  return (
    <AuthContext.Provider
      value={{
        initialized,
        isAuthenticated: Boolean(user && token),
        login,
        loginWithGoogle,
        logout,
        refreshProfile,
        register,
        token,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
