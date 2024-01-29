import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from 'react-router-dom';
import ProgressBarExercise from './progress-bar-exercise/progress-bar-exercise';
import './app.scss';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="layout-container">
          <div className="exercise-index">
            <h2 className="title">Exercises</h2>
            <ul className="exercise-links">
              <li>
                <NavLink to="/progress_bar">
                  Progress Bar
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="exercise-show">
            <Routes>
              <Route path="/progress_bar" element={<ProgressBarExercise />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
