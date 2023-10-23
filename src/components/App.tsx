import React, { createContext, useState } from 'react';
import logo from './logo.svg';
import '../css/App.css';
import Summary from './Summary';
import { TrueMage } from '../models/TrueMage';
import { POTENTIALS } from '../data/potentials';
import { map } from 'lodash';
import Entity from './Entity';
import { Choice } from '../models/Choice';
import { Choices } from '../models/Choices';

type TrueMageContext = {
  trueMage: TrueMage;
  setTrueMage?: (trueMage: TrueMage) => void;
};

export const TrueMageContext = createContext<TrueMageContext>({
  trueMage: { name: 'True Mage' },
});

function App() {
  // TODO: have this read from local storage
  // TODO: implement multiple users (store each user in local storage, use state to set user)
  const [trueMage, setTrueMage] = useState({ name: 'True Mage' });

  return (
    <TrueMageContext.Provider value={{ trueMage, setTrueMage }}>
      <div className="App">
        <header className="App-header">Incursion</header>
        <Summary />
        <h2>Foundation</h2>
        <h3>Potentials</h3>
        {map(POTENTIALS, (potential, entityKey) => {
          return <Entity entity={potential} entityKey={entityKey} />;
        })}
      </div>
    </TrueMageContext.Provider>
  );
}

export default App;
