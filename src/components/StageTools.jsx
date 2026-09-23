import { useMemo, useState } from 'react';
import { caesarDecode } from '../utils/cipher.js';
import { extractEverySecondWord, generateStageNinePassword } from '../utils/puzzle.js';

export default function StageTools({ stage, scannedTexts, finalPreview }) {
  const [selectedDocId, setSelectedDocId] = useState('');

  const scannedEntries = useMemo(
    () => stage.documents.map((document) => ({ document, text: scannedTexts[document.id] ?? '' })).filter((entry) => entry.text),
    [stage.documents, scannedTexts],
  );

  const selectedText = scannedTexts[selectedDocId] ?? scannedEntries[0]?.text ?? '';
  const hidden = stage.processor === 'everySecondWord' && selectedText ? extractEverySecondWord(selectedText) : '';
  const generatedStageNine = stage.id === 9 && selectedText ? generateStageNinePassword(selectedText) : '';
  const cipherMatch = selectedText.match(/Cipher:\s*([A-Z]+)/i)?.[1] ?? selectedText.match(/^([A-Z]{4,})/m)?.[1] ?? '';
  const decodedCipher = stage.type === 'cipher' && cipherMatch ? caesarDecode(cipherMatch, 3) : '';

  return (
    <aside className="toolPanel">
      <h3>Analysis Console</h3>
      <p>{stage.objective}</p>
      {scannedEntries.length ? (
        <label>
          Scanned source
          <select value={selectedDocId} onChange={(event) => setSelectedDocId(event.target.value)}>
            <option value="">Latest / first scan</option>
            {scannedEntries.map(({ document }) => (
              <option key={document.id} value={document.id}>
                {document.title}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="muted">No OCR text captured yet.</p>
      )}

      {decodedCipher ? (
        <div className="toolOutput">
          <span>Caesar -3</span>
          <strong>{decodedCipher}</strong>
        </div>
      ) : null}

      {hidden ? (
        <div className="toolOutput">
          <span>Every second word</span>
          <strong>{hidden}</strong>
        </div>
      ) : null}

      {generatedStageNine ? (
        <div className="toolOutput">
          <span>Generated password</span>
          <strong>{generatedStageNine}</strong>
        </div>
      ) : null}

      {stage.type === 'final' ? (
        <div className="toolOutput">
          <span>Solved archive preview</span>
          <strong>{finalPreview || 'Incomplete archive'}</strong>
        </div>
      ) : null}
    </aside>
  );
}
