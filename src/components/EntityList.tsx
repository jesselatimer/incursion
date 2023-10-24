import React from 'react';
import '../css/App.css';
import { groupBy, map } from 'lodash';
import Entity from './Entity';
import { Choice } from '../models/Choice';
import type { Entity as EntityType } from '../models/Entity';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ALL_ENTITIES } from '../data/entities';

function EntityList({
  label,
  entities,
  choices,
}: {
  label: string;
  entities: EntityType[];
  choices: Choice[];
}) {
  if (!entities?.length) return null;
  const category = entities[0].category;
  const entitiesBySubCategory = groupBy(entities, 'subCategory');
  return (
    <Container>
      <h2>{label}</h2>
      <Container>
        <Row>
          {/* Mapping over all subcategories to preserve order */}
          {map(category.subCategories, (subCategory) => {
            const currentEntities = entitiesBySubCategory[subCategory];
            if (!currentEntities?.length) return null;
            const currentEntitiesByKey = groupBy(currentEntities, 'key');
            return (
              <Row key={subCategory + 'Row'}>
                <h3>{subCategory}</h3>
                {/* Mapping over all entities to preserve order */}
                {map(ALL_ENTITIES, (_, entityKey) => {
                  const entity = (currentEntitiesByKey[entityKey] || [])[0];
                  if (!entity) return null;
                  return (
                    <Col key={entity.key + 'Col'}>
                      <Entity
                        key={entity.key}
                        entity={entity}
                        entityKey={entity.key}
                        choices={choices}
                      />
                    </Col>
                  );
                })}
              </Row>
            );
          })}
        </Row>
      </Container>
    </Container>
  );
}

export default EntityList;
