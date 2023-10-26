import React, { useMemo } from 'react';
import Summary from './Summary';
import { ALL_ENTITIES } from '../data/entities/index';
import EntityList from './EntityList';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { groupBy, map } from 'lodash';
import { Choice } from '../models/Choice';
import { Category, CategoryKey } from '../models/Category';
import { CATEGORIES } from '../data';
import { Entity } from '../models/Entity';

// TODO: implement react router so we can have these on multiple pages
function Page({
  categoryChoices,
}: {
  categoryChoices: Record<CategoryKey, Choice[]>;
}) {
  const entitiesByCategory = useMemo(
    () => groupBy(ALL_ENTITIES, (entity) => entity.category.key),
    [ALL_ENTITIES]
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
            CATEGORIES,
            (categories: Category[], categoryKey: CategoryKey) => {
              const entities = entitiesByCategory[categoryKey];
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
        </div>
      </>
    </>
  );
}

export default Page;
