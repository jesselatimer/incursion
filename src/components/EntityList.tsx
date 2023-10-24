import React, { createContext, useState } from 'react';
import '../css/App.css';
import { map } from 'lodash';
import Entity from './Entity';
import { Choice } from '../models/Choice';
import type { EntityKey, Entity as EntityType } from '../models/Entity';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { CategoryKey } from '../models/Category';

function EntityList({
  label,
  entities,
  choices,
  handleCategoryChoicesChange,
}: {
  label: string;
  entities: EntityType[];
  choices: Choice[];
  handleCategoryChoicesChange: (
    newChoices: Choice[],
    categoryKey: CategoryKey
  ) => void;
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
                  handleCategoryChoicesChange={handleCategoryChoicesChange}
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
