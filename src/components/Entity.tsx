import { Entity as EntityModel, EntityKey } from '../models/Entity';
import Card from 'react-bootstrap/Card';
import { Choice } from '../models/Choice';
import { DataContext, REQUIRED_ENTITY_KEYS, SetChoicesContext } from './App';
import { useCallback, useContext, useMemo } from 'react';
import { map } from 'lodash';
import { calculatePoints } from '../utils/calculatePoints';

function Entity({
  entity,
  entityKey,
  choices,
}: {
  entity: EntityModel;
  entityKey: EntityKey;
  choices: Choice[];
}) {
  const dataByKey = useContext(DataContext);
  const { categoriesByKey, pointTypesByKey, entitiesByKey, entityLevelsByKey } =
    dataByKey;

  const setChoices = useContext(SetChoicesContext);
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
  }, [choices, dataByKey]);

  const onClickSelect = useCallback(
    (level: number) => {
      setChoices(
        [
          ...choices.filter((choice) => choice.entityKey !== entityKey),
          { entityKey, level },
        ],
        category.key
      );
    },
    [setChoices, choices, choice, dataByKey]
  );

  const onClickUnselect = useCallback(() => {
    if (
      REQUIRED_ENTITY_KEYS[category.key]?.includes(entity.key) &&
      chosenLevel > 1
    ) {
      setChoices(
        [
          ...choices.filter((choice) => choice.entityKey !== entityKey),
          {
            entityKey: entity.key,
            level: 1,
          },
        ],
        category.key
      );
    } else {
      setChoices(
        choices.filter((choice) => choice.entityKey !== entityKey),
        category.key
      );
    }
  }, [setChoices, choices, choice, chosenLevel, dataByKey]);

  return (
    <Card border={choice ? 'light' : 'secondary'} text={choice ? 'light' : ''}>
      <Card.Img variant="top" src={`/incursion/images/${entityKey}.jpg`} />
      <Card.Body>
        <Card.Title>{entity.label}</Card.Title>
        {/* TODO: fix entity description */}
        <Card.Text dangerouslySetInnerHTML={{ __html: entity.description }} />
        <Card.Text>
          Level: {choice ? choice.level : 0}/{entity.entityLevels.length}
        </Card.Text>
        {map(entity.entityLevels, (levelKey) => {
          const entityLevel = entityLevelsByKey[levelKey];
          console.log(entityLevel);
          const pointsUsedAfterPurchasingLevel = calculatePoints(
            [
              ...choices.filter((c) => c.entityKey !== entity.key),
              { entityKey: entity.key, level: entityLevel.level },
            ],
            entitiesByKey,
            entityLevelsByKey,
            pointType!.key
          );
          const pointsUsedWithoutThisChoice = calculatePoints(
            [...choices.filter((c) => c.entityKey !== entity.key)],
            entitiesByKey,
            entityLevelsByKey,
            pointType!.key
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
              key={entityKey + entityLevel.level + 'SummaryCard'}
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
                {/* TODO: fix description */}
                {entityLevel.description && (
                  <Card.Text
                    dangerouslySetInnerHTML={{
                      __html: entityLevel.description,
                    }}
                  />
                )}
              </Card.Body>
            </Card>
          );
        })}
      </Card.Body>
    </Card>
  );
}

export default Entity;
