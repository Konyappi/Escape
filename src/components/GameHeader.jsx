import Lives from './Lives.jsx';
import Score from './Score.jsx';
import StageProgress from './StageProgress.jsx';
import Timer from './Timer.jsx';

export default function GameHeader({ progress }) {
  return (
    <header className="gameHeader">
      <div>
        <p className="eyebrow">OCR Escape Room</p>
        <h1>Stage {progress.currentStage}/10</h1>
      </div>
      <StageProgress currentStage={progress.currentStage} />
      <div className="hud">
        <Timer elapsedTime={progress.elapsedTime} />
        <Score score={progress.score} />
        <Lives lives={progress.lives} />
      </div>
    </header>
  );
}
