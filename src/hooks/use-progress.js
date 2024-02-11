import { useState, useRef } from 'react';

/**
 * Calculate the progress percentage over a given duration
 * @param duration {number}
 * @param intervalTime {number}
 * @param maxProgress {number} - The maximum progress percentage before it completes
 * @returns {{completeProgress: completeProgress, startProgress: startProgress, progress: number, resetProgress: resetProgress}}
 */
export function useProgress(
  duration = 15000,
  intervalTime = 100,
  maxProgress = 90
) {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  const startProgress = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setProgress(0);
    intervalRef.current = startProgressInterval(
      setProgress,
      duration,
      intervalTime,
      maxProgress
    );
  };

  const completeProgress = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setProgress(100);
  };

  const resetProgress = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setProgress(0);
  };

  return {
    progress,
    startProgress,
    completeProgress,
    resetProgress,
  };
}

function startProgressInterval(
  setProgress,
  duration,
  intervalTime,
  maxProgress = 90
) {
  const totalSteps = duration / intervalTime;
  const increment = maxProgress / totalSteps;

  const interval = setInterval(() => {
    setProgress((prevProgress) => {
      const nextProgress = Math.round(prevProgress + increment);
      if (nextProgress >= maxProgress) {
        clearInterval(interval);
        return maxProgress;
      }
      return nextProgress;
    });
  }, intervalTime);

  return interval;
}
