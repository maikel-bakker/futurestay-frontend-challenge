import { renderHook, act } from '@testing-library/react';
import { useProgress } from './use-progress';

describe('useProgress hook', () => {
  jest.useFakeTimers();

  it('should start progress and reach maxProgress', () => {
    const duration = 5000;
    const maxProgress = 90;
    const { result } = renderHook(() =>
      useProgress(duration, 100, maxProgress)
    );

    act(() => {
      result.current.startProgress();
      jest.advanceTimersByTime(duration); // Advance time by the duration of the progress
    });

    expect(result.current.progress).toBe(maxProgress);
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
    const { result } = renderHook(() =>
      useProgress(duration, 100, maxProgress)
    );

    act(() => {
      result.current.startProgress();
      jest.advanceTimersByTime(duration);
    });

    expect(result.current.progress).toBe(maxProgress);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.progress).toBe(maxProgress);
  });
});
