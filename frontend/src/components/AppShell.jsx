import { NavLink, Outlet } from "react-router-dom";
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
  const primaryLinks = [
    { to: "/", label: "Home" },
    { to: "/leaderboard", label: "Board" },
    { to: "/play/practice", label: "Practice" },
    { to: "/play/competition", label: "Compete" }
  ];
  const mobileLinks = [
    ...primaryLinks,
    user?.is_admin ? { to: "/admin", label: "Admin" } : user ? { to: "/profile", label: "Me" } : { to: "/register", label: "Join" }
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-heading">
            <NavLink className="brand-mark" to="/">
              QuizArena
            </NavLink>
            <span className="brand-badge">Android-ready</span>
          </div>
          <p className="brand-copy">
            Bilingual exam prep with live progress, competition mode, and a cleaner phone-first experience.
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

        <div className="topbar-actions">
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

      <nav aria-label="Quick mobile navigation" className="mobile-dock">
        {mobileLinks.map((link) => (
          <NavLink key={link.to} className={dockClassName} to={link.to}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}
