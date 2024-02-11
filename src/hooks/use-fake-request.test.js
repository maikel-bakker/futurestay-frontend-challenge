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

    const { result } = renderHook(() => useFakeRequest(fakeData, 1000));

    act(() => {
      result.current.startRequest();
    });

    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    // Fast-forward until all timers have been executed
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
      expect(result.current.data).toEqual(fakeData);
      expect(result.current.error).toBeNull();
    });
  });

  // @TODO: debug the console error in this test
  it('handles request abortion correctly', async () => {
    const fakeData = { message: 'Fake data' };

    mockCreateFakeFetch.mockReturnValue({
      fetch: Promise.resolve(fakeData),
      abort: jest.fn(),
    });

    const { result } = renderHook(() => useFakeRequest(fakeData, 10000));

    act(() => {
      result.current.startRequest();
    });

    // Abort the request before the fake fetch is complete
    act(() => {
      result.current.completeRequest();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
      expect(result.current.data).toEqual(fakeData); // Data should be set by completeRequest
      expect(result.current.error).toBeNull();
    });
  });

  it('sets error correctly if fetch fails', async () => {
    // Simulate an error response
    const errorMessage = 'An error occurred';

    mockCreateFakeFetch.mockReturnValue({
      fetch: Promise.reject(new Error(errorMessage)),
      abort: jest.fn(),
    });

    const { result } = renderHook(() => useFakeRequest({}, 1000)); // fakeData is not used by createFakeFetch mock

    act(() => {
      result.current.startRequest();
    });

    // Wait for the hook to process the rejected promise
    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
      expect(result.current.error).not.toBeNull();
      expect(result.current.error.message).toEqual(errorMessage);
      expect(result.current.data).toBeNull();
    });
  });
});
