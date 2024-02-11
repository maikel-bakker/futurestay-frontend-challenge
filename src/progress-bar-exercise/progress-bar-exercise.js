import { Button, Exercise } from '../core';
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
      <Button onClick={startRequest} color="green">
        {isLoading ? 'Loading...' : 'Start request'}
      </Button>
      <Button onClick={completeRequest} color="red">
        Finish request
      </Button>
      <div>{data?.data?.message}</div>
    </div>
  );
};
