import { Entity as EntityModel } from '../models/Entity';
import Markdown from './Markdown';
import Card from 'react-bootstrap/Card';
import {
  DataContext,
  REQUIRED_ENTITY_KEYS,
  CategoryChoicesContext,
} from './App';
import { useCallback, useContext, useMemo } from 'react';
import { map } from 'lodash';
import { calculatePoints } from '../utils/calculatePoints';
import { addChoice, removeChoice } from '../data';

function Entity({ entity }: { entity: EntityModel }) {
  const dataByKey = useContext(DataContext);
  const { categoriesByKey, pointTypesByKey, entitiesByKey, entityLevelsByKey } =
    dataByKey;
  const entityKey = entity.key;

  const { categoryChoices, setChoices } = useContext(CategoryChoicesContext);
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
    (level: number) =>
      addChoice({
        level,
        choices,
        entityKey,
        categoryKey: category.key,
        setChoices,
      }),
    [setChoices, choices, category, entityKey]
  );

  const onClickUnselect = useCallback(
    () =>
      removeChoice({
        choices,
        entityKey,
        categoryKey: category.key,
        setChoices,
      }),
    [setChoices, choices, category, entity, entityKey]
  );

  return (
    <Card border={choice ? 'light' : 'secondary'} text={choice ? 'light' : ''}>
      <Card.Img variant="top" src={entity.imageUrl} />
      <Card.Body>
        <Card.Title>{entity.label}</Card.Title>
        {Boolean(entity.description) && (
          <Markdown>{entity.description}</Markdown>
        )}
        <Card.Text>
          Level: {choice ? choice.level : 0}/{entity.entityLevels.length}
        </Card.Text>
        {map(entity.entityLevels, (levelKey) => {
          const entityLevel = entityLevelsByKey[levelKey];
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
              border={
                canBePurchased
                  ? entityLevel.level <= chosenLevel
                    ? 'secondary'
                    : 'secondary'
                  : entityLevel.level <= chosenLevel
                  ? 'danger'
                  : 'dark'
              }
              bg={
                canBePurchased
                  ? entityLevel.level <= chosenLevel
                    ? 'light'
                    : 'dark'
                  : entityLevel.level <= chosenLevel
                  ? 'light'
                  : 'danger'
              }
              text={
                canBePurchased
                  ? entityLevel.level <= chosenLevel
                    ? 'dark'
                    : 'light'
                  : entityLevel.level <= chosenLevel
                  ? 'danger'
                  : 'light'
              }
              onClick={onClick}
              style={{ cursor: 'pointer', marginBottom: '10px' }}
            >
              <Card.Body>
                <Card.Title>{`Level ${entityLevel.level}`}</Card.Title>
                {usesPoints && <Card.Text>{pointsToShow} points</Card.Text>}
                {Boolean(entityLevel.description) && (
                  <Markdown>{entityLevel.description}</Markdown>
                )}
              </Card.Body>
            </Card>
          );
        })}
        {entity.grants &&
          map(entity.grants, (grantedKey) => {
            const grantedEntity = entitiesByKey[grantedKey];
            // TODO: fix spacing
            // TODO: don't make it selectable
            return <Entity entity={grantedEntity} />;
          })}
      </Card.Body>
    </Card>
  );
}

export default Entity;
