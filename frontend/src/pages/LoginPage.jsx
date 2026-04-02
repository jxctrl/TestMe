import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuth } from "../context/AuthContext";

function getRedirectTarget(searchParams) {
  const redirect = searchParams.get("redirect");
  return redirect && redirect.startsWith("/") ? redirect : "/profile";
}

export default function LoginPage() {
  const { initialized, isAuthenticated, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formState, setFormState] = useState({ email: "", password: "" });
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
      await login(formState);
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
        <p className="eyebrow">Welcome back</p>
        <h1>Login to continue your progress.</h1>
        <p className="muted-text">
          Your React session uses the same storage keys as the current HTML frontend.
        </p>

        <GoogleSignInButton
          disabled={isSubmitting}
          onCredential={handleGoogleSignIn}
          onError={(scriptError) => setError(scriptError.message)}
        />

        <form className="form-grid" onSubmit={handleSubmit}>
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
              autoComplete="current-password"
              type="password"
              value={formState.password}
              onChange={(event) => setFormState((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </label>

          {error ? <div className="banner error-banner">{error}</div> : null}

          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="muted-text">
          Need an account? <Link to="/register">Create one here</Link>.
        </p>
      </div>
    </section>
  );
}
