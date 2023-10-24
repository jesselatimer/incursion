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
import { CategoryKey } from '../models/Category';
import { CATEGORIES } from '../data';
import { Entity } from '../models/Entity';

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
    </>
  );
}

export default Page;
