export default function Score({ score }) {
  return (
    <div className="hudBlock">
      <span>SCORE</span>
      <strong>{score.toLocaleString()}</strong>
    </div>
  );
}
