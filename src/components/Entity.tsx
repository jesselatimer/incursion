import { Entity as EntityModel, EntityKey } from '../models/Entity';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Choice } from '../models/Choice';
import { SetChoicesContext } from './App';
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
  // TODO: rename "value" to "level"
  const setChoices = useContext(SetChoicesContext);
  const { choice, chosenLevel, usesPoints, pointsUsed, pointsRemaining } =
    useMemo(() => {
      const choice = choices.find((choice) => choice.entityKey === entityKey);
      const pointType = entity.category.pointType;
      const usesPoints = pointType !== null;
      const pointsUsed = calculatePoints(choices, pointType?.key);
      return {
        choice,
        chosenLevel: choice?.value || 0,
        usesPoints,
        pointsUsed,
        pointsRemaining: usesPoints ? pointType.startingValue - pointsUsed : 0,
      };
    }, [choices]);

  const onClickSelect = useCallback(
    (value: number) => {
      setChoices(
        [
          ...choices.filter((choice) => choice.entityKey !== entityKey),
          { entityKey, value },
        ],
        entity.category.key
      );
    },
    [setChoices, choices, choice]
  );

  const onClickUnselect = useCallback(() => {
    setChoices(
      choices.filter((choice) => choice.entityKey !== entityKey),
      entity.category.key
    );
  }, [setChoices, choices, choice]);

  return (
    <Card>
      {/* TODO: add a max and min width */}
      <Card.Img
        variant="top"
        src={
          entity.imageUrl ||
          'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F000%2F456%2F164%2Foriginal%2Fvector-question-mark.jpg&f=1&nofb=1&ipt=959dad5e7755c1955a39aceef2008d08b5277a30bdbf5582b19d504482ebee9a&ipo=images'
        }
      />
      <Card.Body>
        <Card.Title>{entity.label}</Card.Title>
        <Card.Text>{entity.description}</Card.Text>
        <Card.Text>
          Level: {choice ? choice.value : 0}/{entity.levels.length}
        </Card.Text>
        {map(entity.levels, (level, i) => {
          const thisLevel = i + 1;
          const pointsUsedAfterPurchasingLevel = calculatePoints(
            [
              ...choices.filter((c) => c.entityKey !== entity.key),
              { entityKey: entity.key, value: thisLevel },
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
          return (
            <Card>
              {level.label && <Card.Title>{level.label}</Card.Title>}
              {level.description && <Card.Text>{level.description}</Card.Text>}
              {thisLevel === chosenLevel ? (
                <Button onClick={() => onClickUnselect()} variant="success">
                  Selected
                  {usesPoints && (
                    <span>
                      {' '}
                      {/* Show the number of points they used to purchase this level */}
                      ({pointsUsed - pointsUsedWithoutThisChoice} points)
                    </span>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => onClickSelect(i + 1)}
                  variant={canBePurchased ? 'primary' : 'warning'}
                  style={canBePurchased ? {} : { pointerEvents: 'none' }}
                >
                  Level {thisLevel}
                  {usesPoints && (
                    <span>
                      {' '}
                      {/* Show the number of points they gain by choosing this level */}
                      (
                      {pointsUsedAfterPurchasingLevel -
                        pointsUsedWithoutThisChoice}{' '}
                      points)
                    </span>
                  )}
                </Button>
              )}
            </Card>
          );
        })}
      </Card.Body>
    </Card>
  );
}

export default Entity;
