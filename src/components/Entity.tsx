import { Entity as EntityModel } from '../models/Entity';
import Markdown from './Markdown';
import Card from 'react-bootstrap/Card';
import { DataContext, CategoryChoicesContext } from './App';
import { useContext, useMemo } from 'react';
import { map, sortBy } from 'lodash';
import EntityLevel from './EntityLevel';

function Entity({ entity }: { entity: EntityModel }) {
  const dataByKey = useContext(DataContext);
  const { entitiesByKey, entityLevelsByKey } = dataByKey;
  const entityKey = entity.key;

  const { categoryChoices } = useContext(CategoryChoicesContext);
  const choices = useMemo(
    () => categoryChoices[entity.category] || [],
    [categoryChoices, entity]
  );
  const { choice } = useMemo(() => {
    const choice = choices.find((choice) => choice.entityKey === entityKey);
    return {
      choice,
    };
  }, [choices, entity, entityKey]);

  return (
    <Card border={choice ? 'light' : 'secondary'} text={choice ? 'light' : ''}>
      <Card.Img variant="top" src={entity.imageUrl} />
      <Card.Body>
        <Card.Title>{entity.label}</Card.Title>
        {entity.grantedBy && (
          <Card.Subtitle>
            Granted by: <em>{entitiesByKey[entity.grantedBy].label}</em>
          </Card.Subtitle>
        )}
        {(entity.grants?.length || 0) > 0 && (
          <Card.Subtitle>
            Grants:{' '}
            <em>
              {(entity.grants || [])
                .map((e) => entitiesByKey[e].label)
                .join(', ')}
            </em>
          </Card.Subtitle>
        )}
        {Boolean(entity.description) && (
          <Markdown>{entity.description}</Markdown>
        )}
        {map(entity.entityLevels, (levelKey) => {
          const entityLevel = entityLevelsByKey[levelKey];
          if (entity.grantedBy && !entityLevel.description) return;
          return <EntityLevel entity={entity} entityLevel={entityLevel} />;
        })}
        {entity.grants && entity.grants.length > 0 && (
          <>
            <Card.Subtitle>Grants</Card.Subtitle>
            <div className="d-grid gap-2">
              {map(sortBy(entity.grants), (grantedKey) => {
                const grantedEntity = entitiesByKey[grantedKey];
                return <Entity entity={grantedEntity} />;
              })}
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default Entity;
