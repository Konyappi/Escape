export default function Lives({ lives }) {
  return (
    <div className="hudBlock">
      <span>LIVES</span>
      <strong aria-label={`${lives} lives remaining`}>
        {Array.from({ length: 3 }, (_, index) => (index < lives ? '♥' : '◆')).join(' ')}
      </strong>
    </div>
  );
}
