import logo from './logo.svg';
import './App.css';
import RegistrationForm from './components/form';
import ThankYouPage from './components/ThankYou';
import { useState } from 'react';

function App() {
  const [isCompleted, setisCompleted] = useState(false)

  function PageChange(value) {
    setisCompleted(()=>value)
  }

  return (
    <div className="App">
     {
      !isCompleted ? <><div className="left-img"></div>
      <RegistrationForm PageChange={PageChange} /></> :<ThankYouPage PageChange={PageChange}/>
     } 
    </div>
  );
}

export default App;
