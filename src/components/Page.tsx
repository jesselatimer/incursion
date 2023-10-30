import { useContext, useMemo } from 'react';
import Summary from './Summary';
import EntityList from './EntityList';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { groupBy, map } from 'lodash';
import { Choice } from '../models/Choice';
import { Category, CategoryKey } from '../models/Category';
import { DataContext } from './App';

// TODO: implement react router so we can have these on multiple pages
function Page({
  categoryChoices,
}: {
  categoryChoices: Record<CategoryKey, Choice[]>;
}) {
  const { entitiesByKey, categoriesByKey } = useContext(DataContext);

  const entitiesByCategory = useMemo(
    () => groupBy(entitiesByKey, (entity) => entity.category),
    [entitiesByKey]
  );

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
          {map(
            categoriesByKey,
            (_categories: Category[], categoryKey: CategoryKey) => {
              const entities = entitiesByCategory[categoryKey];
              return (
                <EntityList
                  key={categoryKey + 'EntityList'}
                  entities={entities}
                  choices={categoryChoices[categoryKey] || []}
                />
              );
            }
          )}
        </div>
      </>
    </>
  );
}

export default Page;
