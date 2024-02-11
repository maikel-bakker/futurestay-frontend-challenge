import { createFakeFetch, ABORT_ERROR_MESSAGE } from './create-fake-request';

const data = {
  message: 'Hello, world!',
};

describe('createFakeFetch', () => {
  jest.useFakeTimers();

  it('should resolve with the provided data after the specified timeout', () => {
    const timeout = 5000;
    const { fetch } = createFakeFetch(data, timeout);

    const promise = fetch.then((data) => {
      expect(data).toEqual(data);
    });

    jest.advanceTimersByTime(timeout);

    return promise;
  });

  it('should be aborted, rejecting the promise with an error', () => {
    const { fetch, abort } = createFakeFetch(data, 15000); // Using the default timeout here

    const promise = fetch.catch((error) => {
      expect(error.message).toBe(ABORT_ERROR_MESSAGE);
    });

    abort();
    jest.runAllTimers();

    return promise;
  });
});
