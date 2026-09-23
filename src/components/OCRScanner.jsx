import { useEffect, useState } from 'react';
import { getOcrErrorMessage, scanDocument } from '../api/apilogy.js';

export default function OCRScanner({ document, cachedText, onScanStart, onScanSuccess, onScanned }) {
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (status !== 'scanning') {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setProgress((current) => Math.min(94, current + 13));
    }, 140);

    return () => window.clearInterval(interval);
  }, [status]);

  const handleScan = async () => {
    onScanStart?.();
    setStatus('scanning');
    setProgress(8);
    setError('');
    setCopied(false);
    setDisplayedText('');
    try {
      const result = await scanDocument(document);
      setProgress(100);
      onScanned(document.id, result.text);
      setDisplayedText(result.text);
      onScanSuccess?.();
      setStatus('done');
    } catch (scanError) {
      setError(getOcrErrorMessage(scanError));
      setStatus('error');
    }
  };

  const handleCopy = async () => {
    if (!displayedText || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(displayedText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="ocrBox">
      <button className="primaryButton ocrActionButton" type="button" onClick={handleScan} disabled={status === 'scanning'}>
        <span aria-hidden="true">{status === 'scanning' ? '...' : '[ ]'}</span>
        {status === 'scanning' ? 'SCANNING...' : displayedText ? 'SCAN AGAIN' : status === 'error' ? 'TRY AGAIN' : 'SCAN WITH OCR'}
      </button>
      {status === 'scanning' ? (
        <div className="scanProgress" aria-label={`Scanning ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
          <strong>{progress}%</strong>
        </div>
      ) : null}
      {error ? (
        <div className="ocrErrorState" role="alert">
          <span>OCR ERROR</span>
          <p>{error}</p>
        </div>
      ) : null}
      {displayedText ? (
        <div className="ocrResult success">
          <div className="ocrResultHeader">
            <div>
              <span>OCR RESULT</span>
              <strong className="ocrStatus"><span aria-hidden="true">[OK]</span> Text detected</strong>
            </div>
            <button className="copyButton" type="button" onClick={handleCopy} disabled={!navigator.clipboard}>
              {copied ? 'Copied' : 'Copy Result'}
            </button>
          </div>
          <pre>{displayedText}</pre>
          <small>Scanned successfully using BigVision OCR</small>
        </div>
      ) : null}
    </div>
  );
}
