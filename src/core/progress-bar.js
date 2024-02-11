/**
 * Progress bar component
 * @param {Object} props
 * @param {number} props.width
 * @param {boolean} props.shouldDisappear
 * @returns {JSX.Element}
 */
export const ProgressBar = ({ width, shouldDisappear }) => {
  return (
    <div
      className={`progress-bar ${shouldDisappear ? 'progress-bar-disappear' : ''}`}>
      <div className="progress-bar-fill" style={{ width: `${width}%` }} />
    </div>
  );
};
