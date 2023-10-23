import React, { createContext, useState } from 'react';
import '../css/App.css';
import Summary from './Summary';
import { TrueMage } from '../models/TrueMage';
import { POTENTIALS } from '../data/potentials';
import EntityList from './EntityList';
import { SOURCES } from '../data/sources';

const DEFAULT_TRUE_MAGE: TrueMage = { name: 'True Mage' };

type TrueMageContext = {
  trueMage: TrueMage;
  setTrueMage?: (trueMage: TrueMage) => void;
};

export const TrueMageContext = createContext<TrueMageContext>({
  trueMage: DEFAULT_TRUE_MAGE,
});

function App() {
  // TODO: have this read from local storage
  // TODO: implement multiple users (store each user in local storage, use state to set user)
  const [trueMage, setTrueMage] = useState<TrueMage>(DEFAULT_TRUE_MAGE);

  return (
    <TrueMageContext.Provider value={{ trueMage, setTrueMage }}>
      <div className="App">
        <header className="App-header">Incursion</header>
        <Summary />
        <h2>Foundation</h2>
        <EntityList label="Potentials" entities={POTENTIALS} />
        <EntityList label="Sources" entities={SOURCES} />
      </div>
    </TrueMageContext.Provider>
  );
}

export default App;
