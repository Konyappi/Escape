import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DocumentViewer from '../components/DocumentViewer.jsx';
import GameHeader from '../components/GameHeader.jsx';
import GameOver from '../components/GameOver.jsx';
import HintButton from '../components/HintButton.jsx';
import PuzzleInput from '../components/PuzzleInput.jsx';
import StageTools from '../components/StageTools.jsx';
import StartGamePanel from '../components/StartGamePanel.jsx';
import { createNewProgress, getSavedProgress, useGame } from '../hooks/useGame.js';
import { safeWrite, STORAGE_KEYS } from '../utils/storage.js';

export default function Game() {
  const savedProgress = useMemo(() => getSavedProgress(), []);
  const [isPlaying, setIsPlaying] = useState(Boolean(savedProgress));
  const [startingProgress, setStartingProgress] = useState(savedProgress ?? createNewProgress());
  const [openDocument, setOpenDocument] = useState(null);
  const game = useGame(startingProgress, { isActive: isPlaying });
  const { progress, currentStage } = game;

  const startNew = (nickname) => {
    const next = createNewProgress(nickname);
    safeWrite(STORAGE_KEYS.progress, next);
    setStartingProgress(next);
    game.restart(next.nickname);
    setIsPlaying(true);
  };

  if (!isPlaying) {
    return (
      <StartGamePanel
        savedProgress={savedProgress}
        onContinue={() => setIsPlaying(true)}
        onStartNew={startNew}
      />
    );
  }

  if (progress.gameOver) {
    return <GameOver onRestart={() => game.restart(progress.nickname)} />;
  }

  const usedHintCount = progress.usedHints[currentStage.id] ?? 0;
  const revealedHints = currentStage.hints.slice(0, usedHintCount);

  return (
    <main className="gameShell">
      <GameHeader progress={progress} />

      <section className="roomGrid">
        <div className="roomPanel">
          <div className="roomTitle">
            <p className="eyebrow">{currentStage.difficulty}</p>
            <h2>{currentStage.title}</h2>
          </div>
          <p className="roomCopy">{currentStage.room}</p>

          <div className="clueStrip">
            {currentStage.environmentalClues.map((clue) => (
              <div className="clueChip" key={clue}>{clue}</div>
            ))}
          </div>

          <div className="documentGrid">
            {currentStage.documents.map((document) => (
              <button
                className={`documentCard ${document.color}`}
                key={document.id}
                type="button"
                onClick={() => setOpenDocument(document)}
              >
                <span>{document.title}</span>
                <small>{progress.scannedTexts[document.id] ? 'Scanned' : 'Unscanned'}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="controlStack">
          <StageTools stage={currentStage} scannedTexts={progress.scannedTexts} finalPreview={game.finalPreview} />

          {revealedHints.length ? (
            <div className="hintLog">
              <h3>Hints Used</h3>
              {revealedHints.map((hint, index) => (
                <p key={hint}>Hint {index + 1}: {hint}</p>
              ))}
            </div>
          ) : null}

          <PuzzleInput stage={currentStage} onSubmit={game.submitAnswer} />

          <div className="buttonRow">
            <HintButton stage={currentStage} usedCount={usedHintCount} onUseHint={() => game.useHint(currentStage.id)} />
            <button className="ghostButton" type="button" onClick={() => game.restart(progress.nickname)}>
              Restart
            </button>
            <Link className="ghostButton" to="/">Home</Link>
          </div>

          {game.feedback ? <div className={`feedback ${game.feedback.type}`}>{game.feedback.text}</div> : null}
        </div>
      </section>

      {openDocument ? (
        <DocumentViewer
          document={openDocument}
          scannedText={progress.scannedTexts[openDocument.id]}
          onScanned={game.recordScan}
          onClose={() => setOpenDocument(null)}
        />
      ) : null}
    </main>
  );
}
