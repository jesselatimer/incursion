import React from 'react';
import logo from './logo.svg';
import './App.css';
import Summary from './components/Summary';
import { TrueMage } from './models/TrueMage';

function App() {
  const trueMage = new TrueMage();

  return (
    <div className="App">
      <header className="App-header">Incursion</header>
      <Summary trueMage={trueMage} />
    </div>
  );
}

export default App;
