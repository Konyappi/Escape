import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="homeShell">
      <section className="hero">
        <div className="heroBackdrop" />
        <div className="heroContent">
          <p className="eyebrow">Facility 09</p>
          <h1>
            OCR
            <span>Escape Room</span>
          </h1>
          <p>Solve the clues. Decode the secrets. Escape the room.</p>
          <div className="heroActions">
            <Link className="primaryButton" to="/play">Play Now</Link>
            <Link className="secondaryButton" to="/how-to-play">How To Play</Link>
            <Link className="ghostButton" to="/leaderboard">Leaderboard</Link>
          </div>
        </div>
      </section>
      <section className="homeBand">
        <div>
          <span>10</span>
          <p>locked stages</p>
        </div>
        <div>
          <span>OCR</span>
          <p>document clues</p>
        </div>
        <div>
          <span>3</span>
          <p>lives per run</p>
        </div>
      </section>
    </main>
  );
}
