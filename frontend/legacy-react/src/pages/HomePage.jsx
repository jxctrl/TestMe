import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState("");
  const firstName = user?.username?.split(/\s+/)[0] || "Player";

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
          setError("Live stats are unavailable right now.");
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
      <section className="panel hero-panel home-hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">{user ? `Welcome back, ${firstName}` : "Now with competition mode"}</p>
          <h1>
            {user ? (
              <>
                Ready for another run?
                <span className="hero-highlight"> Climb the board again.</span>
              </>
            ) : (
              <>
                Test your knowledge.
                <span className="hero-highlight"> Beat the clock.</span>
              </>
            )}
          </h1>
          <p className="hero-text">
            Challenge yourself across subjects in English or Uzbek, switch between practice and competition,
            and keep every score tied to one account.
          </p>

          <div className="hero-actions">
            <Link className="primary-button" to={user ? "/play/practice" : "/register"}>
              {user ? "Start practice" : "Create account"}
            </Link>
            <Link className="ghost-button" to={user ? "/play/competition" : "/leaderboard"}>
              {user ? "Enter competition" : "View leaderboard"}
            </Link>
          </div>

          <div className="hero-stats-strip">
            <article className="hero-stat-tile">
              <span className="hero-stat-value">6+</span>
              <span className="hero-stat-label">Subjects</span>
            </article>
            <article className="hero-stat-tile">
              <span className="hero-stat-value">10</span>
              <span className="hero-stat-label">Questions per run</span>
            </article>
            <article className="hero-stat-tile">
              <span className="hero-stat-value">Live</span>
              <span className="hero-stat-label">Leaderboard</span>
            </article>
          </div>
        </div>

        <div className="hero-badge-cluster">
          <article className="spotlight-card accent-card">
            <span className="spotlight-label">{user ? "Signed in and synced" : "Built for students"}</span>
            <strong>
              {user
                ? "Your scores, history, and profile move with you across web and Android."
                : "One place for practice, timed competition, and ranked progress."}
            </strong>
            <p className="muted-text">
              {user
                ? "Jump into a practice run or push for a higher competition score."
                : "Create an account once and keep every finished run saved."}
            </p>
          </article>

          <article className="spotlight-card">
            <span className="spotlight-label">System snapshot</span>
            <strong>{stats ? `${stats.total_quizzes_taken} total runs` : "Loading live stats..."}</strong>
            <p className="muted-text">
              {stats
                ? `${stats.active_users_today} active today · ${stats.average_score}% average score`
                : "The board, activity, and score averages update from the live backend."}
            </p>
          </article>

          <div className="hero-pill-row">
            <span className="mini-pill">English + Uzbek</span>
            <span className="mini-pill">Practice + competition</span>
            <span className="mini-pill">FastAPI + mobile sync</span>
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

      <section className="action-grid">
        <article className="panel action-card">
          <p className="launch-kicker">Practice</p>
          <h2>Short runs with instant feedback.</h2>
          <p className="muted-text">
            Move question by question, learn what you missed, and build confidence without timer pressure.
          </p>
          <Link className="ghost-button" to={user ? "/play/practice" : "/register"}>
            {user ? "Open practice" : "Join now"}
          </Link>
        </article>

        <article className="panel action-card">
          <p className="launch-kicker">Competition</p>
          <h2>Timed rounds built for pressure.</h2>
          <p className="muted-text">
            Every correct answer is worth 1,000 points. Move fast, stay sharp, and chase the top spots.
          </p>
          <Link className="ghost-button" to={user ? "/play/competition" : "/login"}>
            {user ? "Enter competition" : "Login to compete"}
          </Link>
        </article>

        <article className="panel action-card">
          <p className="launch-kicker">{user ? "Profile" : "Progress"}</p>
          <h2>{user ? "See your history, best scores, and account details." : "Keep your scores synced across devices."}</h2>
          <p className="muted-text">
            {user
              ? "Your profile keeps recent runs, subject highs, and account details in one place."
              : "Create an account once and come back to the same progress from any screen."}
          </p>
          <Link className="ghost-button" to={user ? "/profile" : "/register"}>
            {user ? "Open profile" : "Get started"}
          </Link>
        </article>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Leaderboard preview</p>
            <h2>Top performers in the arena</h2>
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
