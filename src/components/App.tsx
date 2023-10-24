import React, { useMemo, useState } from 'react';
import '../css/App.css';
import Summary from './Summary';
import { ALL_ENTITIES } from '../data/entities/index';
import EntityList from './EntityList';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { groupBy, map } from 'lodash';
import { Choice } from '../models/Choice';
import { CategoryKey } from '../models/Category';
import { CATEGORIES, DEFAULT_TRUE_MAGE } from '../data';
import { Entity } from '../models/Entity';
import ContextProvider from './ContextProvider';
import { TrueMage } from '../models/TrueMage';

function App() {
  const entitiesByCategory = useMemo(
    () => groupBy(ALL_ENTITIES, (entity) => entity.category.key),
    [ALL_ENTITIES]
  );

  // TODO: have this read from local storage
  // TODO: implement multiple users (store each user in local storage, use state to set user)
  const [trueMage, setTrueMage] = useState<TrueMage>(DEFAULT_TRUE_MAGE);
  const [categoryChoices, setAllChoicesByCategory] = useState<
    Record<CategoryKey, Choice[]>
  >({});

  return (
    <ContextProvider
      state={{
        trueMage,
        setTrueMage,
        categoryChoices,
        setAllChoicesByCategory,
      }}
    >
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Incursion</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <Col sm={3}>
            <Summary categoryChoices={categoryChoices} />
          </Col>
          <Col>
            {/* TODO: Figure out levels, especially in regards to Potentials */}
            {map(
              entitiesByCategory,
              (entities: Entity[], categoryKey: CategoryKey) => {
                const category = CATEGORIES[categoryKey];
                return (
                  <EntityList
                    key={categoryKey + 'EntityList'}
                    label={category.label}
                    entities={entities}
                    choices={categoryChoices[categoryKey] || []}
                  />
                );
              }
            )}
          </Col>
        </Row>
      </Container>
    </ContextProvider>
  );
}

export default App;
