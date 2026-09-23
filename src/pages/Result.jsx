import { Link, Navigate } from 'react-router-dom';
import { formatTime, getPerformanceRank } from '../utils/scoring.js';
import { safeRead, STORAGE_KEYS } from '../utils/storage.js';

export default function Result() {
  const result = safeRead(STORAGE_KEYS.result, null);

  if (!result) {
    return <Navigate to="/" replace />;
  }

  const rank = getPerformanceRank({
    score: result.score,
    elapsedTime: result.time,
    hintsUsed: result.hintsUsed,
    mistakes: result.mistakes,
  });

  return (
    <main className="pageShell">
      <section className="resultCard">
        <p className="eyebrow">Final Escape</p>
        <h1>YOU ESCAPED!</h1>
        <div className="trophyScore">{result.score.toLocaleString()}</div>
        <dl className="resultStats">
          <div><dt>Time</dt><dd>{formatTime(result.time)}</dd></div>
          <div><dt>Stages</dt><dd>{result.stages}/10</dd></div>
          <div><dt>Hints</dt><dd>{result.hintsUsed}</dd></div>
          <div><dt>Mistakes</dt><dd>{result.mistakes}</dd></div>
          <div><dt>Performance</dt><dd>{rank}</dd></div>
        </dl>
        <div className="heroActions">
          <Link className="primaryButton" to="/play">Play Again</Link>
          <Link className="secondaryButton" to="/leaderboard">Leaderboard</Link>
          <Link className="ghostButton" to="/">Home</Link>
        </div>
      </section>
    </main>
  );
}
