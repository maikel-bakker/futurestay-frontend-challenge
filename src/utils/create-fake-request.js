export const ABORT_ERROR_MESSAGE = 'Fetch aborted';

/**
 * Create a fake fetch that returns a promise that resolves with the provided data after the provided timeout
 * Also returns a function to abort the fake fetch/promise
 * @param data {any}
 * @param timeout {number}
 * @returns {{abort, fetch: Promise<any>}}
 */
export function createFakeFetch(data, timeout = 15000) {
  let abort;
  const fetch = new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve(data);
    }, timeout);

    abort = () => {
      clearTimeout(timer);
      reject(new Error(ABORT_ERROR_MESSAGE));
    };
  });

  return {
    fetch,
    abort,
  };
}
