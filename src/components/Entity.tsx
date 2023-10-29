import { Entity as EntityModel, EntityKey } from '../models/Entity';
import Card from 'react-bootstrap/Card';
import { Choice } from '../models/Choice';
import { REQUIRED_ENTITY_KEYS, SetChoicesContext } from './App';
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
  const setChoices = useContext(SetChoicesContext);
  const { choice, chosenLevel, usesPoints, pointsUsed, pointsRemaining } =
    useMemo(() => {
      const choice = choices.find((choice) => choice.entityKey === entityKey);
      const pointType = entity.category.pointType;
      const usesPoints = pointType !== null;
      const pointsUsed = calculatePoints(choices, pointType?.key);
      return {
        choice,
        chosenLevel: choice?.level || 0,
        usesPoints,
        pointsUsed,
        pointsRemaining: usesPoints ? pointType.maxPoints - pointsUsed : 0,
      };
    }, [choices]);

  const onClickSelect = useCallback(
    (level: number) => {
      setChoices(
        [
          ...choices.filter((choice) => choice.entityKey !== entityKey),
          { entityKey, level },
        ],
        entity.category.key
      );
    },
    [setChoices, choices, choice]
  );

  const onClickUnselect = useCallback(() => {
    if (
      REQUIRED_ENTITY_KEYS[entity.category.key]?.includes(entity.key) &&
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
        entity.category.key
      );
    } else {
      setChoices(
        choices.filter((choice) => choice.entityKey !== entityKey),
        entity.category.key
      );
    }
  }, [setChoices, choices, choice, chosenLevel]);

  return (
    <Card border={choice ? 'light' : 'secondary'} text={choice ? 'light' : ''}>
      <Card.Img variant="top" src={`/incursion/images/${entityKey}.jpg`} />
      <Card.Body>
        <Card.Title>{entity.label}</Card.Title>
        <Card.Text dangerouslySetInnerHTML={{ __html: entity.description }} />
        <Card.Text>
          Level: {choice ? choice.level : 0}/{entity.levels.length}
        </Card.Text>
        {map(entity.levels, (level, i) => {
          const thisLevel = i + 1;
          const pointsUsedAfterPurchasingLevel = calculatePoints(
            [
              ...choices.filter((c) => c.entityKey !== entity.key),
              { entityKey: entity.key, level: thisLevel },
            ],
            entity.category.pointType!.key
          );
          const pointsUsedWithoutThisChoice = calculatePoints(
            [...choices.filter((c) => c.entityKey !== entity.key)],
            entity.category.pointType!.key
          );
          const canBePurchased = usesPoints
            ? pointsRemaining >= pointsUsedAfterPurchasingLevel - pointsUsed
            : true;
          const pointsToShow =
            thisLevel === chosenLevel
              ? pointsUsed - pointsUsedWithoutThisChoice
              : pointsUsedAfterPurchasingLevel - pointsUsedWithoutThisChoice;
          const onClick =
            thisLevel === chosenLevel
              ? () => onClickUnselect()
              : () => onClickSelect(i + 1);
          return (
            <Card
              key={entityKey + thisLevel + 'SummaryCard'}
              border={
                canBePurchased
                  ? thisLevel <= chosenLevel
                    ? 'secondary'
                    : 'secondary'
                  : thisLevel <= chosenLevel
                  ? 'danger'
                  : 'dark'
              }
              bg={
                canBePurchased
                  ? thisLevel <= chosenLevel
                    ? 'light'
                    : 'dark'
                  : thisLevel <= chosenLevel
                  ? 'light'
                  : 'danger'
              }
              text={
                canBePurchased
                  ? thisLevel <= chosenLevel
                    ? 'dark'
                    : 'light'
                  : thisLevel <= chosenLevel
                  ? 'danger'
                  : 'light'
              }
              onClick={onClick}
              style={{ cursor: 'pointer', marginBottom: '10px' }}
            >
              <Card.Body>
                <Card.Title>{level.label || `Level ${thisLevel}`}</Card.Title>
                {usesPoints && <Card.Text>{pointsToShow} points</Card.Text>}
                {level.description && (
                  <Card.Text
                    dangerouslySetInnerHTML={{ __html: level.description }}
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
