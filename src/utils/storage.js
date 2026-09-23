export const STORAGE_KEYS = {
  progress: 'ocr_escape_progress_v1',
  leaderboard: 'ocr_escape_leaderboard_v1',
  result: 'ocr_escape_last_result_v1',
};

export function safeRead(key, fallback) {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function safeWrite(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
