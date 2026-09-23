import { useState } from 'react';

export default function PuzzleInput({ stage, onSubmit }) {
  const [answer, setAnswer] = useState('');

  return (
    <form
      className="answerPanel"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(answer);
        setAnswer('');
      }}
    >
      <label htmlFor="answer">Lock Answer</label>
      <div className="answerRow">
        <input
          id="answer"
          type="text"
          value={answer}
          autoComplete="off"
          spellCheck="false"
          placeholder={stage.type === 'final' ? 'FINAL MASTER CODE' : 'Enter code or keyword'}
          onChange={(event) => setAnswer(event.target.value)}
        />
        <button className="primaryButton" type="submit">
          Unlock
        </button>
      </div>
    </form>
  );
}
