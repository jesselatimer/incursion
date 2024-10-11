import { Entity as EntityModel } from '../models/Entity';
import Markdown from './Markdown';
import Card from 'react-bootstrap/Card';
import {
  DataContext,
  REQUIRED_ENTITY_KEYS,
  CategoryChoicesContext,
} from './App';
import { useCallback, useContext, useMemo } from 'react';
import { map, sortBy } from 'lodash';
import { calculatePoints } from '../utils/calculatePoints';
import { Button, Col, Container, Row } from 'react-bootstrap';

function Entity({ entity }: { entity: EntityModel }) {
  const dataByKey = useContext(DataContext);
  const { categoriesByKey, pointTypesByKey, entitiesByKey, entityLevelsByKey } =
    dataByKey;
  const entityKey = entity.key;

  const { categoryChoices, addChoice, removeChoice } = useContext(
    CategoryChoicesContext
  );
  const choices = useMemo(
    () => categoryChoices[entity.category] || [],
    [categoryChoices, entity]
  );
  const {
    choice,
    category,
    pointType,
    chosenLevel,
    usesPoints,
    pointsUsed,
    pointsRemaining,
  } = useMemo(() => {
    const choice = choices.find((choice) => choice.entityKey === entityKey);
    const category = categoriesByKey[entity.category];
    const pointType = category.pointType
      ? pointTypesByKey[category.pointType]
      : null;
    const usesPoints = pointType !== null;
    const pointsUsed = calculatePoints(
      choices,
      entitiesByKey,
      entityLevelsByKey,
      pointType?.key
    );
    return {
      choice,
      category,
      pointType,
      chosenLevel: choice?.level || 0,
      usesPoints,
      pointsUsed,
      pointsRemaining: usesPoints ? pointType.maxPoints - pointsUsed : 0,
    };
  }, [
    choices,
    categoriesByKey,
    entitiesByKey,
    entity,
    entityKey,
    entityLevelsByKey,
    pointTypesByKey,
  ]);

  const onClickSelect = useCallback(
    (level: number) => {
      if (entity.grantedBy) return;
      addChoice({
        entityKey,
        level,
      });
    },
    [addChoice, choices, category, entityKey]
  );

  const onClickUnselect = useCallback(() => {
    if (entity.grantedBy) return;
    removeChoice({
      entityKey,
    });
  }, [removeChoice, choices, category, entity, entityKey]);

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
        <Card.Text>
          {/* TODO: make this more intelligent based on type of entity */}
          Level: {choice ? choice.level : 0}/{entity.entityLevels.length}
        </Card.Text>
        {map(entity.entityLevels, (levelKey) => {
          const entityLevel = entityLevelsByKey[levelKey];
          if (entity.grantedBy && !entityLevel.description) return;
          const pointsUsedAfterPurchasingLevel = calculatePoints(
            [
              ...choices.filter((c) => c.entityKey !== entity.key),
              { entityKey: entity.key, level: entityLevel.level },
            ],
            entitiesByKey,
            entityLevelsByKey,
            pointType?.key
          );
          const pointsUsedWithoutThisChoice = calculatePoints(
            [...choices.filter((c) => c.entityKey !== entity.key)],
            entitiesByKey,
            entityLevelsByKey,
            pointType?.key
          );
          const canBePurchased = usesPoints
            ? pointsRemaining >= pointsUsedAfterPurchasingLevel - pointsUsed
            : true;
          const pointsToShow =
            entityLevel.level === chosenLevel
              ? pointsUsed - pointsUsedWithoutThisChoice
              : pointsUsedAfterPurchasingLevel - pointsUsedWithoutThisChoice;
          const onClick =
            entityLevel.level === chosenLevel
              ? () => onClickUnselect()
              : () => onClickSelect(entityLevel.level);
          return (
            <Card
              key={entityKey + entityLevel.level + 'EntityCard'}
              border="dark"
              style={{ marginBottom: '10px' }}
            >
              <Card.Body>
                {Boolean(entityLevel.description) && (
                  <Markdown>{entityLevel.description}</Markdown>
                )}
                <div className="d-grid gap-2">
                  <Button
                    size="lg"
                    variant={
                      canBePurchased
                        ? entityLevel.level <= chosenLevel
                          ? 'light'
                          : 'outline-light'
                        : entityLevel.level <= chosenLevel
                        ? 'danger'
                        : 'outline-danger'
                    }
                    onClick={onClick}
                    style={
                      entity.grantedBy
                        ? {
                            marginBottom: '10px',
                            pointerEvents: 'none',
                          }
                        : { marginBottom: '10px' }
                    }
                  >
                    <Card.Text>
                      {!canBePurchased && entityLevel.level <= chosenLevel && (
                        <>
                          Invalid: Insufficient points for{' '}
                          {`level ${entityLevel.level}`}
                        </>
                      )}
                      {!canBePurchased && entityLevel.level > chosenLevel && (
                        <>{`Level ${entityLevel.level}`}</>
                      )}
                      {canBePurchased && entityLevel.level > chosenLevel && (
                        <>{`Level ${entityLevel.level}`}</>
                      )}
                      {canBePurchased && entityLevel.level <= chosenLevel && (
                        <>{`Level ${entityLevel.level}`} selected</>
                      )}
                    </Card.Text>
                    {usesPoints && pointsToShow != 0 && (
                      <>
                        {pointsToShow} {pointsToShow === 1 ? 'point' : 'points'}
                      </>
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          );
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
