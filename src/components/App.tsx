import React, { useState } from 'react';
import logo from './logo.svg';
import '../css/App.css';
import Summary from './Summary';
import { TrueMage } from '../models/TrueMage';
import { POTENTIALS } from '../data/potentials';
import { map } from 'lodash';
import Entity from './Entity';

function App() {
  // TODO: have this read from local storage
  const [trueMage, setTrueMage] = useState(new TrueMage());

  return (
    <div className="App">
      <header className="App-header">Incursion</header>
      <Summary trueMage={trueMage} />
      <h2>Foundation</h2>
      <h3>Potentials</h3>
      {map(POTENTIALS, (potential, key) => {
        return <Entity entity={potential} key={key} />;
      })}
    </div>
  );
}

export default App;
