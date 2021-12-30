import logo from './logo.svg';
import './App.css';
import RouterAll from './router/Router';
import RouterAll2 from './router/Router2';
import RouterAll3 from './router/Router3';
import { Navigate } from 'react-router-dom';
import auth from './router/auth';

function App() {
  return (
    <div className="App">
      {/* <RouterAll/> */}
      {/* <RouterAll2/> */}
      <button onClick={() => {
        auth.login(null);
      }}>Change auth</button>
      <RouterAll3/>
    </div>
  );
}

export default App;