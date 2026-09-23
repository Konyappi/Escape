import { useRef, useState } from 'react';
import Modal from './Modal.jsx';
import OCRScanner from './OCRScanner.jsx';

export default function DocumentViewer({ document, scannedText, onClose, onScanned }) {
  const viewerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [isRevealed, setIsRevealed] = useState(false);

  const zoomIn = () => setZoom((current) => Math.min(1.5, current + 0.1));
  const zoomOut = () => setZoom((current) => Math.max(0.8, current - 0.1));
  const resetZoom = () => setZoom(1);

  const toggleFullscreen = async () => {
    if (!viewerRef.current) {
      return;
    }

    if (globalThis.document.fullscreenElement) {
      await globalThis.document.exitFullscreen?.();
      return;
    }

    await viewerRef.current.requestFullscreen?.();
  };

  const handleScanStart = () => setIsRevealed(false);
  const handleScanSuccess = () => setIsRevealed(true);

  return (
    <Modal title={document.title} onClose={onClose}>
      <p className="documentSubtitle">A torn note found near the locked intake chamber.</p>
      <div className="documentViewer" ref={viewerRef}>
        <div className={`documentSheet ${document.color} ${isRevealed ? '' : 'isLocked'}`}>
          <div className="documentMeta">
            <div className="docStamp"><span aria-hidden="true">[ ]</span> DOCUMENT</div>
            {isRevealed && document.image ? (
              <div className="viewerControls" aria-label="Image viewer controls">
                <button type="button" onClick={zoomOut} aria-label="Zoom out" title="Zoom out">-</button>
                <button type="button" onClick={resetZoom} aria-label="Reset zoom" title="Reset zoom">{Math.round(zoom * 100)}%</button>
                <button type="button" onClick={zoomIn} aria-label="Zoom in" title="Zoom in">+</button>
                <button type="button" onClick={toggleFullscreen} aria-label="Toggle fullscreen" title="Toggle fullscreen">FULL</button>
              </div>
            ) : null}
          </div>
          {!isRevealed ? (
            <div className="lockedDocument">
              <strong>DOCUMENT LOCKED</strong>
              <p>This evidence is unreadable until it is scanned.</p>
            </div>
          ) : document.image ? (
            <div className="documentViewport">
              <img
                src={document.image}
                alt={document.title}
                className="documentImage"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>
          ) : (
            <pre>{document.text}</pre>
          )}
        </div>
      </div>
      <OCRScanner
        document={document}
        cachedText={scannedText}
        onScanStart={handleScanStart}
        onScanSuccess={handleScanSuccess}
        onScanned={onScanned}
      />
    </Modal>
  );
}
