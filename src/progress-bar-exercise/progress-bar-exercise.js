import { Button, Exercise, ProgressBar } from '../core';
import { useFakeRequest, useProgress } from '../hooks';
import { useState } from 'react';

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

const labels = {
  loading: 'Loading...',
  startRequest: 'Start request',
  finishRequest: 'Finish request',
};

const Solution = () => {
  const fakeData = {
    data: {
      message: 'Hello, World!',
    },
  };
  const duration = 30000; // adjust duration to test different scenarios
  const breakpoints = [10, 30, 60]; // adjust breakpoints to test different scenarios
  const [shouldUseBreakpoints, setShouldUseBreakpoints] = useState(false);
  const toggleBreakpoints = (event) => {
    setShouldUseBreakpoints(event.target.checked);
  };

  const { progress, startProgress, completeProgress } = useProgress({
    breakpoints: shouldUseBreakpoints ? breakpoints : [],
  });
  const { startRequest, completeRequest, isLoading, data, isCompleted } =
    useFakeRequest({
      fakeData,
      duration,
      onStart: startProgress,
      onComplete: completeProgress,
    });

  return (
    <div>
      <div className="progress-bar-exercise-header">
        <Button onClick={startRequest} color="green">
          {isLoading ? labels.loading : labels.startRequest}
        </Button>
        <label>
          <input type="checkbox" onChange={toggleBreakpoints} />
          Use breakpoints
        </label>

        <Button onClick={completeRequest} color="red">
          {labels.finishRequest}
        </Button>
      </div>
      <div className="progress-bar-exercise-body">
        <ProgressBar width={progress} shouldDisappear={isCompleted} />
      </div>
      {data?.data?.message && <p>{data.data.message}</p>}
    </div>
  );
};
