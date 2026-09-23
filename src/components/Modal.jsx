export default function Modal({ title, children, onClose }) {
  return (
    <div className="modalBackdrop" role="presentation" onMouseDown={onClose}>
      <div className="modalPanel" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modalTopline">
          <h2>{title}</h2>
          <button className="iconButton" type="button" onClick={onClose} aria-label="Close modal">
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
