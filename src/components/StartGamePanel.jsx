import { useState } from 'react';

export default function StartGamePanel({ savedProgress, onContinue, onStartNew }) {
  const [nickname, setNickname] = useState(savedProgress?.nickname ?? '');

  return (
    <section className="centerScreen">
      <div className="startPanel">
        <p className="eyebrow">Enter Facility</p>
        <h1>Player Name</h1>
        <input
          type="text"
          maxLength="18"
          value={nickname}
          placeholder="Anonymous"
          onChange={(event) => setNickname(event.target.value)}
        />
        <button className="primaryButton" type="button" onClick={() => onStartNew(nickname)}>
          Start Game
        </button>
        {savedProgress && !savedProgress.completed ? (
          <div className="continueBox">
            <p>Continue saved run at Stage {savedProgress.currentStage}?</p>
            <button className="secondaryButton" type="button" onClick={onContinue}>
              Continue
            </button>
            <button className="ghostButton" type="button" onClick={() => onStartNew(nickname)}>
              New Game
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
