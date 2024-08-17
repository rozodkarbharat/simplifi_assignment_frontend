import logo from './logo.svg';
import './App.css';
import RegistrationForm from './components/form';
import ThankYouPage from './components/ThankYou';
import { useState } from 'react';

function App() {
  const [isCompleted, setisCompleted] = useState(false)

  function PageChange(value) {
    setisCompleted(()=>isCompleted)
  }

  return (
    <div className="App">
     {
      !isCompleted ? <><div className="left-img"></div>
      <RegistrationForm/></> :<ThankYouPage/>
     } 
    </div>
  );
}

export default App;
