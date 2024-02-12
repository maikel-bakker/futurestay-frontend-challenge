import { renderHook, act } from '@testing-library/react';
import { useProgress } from './use-progress';

describe('useProgress hook', () => {
  jest.useFakeTimers();

  it('should start progress and reach maxProgress', () => {
    const duration = 5000;
    const maxProgress = 90;
    const { result } = renderHook(() => useProgress({ duration, maxProgress }));

    act(() => {
      result.current.startProgress();
      jest.advanceTimersByTime(duration);
    });

    expect(Math.round(result.current.progress)).toBe(maxProgress);
  });

  it('should complete progress immediately when completeProgress is called', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.startProgress();
      jest.advanceTimersByTime(5000);
      result.current.completeProgress();
    });

    expect(result.current.progress).toBe(100);
  });

  it('should reset progress when resetProgress is called', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.startProgress();
      jest.advanceTimersByTime(7500);
      result.current.resetProgress();
    });

    expect(result.current.progress).toBe(0);
  });

  it('should not exceed maxProgress if duration is longer than given duration', () => {
    const duration = 15000;
    const maxProgress = 90;
    const { result } = renderHook(() => useProgress({ duration, maxProgress }));

    act(() => {
      result.current.startProgress();
      jest.advanceTimersByTime(duration);
    });

    expect(Math.round(result.current.progress)).toBe(maxProgress);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.progress).toBe(maxProgress);
  });

  it('should slow down progress at breakpoints considering the breakpoint margin', () => {
    const duration = 1000;
    const intervalTime = 10;
    const maxProgress = 90;
    const breakpoints = [45];
    const breakpointMargin = 5;
    const normalIncrement = maxProgress / (duration / intervalTime);
    const halvedIncrement = normalIncrement / 2;

    const intervalsToReachBreakpoint =
      (breakpoints[0] - breakpointMargin) / normalIncrement;

    const { result } = renderHook(() =>
      useProgress({
        duration,
        intervalTime,
        maxProgress,
        breakpoints,
        breakpointMargin,
      })
    );

    act(() => {
      result.current.startProgress();
    });

    // get to breakpoint
    act(() => {
      jest.advanceTimersByTime(
        Math.round(intervalsToReachBreakpoint * intervalTime)
      );
    });

    const progressAtBreakpoint = result.current.progress;

    act(() => {
      jest.advanceTimersByTime(10);
    });

    const progressPastBreakpoint = result.current.progress;

    expect(progressPastBreakpoint - progressAtBreakpoint).toBeCloseTo(
      halvedIncrement,
      1
    );
  });
});
