import { useRef, useState } from 'react';
import { ABORT_ERROR_MESSAGE, createFakeFetch } from '../utils';

/**
 * Simulate a request with fake data and a timeout
 * @param fakeData {unknown}
 * @param timeout {number}
 * @returns {{isLoading: boolean, data: unknown, startRequest: () => void, completeRequest: () => void, error: unknown}}
 */
export function useFakeRequest(fakeData, timeout = 15000) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortFetchRef = useRef(() => {});

  const startRequest = () => {
    setIsLoading(true);
    const { fetch, abort } = createFakeFetch(fakeData, timeout);
    abortFetchRef.current = abort;

    fetch
      .then((fetchedData) => {
        setData(fetchedData);
        setError(null);
      })
      .catch((fetchError) => {
        if (fetchError.message === ABORT_ERROR_MESSAGE) {
          console.log('Fetch was aborted');
        } else {
          setError(fetchError);
          setData(null);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const completeRequest = () => {
    abortFetchRef.current();
    setData(fakeData);
    setError(null);
    setIsLoading(false);
  };

  return { data, error, isLoading, startRequest, completeRequest };
}
