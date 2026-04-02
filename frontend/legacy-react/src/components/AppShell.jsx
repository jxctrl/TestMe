import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function navClassName({ isActive }) {
  return isActive ? "nav-link active" : "nav-link";
}

function dockClassName({ isActive }) {
  return isActive ? "mobile-dock-link active" : "mobile-dock-link";
}

function getInitials(name) {
  return (name || "QA")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default function AppShell() {
  const { initialized, logout, user } = useAuth();
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/register";
  const primaryLinks = [
    { to: "/", label: "Home" },
    { to: "/leaderboard", label: "Board" },
    { to: "/play/practice", label: "Practice" },
    { to: "/play/competition", label: "Compete" }
  ];
  const mobileLinks = user
    ? [
        ...primaryLinks,
        user.is_admin ? { to: "/admin", label: "Admin" } : { to: "/profile", label: "Me" }
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/leaderboard", label: "Board" },
        { to: "/login", label: "Login" },
        { to: "/register", label: "Join" }
      ];
  const topbarClassName = isAuthRoute ? "topbar topbar-compact" : "topbar";
  const actionClassName = user ? "topbar-actions is-user" : "topbar-actions is-guest";

  return (
    <div className="app-shell">
      <header className={topbarClassName}>
        <div className="brand-block">
          <div className="brand-heading">
            <NavLink className="brand-mark" to="/">
              <span>Quiz</span>
              <span className="brand-mark-accent">Arena</span>
            </NavLink>
            <span className="brand-badge">Competition Mode</span>
          </div>
          <p className="brand-copy">
            Bilingual exam prep with practice sessions, live rankings, and mobile-ready competition runs.
          </p>
        </div>

        <nav className="nav-links" aria-label="Main navigation">
          {primaryLinks.map((link) => (
            <NavLink key={link.to} className={navClassName} to={link.to}>
              {link.label}
            </NavLink>
          ))}
          {user?.is_admin ? <NavLink className={navClassName} to="/admin">Admin</NavLink> : null}
        </nav>

        <div className={actionClassName}>
          {!initialized ? <span className="session-pill">Checking session...</span> : null}
          {user ? (
            <>
              <NavLink className="user-link" to="/profile">
                <span className="user-avatar" aria-hidden="true">
                  {user.avatar_url ? <img alt="" src={user.avatar_url} /> : getInitials(user.username)}
                </span>
                <span>{user.username}</span>
              </NavLink>
              <button className="ghost-button" type="button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink className="ghost-button" to="/login">
                Login
              </NavLink>
              <NavLink className="primary-button" to="/register">
                Create account
              </NavLink>
            </>
          )}
        </div>
      </header>

      {!isAuthRoute ? (
        <nav aria-label="Quick mobile navigation" className="mobile-dock">
          {mobileLinks.map((link) => (
            <NavLink key={link.to} className={dockClassName} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      ) : null}

      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}
