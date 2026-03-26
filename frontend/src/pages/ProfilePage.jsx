import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { formatMode, formatScore, formatSubject } from "../lib/content";

export default function ProfilePage() {
  const { refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError("");

      try {
        const response = await refreshProfile();
        if (active) {
          setProfile(response);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [refreshProfile]);

  if (loading) {
    return (
      <section className="panel centered-panel">
        <p className="muted-text">Loading your profile...</p>
      </section>
    );
  }

  if (error) {
    return <div className="banner error-banner">{error}</div>;
  }

  return (
    <div className="stack-page">
      <section className="panel hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Player profile</p>
          <h1>{profile.username}</h1>
          <p className="muted-text">{profile.email}</p>
        </div>

        <div className="hero-badge-cluster">
          <div className="spotlight-card">
            <span className="spotlight-label">Member since</span>
            <strong>{new Date(profile.created_at).toLocaleDateString()}</strong>
          </div>
          <div className="spotlight-card">
            <span className="spotlight-label">Runs completed</span>
            <strong>{profile.stats.total_quizzes_taken}</strong>
          </div>
          <div className="spotlight-card">
            <span className="spotlight-label">Role</span>
            <strong>{profile.is_admin ? "Admin" : "Player"}</strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Best scores</p>
            <h2>Top subject results</h2>
          </div>
        </div>

        <div className="badge-grid">
          {profile.best_scores.length === 0 ? (
            <p className="muted-text">No scores yet. Complete a run to populate this section.</p>
          ) : (
            profile.best_scores.map((item) => (
              <article className="score-chip" key={item.subject}>
                <span>{formatSubject(item.subject)}</span>
                <strong>{item.best_score}</strong>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">History</p>
            <h2>Recent completed runs</h2>
          </div>
        </div>

        {profile.score_history.length === 0 ? (
          <p className="muted-text">Your score history will appear here after the first run.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Mode</th>
                  <th>Score</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {profile.score_history.map((item) => (
                  <tr key={item.id}>
                    <td>{formatSubject(item.subject)}</td>
                    <td>{formatMode(item.mode)}</td>
                    <td>{formatScore(item.mode, item.score)}</td>
                    <td>{new Date(item.completed_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
