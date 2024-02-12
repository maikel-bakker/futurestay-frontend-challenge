import { useState, useRef } from 'react';

/**
 * Calculate the progress percentage over a given duration
 * @param [props] {object}
 * @param [props.duration] {number}
 * @param [props.intervalTime] {number}
 * @param [props.maxProgress] {number} - The maximum progress percentage before it completes
 * @param [props.breakpoints] {number[]} - whenever a breakpoint is reached, the progress increment is halved
 * @param [props.breakpointMargin] {number} - the margin around a breakpoint where the progress increment is halved
 * @returns {{completeProgress: completeProgress, startProgress: startProgress, progress: number, resetProgress: resetProgress}}
 */
export function useProgress({
  duration = 15000,
  intervalTime = 100,
  maxProgress = 90,
  breakpoints = [],
  breakpointMargin = 5,
} = {}) {
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
      maxProgress,
      breakpoints,
      breakpointMargin
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
  maxProgress,
  breakpoints,
  breakpointMargin
) {
  const totalSteps = duration / intervalTime;
  const increment = maxProgress / totalSteps;

  const interval = setInterval(() => {
    setProgress((prevProgress) => {
      const isNearBreakpoint = breakpoints.some(
        (breakpoint) =>
          prevProgress + increment > breakpoint - breakpointMargin &&
          prevProgress + increment < breakpoint + breakpointMargin
      );

      const nextProgress = isNearBreakpoint
        ? prevProgress + increment / 2
        : prevProgress + increment;

      if (nextProgress >= maxProgress) {
        clearInterval(interval);
        return maxProgress;
      }
      return nextProgress;
    });
  }, intervalTime);

  return interval;
}
