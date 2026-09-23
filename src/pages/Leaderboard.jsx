import { Link } from 'react-router-dom';
import { formatTime } from '../utils/scoring.js';
import { safeRead, STORAGE_KEYS } from '../utils/storage.js';

export default function Leaderboard() {
  const leaderboard = safeRead(STORAGE_KEYS.leaderboard, []);

  return (
    <main className="pageShell">
      <section className="contentPanel">
        <p className="eyebrow">Local Records</p>
        <h1>Leaderboard</h1>
        {leaderboard.length ? (
          <div className="leaderboardTable">
            {leaderboard.map((entry, index) => (
              <div className="leaderboardRow" key={`${entry.completedAt}-${entry.nickname}-${index}`}>
                <span>{index + 1}</span>
                <strong>{entry.nickname}</strong>
                <p>{entry.score.toLocaleString()}</p>
                <small>{formatTime(entry.time)}</small>
              </div>
            ))}
          </div>
        ) : (
          <p className="bodyCopy">No successful escapes recorded on this browser yet.</p>
        )}
        <div className="heroActions">
          <Link className="primaryButton" to="/play">Play</Link>
          <Link className="ghostButton" to="/">Home</Link>
        </div>
      </section>
    </main>
  );
}
