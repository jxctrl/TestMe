import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadHomeData() {
      try {
        const [statsResponse, leaderboardResponse] = await Promise.all([
          api.get("/stats"),
          api.get("/leaderboard?limit=5")
        ]);

        if (!active) {
          return;
        }

        setStats(statsResponse);
        setLeaders(leaderboardResponse.entries || []);
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
        }
      }
    }

    loadHomeData();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="stack-page">
      <section className="hero panel hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Full-stack foundation</p>
          <h1>React now has a dedicated home in QuizArena.</h1>
          <p className="hero-text">
            This app is wired to FastAPI routes for authentication, question delivery,
            score submission, leaderboards, stats, and admin workflows.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to={user ? "/play/practice" : "/register"}>
              {user ? "Start practice" : "Create account"}
            </Link>
            <Link className="ghost-button" to="/leaderboard">
              View leaderboard
            </Link>
          </div>
        </div>

        <div className="hero-badge-cluster">
          <div className="spotlight-card">
            <span className="spotlight-label">Backend coverage</span>
            <strong>Auth, scores, stats, questions, admin</strong>
          </div>
          <div className="spotlight-card">
            <span className="spotlight-label">Routing</span>
            <strong>Web builds live at `/app`; mobile builds ship as a native bundle</strong>
          </div>
          <div className="spotlight-card">
            <span className="spotlight-label">Developer flow</span>
            <strong>Vite dev server proxies API calls to FastAPI</strong>
          </div>
        </div>
      </section>

      {error ? <div className="banner error-banner">{error}</div> : null}

      <section className="stats-grid">
        <article className="panel stat-card">
          <p className="eyebrow">Total runs</p>
          <h2>{stats ? stats.total_quizzes_taken : "--"}</h2>
        </article>
        <article className="panel stat-card">
          <p className="eyebrow">Average score</p>
          <h2>{stats ? `${stats.average_score}%` : "--"}</h2>
        </article>
        <article className="panel stat-card">
          <p className="eyebrow">Active today</p>
          <h2>{stats ? stats.active_users_today : "--"}</h2>
        </article>
      </section>

      <section className="feature-grid">
        <article className="panel">
          <p className="eyebrow">Player flows</p>
          <h2>Practice and competition are API-backed.</h2>
          <p className="muted-text">
            Questions load from the backend, practice scores submit as `0-10`, and
            competition runs submit in `1000-point` increments.
          </p>
        </article>
        <article className="panel">
          <p className="eyebrow">Profile support</p>
          <h2>Session-aware pages share login state with the legacy site.</h2>
          <p className="muted-text">
            The React app uses the same browser storage keys as your existing HTML pages,
            so session state stays aligned during migration.
          </p>
        </article>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Leaderboard preview</p>
            <h2>Top performers</h2>
          </div>
          <Link className="ghost-button" to="/leaderboard">
            Open full board
          </Link>
        </div>

        <div className="leader-list">
          {leaders.length === 0 ? (
            <p className="muted-text">No scores yet. The first completed run will show up here.</p>
          ) : (
            leaders.map((entry) => (
              <article className="leader-row" key={entry.user_id}>
                <div className="leader-rank">{entry.rank}</div>
                <div>
                  <h3>{entry.username}</h3>
                  <p className="muted-text">{entry.completed_runs} runs completed</p>
                </div>
                <strong>{entry.total_score}</strong>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
