import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuth } from "../context/AuthContext";

function getRedirectTarget(searchParams) {
  const redirect = searchParams.get("redirect");
  return redirect && redirect.startsWith("/") ? redirect : "/profile";
}

export default function RegisterPage() {
  const { initialized, isAuthenticated, loginWithGoogle, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialized && isAuthenticated) {
      navigate(getRedirectTarget(searchParams), { replace: true });
    }
  }, [initialized, isAuthenticated, navigate, searchParams]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register(formState);
      navigate(getRedirectTarget(searchParams), { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn(credential) {
    setError("");
    setIsSubmitting(true);

    try {
      await loginWithGoogle(credential);
      navigate(getRedirectTarget(searchParams), { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-layout">
      <div className="panel auth-panel">
        <p className="eyebrow">Launch your account</p>
        <h1>Create a player profile for the API-backed app.</h1>
        <p className="muted-text">
          Create an account with email/password or use Google to start immediately.
        </p>

        <GoogleSignInButton
          disabled={isSubmitting}
          onCredential={handleGoogleSignIn}
          onError={(scriptError) => setError(scriptError.message)}
        />

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Username</span>
            <input
              autoComplete="username"
              type="text"
              value={formState.username}
              onChange={(event) => setFormState((current) => ({ ...current, username: event.target.value }))}
              minLength={3}
              required
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              autoComplete="email"
              type="email"
              value={formState.email}
              onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              autoComplete="new-password"
              type="password"
              value={formState.password}
              onChange={(event) => setFormState((current) => ({ ...current, password: event.target.value }))}
              minLength={6}
              required
            />
          </label>

          {error ? <div className="banner error-banner">{error}</div> : null}

          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="muted-text">
          Already registered? <Link to="/login">Login here</Link>.
        </p>
      </div>
    </section>
  );
}
