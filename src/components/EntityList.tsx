import React from 'react';
import '../css/App.css';
import { groupBy, map } from 'lodash';
import Entity from './Entity';
import { Choice } from '../models/Choice';
import type { Entity as EntityType } from '../models/Entity';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function EntityList({
  label,
  entities,
  choices,
}: {
  label: string;
  entities: EntityType[];
  choices: Choice[];
}) {
  const entitiesBySubCategory = groupBy(entities, 'subCategory');
  return (
    <Container>
      <h2>{label}</h2>
      <Container>
        <Row>
          {map(entitiesBySubCategory, (entities, subCategory) => {
            return (
              <Row key={subCategory + 'Row'}>
                <h3>{subCategory}</h3>
                {map(entities, (entity) => {
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
