import { renderHook, act, waitFor } from '@testing-library/react';
import { useFakeRequest } from './use-fake-request';
import { createFakeFetch } from '../utils';

jest.mock('../utils', () => {
  return {
    createFakeFetch: jest.fn(),
  };
});

const mockCreateFakeFetch = createFakeFetch;

jest.useFakeTimers();

describe('useFakeRequest', () => {
  it('starts and completes request successfully', async () => {
    const fakeData = { message: 'Fake data' };

    mockCreateFakeFetch.mockReturnValue({
      fetch: Promise.resolve(fakeData),
      abort: jest.fn(),
    });

    const { result } = renderHook(() =>
      useFakeRequest({ fakeData, duration: 1000 })
    );

    act(() => {
      result.current.startRequest();
    });

    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(fakeData);
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });

  it('handles request abortion correctly', async () => {
    const fakeData = { message: 'Fake data' };

    mockCreateFakeFetch.mockReturnValue({
      fetch: Promise.resolve(fakeData),
      abort: jest.fn(),
    });

    const { result } = renderHook(() =>
      useFakeRequest({ fakeData, duration: 10000 })
    );

    act(() => {
      result.current.startRequest();
    });

    act(() => {
      result.current.completeRequest();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(fakeData);
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });

  it('sets error correctly if fetch fails', async () => {
    const errorMessage = 'An error occurred';

    mockCreateFakeFetch.mockReturnValue({
      fetch: Promise.reject(new Error(errorMessage)),
      abort: jest.fn(),
    });

    const { result } = renderHook(() =>
      useFakeRequest({ fakeData: {}, duration: 1000 })
    );

    act(() => {
      result.current.startRequest();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    await waitFor(() => {
      expect(result.current.error.message).toEqual(errorMessage);
    });

    await waitFor(() => {
      expect(result.current.data).toBeNull();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
    });
  });

  it('Should call onStart when startRequest is called', async () => {
    const fakeData = { message: 'Fake data' };
    const onStart = jest.fn();

    mockCreateFakeFetch.mockReturnValue({
      fetch: Promise.resolve(fakeData),
      abort: jest.fn(),
    });

    const { result } = renderHook(() =>
      useFakeRequest({ fakeData, duration: 1000, onStart })
    );

    act(() => {
      result.current.startRequest();
    });

    expect(onStart).toHaveBeenCalled();
  });

  it('Should call onComplete when completeRequest is called', async () => {
    const fakeData = { message: 'Fake data' };
    const onComplete = jest.fn();

    mockCreateFakeFetch.mockReturnValue({
      fetch: Promise.resolve(fakeData),
      abort: jest.fn(),
    });

    const { result } = renderHook(() =>
      useFakeRequest({ fakeData, duration: 1000, onComplete })
    );

    act(() => {
      result.current.startRequest();
    });

    act(() => {
      result.current.completeRequest();
    });

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });
});
