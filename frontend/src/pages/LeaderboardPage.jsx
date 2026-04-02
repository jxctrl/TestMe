import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { formatMode } from "../lib/content";

const MODES = [
  { value: "", label: "All modes" },
  { value: "practice", label: "Practice" },
  { value: "competition", label: "Competition" }
];

export default function LeaderboardPage() {
  const [mode, setMode] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadLeaderboard() {
      setLoading(true);
      setError("");

      try {
        const query = mode ? `?mode=${mode}&limit=20` : "?limit=20";
        const response = await api.get(`/leaderboard${query}`);
        if (!active) {
          return;
        }
        setEntries(response.entries || []);
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

    loadLeaderboard();

    return () => {
      active = false;
    };
  }, [mode]);

  return (
    <section className="stack-page">
      <div className="panel section-heading">
        <div>
          <p className="eyebrow">Scoreboard</p>
          <h1>{mode ? `${formatMode(mode)} leaderboard` : "Global leaderboard"}</h1>
        </div>
        <label className="field">
          <span>Mode</span>
          <select value={mode} onChange={(event) => setMode(event.target.value)}>
            {MODES.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? <div className="banner error-banner">{error}</div> : null}

      <section className="panel">
        {loading ? (
          <p className="muted-text">Loading leaderboard...</p>
        ) : entries.length === 0 ? (
          <p className="muted-text">No scores have been submitted for this mode yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Total score</th>
                  <th>Completed runs</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.user_id}>
                    <td data-label="Rank">{entry.rank}</td>
                    <td data-label="Player">{entry.username}</td>
                    <td data-label="Total score">{entry.total_score}</td>
                    <td data-label="Completed runs">{entry.completed_runs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}
