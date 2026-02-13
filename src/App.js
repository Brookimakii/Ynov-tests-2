import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import RegistrationForm from './components/RegistrationForm'; 

function App() {

    return <RegistrationForm />;

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //     <div>
  //       <button onClick={clickOnMe}>Click me</button>
  //       <span data-testid="count">{count}</span>
  //     </div>
  //   </div>
  // );
}

export default App;
