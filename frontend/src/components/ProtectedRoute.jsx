import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ adminOnly = false, children }) {
  const { initialized, user } = useAuth();
  const location = useLocation();

  if (!initialized) {
    return (
      <section className="panel centered-panel">
        <p className="eyebrow">Loading session</p>
        <h1>Checking your account access...</h1>
      </section>
    );
  }

  if (!user) {
    const redirect = `${location.pathname}${location.search}`;
    return <Navigate replace to={`/login?redirect=${encodeURIComponent(redirect)}`} />;
  }

  if (adminOnly && !user.is_admin) {
    return <Navigate replace to="/" />;
  }

  return children;
}
