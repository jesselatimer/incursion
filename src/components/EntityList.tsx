import React, { createContext, useState } from 'react';
import '../css/App.css';
import { map } from 'lodash';
import Entity from './Entity';
import { Choice } from '../models/Choice';
import type { EntityKey, Entity as EntityType } from '../models/Entity';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const DEFAULT_CHOICES: Choice[] = [];

type EntityListContext = {
  choices: Choice[];
  setChoices?: (choices: Choice[]) => void;
};

export const EntityListContext = createContext<EntityListContext>({
  choices: DEFAULT_CHOICES,
});

function EntityList({
  label,
  entities,
}: {
  label: string;
  entities: Record<EntityKey, EntityType>;
}) {
  const [choices, setChoices] = useState<Choice[]>(DEFAULT_CHOICES);

  // TODO: Figure out best way to surface changes to the summary
  return (
    <EntityListContext.Provider value={{ choices, setChoices }}>
      <h3>{label}</h3>
      <p>Selected {label}: </p>
      <ul>
        {map(choices, (choice) => {
          return (
            <li key={'choice' + choice.entityKey}>
              {entities[choice.entityKey].label}
            </li>
          );
        })}
      </ul>
      <Container>
        <Row>
          {map(entities, (entity, entityKey) => {
            return (
              <Col key={'col_' + entityKey}>
                <Entity key={entityKey} entity={entity} entityKey={entityKey} />
              </Col>
            );
          })}
        </Row>
      </Container>
    </EntityListContext.Provider>
  );
}

export default EntityList;
