import React from 'react';
import '../css/App.css';
import { map } from 'lodash';
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
  // TODO: group by subCategory
  return (
    <Container>
      <h3>{label}</h3>
      <Container>
        <Row>
          {map(entities, (entity) => {
            return (
              <Col key={'col_' + entity.key}>
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
      </Container>
    </Container>
  );
}

export default EntityList;
