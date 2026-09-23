export default function GameOver({ onRestart }) {
  return (
    <section className="centerScreen">
      <div className="resultCard danger">
        <p className="eyebrow">Access terminated</p>
        <h1>GAME OVER</h1>
        <p>The facility lockout drained every life. Retry from Stage 1 with your current nickname.</p>
        <button className="primaryButton" type="button" onClick={onRestart}>
          Try Again
        </button>
      </div>
    </section>
  );
}
