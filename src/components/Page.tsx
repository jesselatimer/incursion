import { useContext, useMemo } from 'react';
import Summary from './Summary';
import EntityList from './EntityList';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { filter, groupBy, map } from 'lodash';
import { Category, CategoryKey } from '../models/Category';
import { CategoryChoicesContext, DataContext } from './App';
import { useLoaderData } from 'react-router-dom';
import { PageArgs } from '..';

function Page() {
  const { categoryChoices } = useContext(CategoryChoicesContext);
  const { entitiesByKey } = useContext(DataContext);
  const { categoryKey } = useLoaderData() as PageArgs['params'];

  const entities = useMemo(
    () => filter(entitiesByKey, (entity) => entity.category === categoryKey),
    [entitiesByKey, categoryKey]
  );

  if (!categoryKey) return null;
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Incursion</Navbar.Brand>
        </Container>
      </Navbar>
      <>
        <Summary categoryChoices={categoryChoices} />
        <div style={{ marginLeft: '25%' }}>
          <EntityList
            key={categoryKey + 'EntityList'}
            entities={entities}
            choices={categoryChoices[categoryKey] || []}
          />
        </div>
      </>
    </>
  );
}

export default Page;
