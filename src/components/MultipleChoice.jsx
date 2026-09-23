export default function MultipleChoice({ options = [], selected, onSelect }) {
  return (
    <div className="choiceGrid">
      {options.map((option) => (
        <button
          className={selected === option.value ? 'choiceCard selected' : 'choiceCard'}
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
