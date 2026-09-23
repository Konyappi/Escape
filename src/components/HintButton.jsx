import { useState } from 'react';
import Modal from './Modal.jsx';

export default function HintButton({ stage, usedCount, onUseHint }) {
  const [confirming, setConfirming] = useState(false);
  const nextHint = stage.hints[usedCount];

  if (!nextHint) {
    return <button className="secondaryButton" type="button" disabled>All hints used</button>;
  }

  return (
    <>
      <button className="secondaryButton" type="button" onClick={() => setConfirming(true)}>
        Use Hint {usedCount + 1}
      </button>
      {confirming ? (
        <Modal title="Use hint?" onClose={() => setConfirming(false)}>
          <p className="modalCopy">This will reduce your score by 250 points.</p>
          <blockquote className="hintPreview">{nextHint}</blockquote>
          <div className="modalActions">
            <button
              className="primaryButton"
              type="button"
              onClick={() => {
                onUseHint();
                setConfirming(false);
              }}
            >
              Use Hint
            </button>
            <button className="secondaryButton" type="button" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
