import React, { createContext, useState } from 'react';
import '../css/App.css';
import Summary from './Summary';
import { TrueMage } from '../models/TrueMage';
import { ALL_ENTITIES } from '../data/entities/index';
import EntityList from './EntityList';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { groupBy, map } from 'lodash';
import { Choice } from '../models/Choice';
import { CategoryKey } from '../models/Category';
import { CATEGORIES } from '../data';
import { Entity } from '../models/Entity';

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

  const [categoryChoices, setCategoryChoices] = React.useState<
    Record<CategoryKey, Choice[]>
  >({});
  // TODO: use hooks for these to prevent redefining

  const handleCategoryChoicesChange = (
    newChoices: Choice[],
    categoryKey: CategoryKey
  ) => {
    let newCategoryChoices = { ...categoryChoices };
    newCategoryChoices[categoryKey] = newChoices;

    setCategoryChoices(newCategoryChoices);
  };

  const entitiesByCategory = groupBy(
    ALL_ENTITIES,
    (entity) => entity.category.key
  );

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
            <Summary categoryChoices={categoryChoices} />
          </Col>
          <Col>
            <h2>Foundation</h2>
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
                    handleCategoryChoicesChange={handleCategoryChoicesChange}
                  />
                );
              }
            )}
          </Col>
        </Row>
      </Container>
    </TrueMageContext.Provider>
  );
}

export default App;
