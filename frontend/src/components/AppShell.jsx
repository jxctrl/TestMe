import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function navClassName({ isActive }) {
  return isActive ? "nav-link active" : "nav-link";
}

export default function AppShell() {
  const { initialized, logout, user } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <NavLink className="brand-mark" to="/">
            QuizArena
          </NavLink>
          <p className="brand-copy">React frontend for the FastAPI-powered quiz platform.</p>
        </div>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink className={navClassName} to="/">
            Overview
          </NavLink>
          <NavLink className={navClassName} to="/leaderboard">
            Leaderboard
          </NavLink>
          <NavLink className={navClassName} to="/play/practice">
            Practice
          </NavLink>
          <NavLink className={navClassName} to="/play/competition">
            Competition
          </NavLink>
          {user?.is_admin ? (
            <NavLink className={navClassName} to="/admin">
              Admin
            </NavLink>
          ) : null}
        </nav>

        <div className="topbar-actions">
          {!initialized ? <span className="eyebrow">Checking session...</span> : null}
          {user ? (
            <>
              <NavLink className="user-link" to="/profile">
                {user.username}
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

      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}
