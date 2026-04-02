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
          <p className="eyebrow">Mobile-ready study arena</p>
          <h1>Study sharper in English or Uzbek, then bring your score into the arena.</h1>
          <p className="hero-text">
            QuizArena now feels at home on Android with quick practice sessions, timed competition rounds,
            synced progress, and a calmer phone-first layout for everyday revision.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to={user ? "/play/practice" : "/register"}>
              {user ? "Start practice" : "Create account"}
            </Link>
            <Link className="ghost-button" to="/play/competition">
              Jump into competition
            </Link>
          </div>
          <div className="hero-pill-row">
            <span className="mini-pill">6 subjects</span>
            <span className="mini-pill">Practice + competition</span>
            <span className="mini-pill">English / Uzbek</span>
          </div>
        </div>

        <div className="hero-badge-cluster">
          <div className="spotlight-card accent-card">
            <span className="spotlight-label">{user ? `Welcome back, ${firstName}` : "Start your first run"}</span>
            <strong>{user ? "Your profile, scores, and leaderboard progress stay in sync." : "Create an account and keep your quiz history across devices."}</strong>
          </div>
          <div className="spotlight-card">
            <span className="spotlight-label">Arena activity</span>
            <strong>{stats ? `${stats.total_quizzes_taken} runs recorded` : "Live stats loading..."}</strong>
          </div>
          <div className="spotlight-card">
            <span className="spotlight-label">Mobile build</span>
            <strong>Native Android wrapper, dedicated mobile bundle, and account-based progress sync.</strong>
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

      <section className="launch-grid">
        <article className="panel launch-card">
          <p className="launch-kicker">Practice mode</p>
          <h2>Build confidence one question at a time.</h2>
          <p className="muted-text">
            Ten-question runs, immediate feedback, and a clean pace for daily review sessions.
          </p>
          <Link className="ghost-button" to="/play/practice">
            Open practice
          </Link>
        </article>

        <article className="panel launch-card">
          <p className="launch-kicker">Competition mode</p>
          <h2>Turn revision into a fast, timed challenge.</h2>
          <p className="muted-text">
            Race through questions with the ten-second timer and push your total points higher.
          </p>
          <Link className="ghost-button" to="/play/competition">
            Enter competition
          </Link>
        </article>

        <article className="panel launch-card">
          <p className="launch-kicker">{user ? "Player profile" : "Account setup"}</p>
          <h2>{user ? "Review your progress, best subjects, and history." : "Save scores, track progress, and return on any device."}</h2>
          <p className="muted-text">
            {user
              ? "Your profile keeps your best scores and completed runs in one place."
              : "Create an account or continue with Google to keep your runs synced."}
          </p>
          <Link className="ghost-button" to={user ? "/profile" : "/register"}>
            {user ? "Open profile" : "Create profile"}
          </Link>
        </article>
      </section>

      <section className="feature-grid">
        <article className="panel">
          <p className="eyebrow">Built for study rhythm</p>
          <h2>Short runs feel natural on a phone screen.</h2>
          <p className="muted-text">
            The Android-friendly layout keeps the app fast to scan, easy to tap, and ready for
            repeat practice sessions during small breaks.
          </p>
        </article>
        <article className="panel">
          <p className="eyebrow">Progress that sticks</p>
          <h2>Accounts, stats, and leaderboard position travel with you.</h2>
          <p className="muted-text">
            Sign in once, keep your profile synced, and move between web and Android without losing momentum.
          </p>
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
