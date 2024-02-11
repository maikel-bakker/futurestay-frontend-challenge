import { useRef, useState } from 'react';
import { ABORT_ERROR_MESSAGE, createFakeFetch } from '../utils';

/**
 * Simulate a request with fake data for a given duration
 * @param props {object}
 * @param props.fakeData {unknown}
 * @param [props.duration] {number}
 * @param [props.onStart] {() => void}
 * @param [props.onComplete] {() => void}
 * @returns {{
 *  isLoading: boolean,
 *  data: unknown,
 *  startRequest: () => void,
 *  completeRequest: () => void,
 *  error: unknown,
 *  isCompleted: boolean
 * }}
 */
export function useFakeRequest({
  fakeData,
  duration = 15000,
  onStart,
  onComplete,
}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortFetchRef = useRef(() => {});

  const startRequest = () => {
    onStart?.();
    setData(null);
    setIsLoading(true);
    const { fetch, abort } = createFakeFetch(fakeData, duration);
    abortFetchRef.current = abort;

    fetch
      .then((fetchedData) => {
        setData(fetchedData);
        setError(null);
      })
      .catch((fetchError) => {
        if (fetchError.message === ABORT_ERROR_MESSAGE) {
          console.log('Fetch was aborted'); // for test and review purposes
        } else {
          setError(fetchError);
          setData(null);
        }
      })
      .finally(() => {
        onComplete?.();
        setIsLoading(false);
      });
  };

  const completeRequest = () => {
    abortFetchRef.current();
    setData(fakeData);
    setError(null);
    setIsLoading(false);
  };

  return {
    data,
    error,
    isLoading,
    startRequest,
    completeRequest,
    isCompleted: Boolean(data),
  };
}
