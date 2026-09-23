import { stages } from '../data/stages.js';

export default function StageProgress({ currentStage }) {
  return (
    <div className="stageRail" aria-label="Stage progress">
      {stages.map((stage) => (
        <span
          className={stage.id === currentStage ? 'stageDot active' : stage.id < currentStage ? 'stageDot solved' : 'stageDot'}
          key={stage.id}
          title={`Stage ${stage.id}`}
        >
          {stage.id}
        </span>
      ))}
    </div>
  );
}
