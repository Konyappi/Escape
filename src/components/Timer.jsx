import { formatTime } from '../utils/scoring.js';

export default function Timer({ elapsedTime }) {
  return (
    <div className="hudBlock">
      <span>TIME</span>
      <strong>{formatTime(elapsedTime)}</strong>
    </div>
  );
}
