import Exercise from '../core/exercise';
import { useFakeRequest } from '../hooks';

const ProgressBarExercise = () => {
  return (
    <div className="progress-bar-exercise">
      <Exercise
        solution={<Solution />}
        specsUrl="https://github.com/futurestay/frontend-challenges/issues/1"
        title="Progress Bar Exercise"
      />
    </div>
  );
};

export default ProgressBarExercise;

// ----------------------------------------------------------------------------------

const Solution = () => {
  const { startRequest, completeRequest, isLoading, data } = useFakeRequest(
    {
      data: {
        message: 'Hello, World!',
      },
    },
    2000
  );

  return (
    <div>
      <button onClick={startRequest}>
        {isLoading ? 'Loading...' : 'Start request'}
      </button>
      <button onClick={completeRequest}>Finish request</button>
      <div>{data?.data?.message}</div>
    </div>
  );
};
