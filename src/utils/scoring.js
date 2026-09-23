export const BASE_STAGE_SCORE = 1000;
export const TIME_BONUS_MAX = 500;
export const NO_HINT_BONUS = 300;
export const WRONG_ANSWER_PENALTY = 200;
export const HINT_PENALTY = 250;

export function calculateStageScore({ elapsedTime, hintsUsedInStage, mistakesInStage }) {
  const timeBonus = Math.max(0, TIME_BONUS_MAX - Math.floor(elapsedTime / 12));
  const hintBonus = hintsUsedInStage === 0 ? NO_HINT_BONUS : 0;
  const penalties = hintsUsedInStage * HINT_PENALTY + mistakesInStage * WRONG_ANSWER_PENALTY;
  return Math.max(0, BASE_STAGE_SCORE + timeBonus + hintBonus - penalties);
}

export function getPerformanceRank({ score, elapsedTime, hintsUsed, mistakes }) {
  if (score >= 12500 && elapsedTime <= 2700 && hintsUsed <= 3 && mistakes <= 3) return 'S';
  if (score >= 10500 && hintsUsed <= 5 && mistakes <= 6) return 'A';
  if (score >= 8500) return 'B';
  if (score >= 6000) return 'C';
  return 'D';
}

export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
