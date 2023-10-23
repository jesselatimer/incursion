import React, { createContext, useState } from 'react';
import '../css/App.css';
import Summary from './Summary';
import { TrueMage } from '../models/TrueMage';
import { POTENTIALS } from '../data/potentials';
import EntityList from './EntityList';
import { SOURCES } from '../data/sources';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Incursion</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <Col sm={3}>
            <Summary />
          </Col>
          <Col>
            {' '}
            <h2>Foundation</h2>
            <EntityList label="Potentials" entities={POTENTIALS} />
            <EntityList label="Sources" entities={SOURCES} />
          </Col>
        </Row>
      </Container>
    </TrueMageContext.Provider>
  );
}

export default App;
