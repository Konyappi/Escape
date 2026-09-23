import { Link } from 'react-router-dom';

const steps = [
  'Inspect documents',
  'Scan clues with OCR',
  'Analyze the extracted information',
  'Solve the puzzle',
  'Unlock the next room',
  'Reach Stage 10',
  'Escape',
];

export default function HowToPlay() {
  return (
    <main className="pageShell">
      <section className="contentPanel">
        <p className="eyebrow">Briefing</p>
        <h1>How To Play</h1>
        <div className="stepList">
          {steps.map((step, index) => (
            <div className="stepItem" key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
        <p className="bodyCopy">
          OCR is used to extract text from documents and clues throughout the game. The scan gives readable text, but
          the answer still depends on your deduction.
        </p>
        <div className="heroActions">
          <Link className="primaryButton" to="/play">Play Now</Link>
          <Link className="ghostButton" to="/">Home</Link>
        </div>
      </section>
    </main>
  );
}
