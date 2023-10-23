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

  return (
    <EntityListContext.Provider value={{ choices, setChoices }}>
      <h3>{label}</h3>
      <Container>
        <Row>
          {map(entities, (entity, entityKey) => {
            return (
              <Col>
                <Entity entity={entity} entityKey={entityKey} />
              </Col>
            );
          })}
        </Row>
      </Container>
    </EntityListContext.Provider>
  );
}

export default EntityList;
