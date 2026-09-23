import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stages } from '../data/stages.js';
import { calculateStageScore, HINT_PENALTY } from '../utils/scoring.js';
import { checkAnswer, getFinalCode } from '../utils/puzzle.js';
import { safeRead, safeWrite, STORAGE_KEYS } from '../utils/storage.js';
import { useTimer } from './useTimer.js';

const initialProgress = {
  nickname: 'Anonymous',
  currentStage: 1,
  score: 0,
  lives: 3,
  elapsedTime: 0,
  hintsUsed: 0,
  mistakes: 0,
  scannedTexts: {},
  usedHints: {},
  stageStats: {},
  solvedTokens: {},
  completed: false,
  gameOver: false,
  startedAt: null,
};

export function createNewProgress(nickname = 'Anonymous') {
  return {
    ...initialProgress,
    nickname: nickname.trim() || 'Anonymous',
    startedAt: new Date().toISOString(),
  };
}

export function getSavedProgress() {
  return safeRead(STORAGE_KEYS.progress, null);
}

export function clearSavedProgress() {
  window.localStorage.removeItem(STORAGE_KEYS.progress);
}

function saveResult(result) {
  safeWrite(STORAGE_KEYS.result, result);
  const leaderboard = safeRead(STORAGE_KEYS.leaderboard, []);
  const nextLeaderboard = [...leaderboard, result]
    .sort((a, b) => b.score - a.score || a.time - b.time)
    .slice(0, 10);
  safeWrite(STORAGE_KEYS.leaderboard, nextLeaderboard);
}

function hasRequiredScans(stage, scannedTexts) {
  if (stage.requiredScan === 'all') {
    return stage.documents.every((document) => scannedTexts[document.id]);
  }
  return stage.documents.some((document) => scannedTexts[document.id]);
}

export function useGame(startingProgress, options = {}) {
  const navigate = useNavigate();
  const isActive = options.isActive ?? true;
  const [progress, setProgress] = useState(() => startingProgress ?? getSavedProgress() ?? createNewProgress());
  const [feedback, setFeedback] = useState(null);

  const currentStage = useMemo(
    () => stages.find((stage) => stage.id === progress.currentStage) ?? stages[0],
    [progress.currentStage],
  );

  const persist = useCallback((updater) => {
    setProgress((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      safeWrite(STORAGE_KEYS.progress, next);
      return next;
    });
  }, []);

  useTimer({
    isRunning: isActive && !progress.completed && !progress.gameOver,
    onTick: useCallback(() => {
      persist((current) => ({ ...current, elapsedTime: current.elapsedTime + 1 }));
    }, [persist]),
  });

  const recordScan = useCallback(
    (documentId, text) => {
      persist((current) => ({
        ...current,
        scannedTexts: {
          ...current.scannedTexts,
          [documentId]: text,
        },
      }));
    },
    [persist],
  );

  const useHint = useCallback(
    (stageId) => {
      persist((current) => {
        const usedForStage = current.usedHints[stageId] ?? 0;
        const stage = stages.find((item) => item.id === Number(stageId));
        if (!stage || usedForStage >= stage.hints.length) {
          return current;
        }
        return {
          ...current,
          score: Math.max(0, current.score - HINT_PENALTY),
          hintsUsed: current.hintsUsed + 1,
          usedHints: {
            ...current.usedHints,
            [stageId]: usedForStage + 1,
          },
          stageStats: {
            ...current.stageStats,
            [stageId]: {
              ...(current.stageStats[stageId] ?? {}),
              hints: ((current.stageStats[stageId] ?? {}).hints ?? 0) + 1,
            },
          },
        };
      });
    },
    [persist],
  );

  const submitAnswer = useCallback(
    (answer) => {
      if (!answer.trim()) {
        setFeedback({ type: 'warn', text: 'Enter an answer before submitting.' });
        return;
      }

      if (!hasRequiredScans(currentStage, progress.scannedTexts)) {
        setFeedback({
          type: 'warn',
          text: currentStage.requiredScan === 'all'
            ? 'Scan every document in this room before trying the lock.'
            : 'Scan at least one document before trying the lock.',
        });
        return;
      }

      if (!checkAnswer(currentStage, answer)) {
        persist((current) => {
          const nextLives = current.lives - 1;
          return {
            ...current,
            lives: nextLives,
            mistakes: current.mistakes + 1,
            gameOver: nextLives <= 0,
            stageStats: {
              ...current.stageStats,
              [currentStage.id]: {
                ...(current.stageStats[currentStage.id] ?? {}),
                mistakes: ((current.stageStats[currentStage.id] ?? {}).mistakes ?? 0) + 1,
              },
            },
          };
        });
        setFeedback({ type: 'error', text: 'Access denied. One life lost.' });
        return;
      }

      persist((current) => {
        const stats = current.stageStats[currentStage.id] ?? {};
        const stageScore = calculateStageScore({
          elapsedTime: current.elapsedTime,
          hintsUsedInStage: stats.hints ?? 0,
          mistakesInStage: stats.mistakes ?? 0,
        });
        const solvedTokens = {
          ...current.solvedTokens,
          [currentStage.id]: currentStage.rewardToken,
        };

        if (currentStage.id === stages.length) {
          const result = {
            nickname: current.nickname,
            score: current.score + stageScore,
            time: current.elapsedTime,
            hintsUsed: current.hintsUsed,
            mistakes: current.mistakes,
            stages: stages.length,
            completedAt: new Date().toISOString(),
          };
          saveResult(result);
          window.localStorage.removeItem(STORAGE_KEYS.progress);
          window.setTimeout(() => navigate('/result'), 150);
          return {
            ...current,
            score: result.score,
            solvedTokens,
            completed: true,
          };
        }

        return {
          ...current,
          currentStage: currentStage.id + 1,
          score: current.score + stageScore,
          solvedTokens,
        };
      });
      setFeedback({ type: 'success', text: currentStage.id === stages.length ? 'Final lock released.' : 'Door unlocked. Moving deeper.' });
    },
    [currentStage, navigate, persist, progress.scannedTexts],
  );

  const restart = useCallback(
    (nickname = progress.nickname) => {
      const next = createNewProgress(nickname);
      safeWrite(STORAGE_KEYS.progress, next);
      setProgress(next);
      setFeedback(null);
    },
    [progress.nickname],
  );

  const finalPreview = useMemo(() => getFinalCode(progress.solvedTokens), [progress.solvedTokens]);

  return {
    progress,
    currentStage,
    feedback,
    setFeedback,
    recordScan,
    useHint,
    submitAnswer,
    restart,
    finalPreview,
  };
}
