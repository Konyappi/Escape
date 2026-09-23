import { useEffect } from 'react';

export function useTimer({ isRunning, onTick }) {
  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      onTick();
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, onTick]);
}
