import { Entity as EntityModel } from '../models/Entity';
import { EntityLevel as EntityLevelModel } from '../models/EntityLevel';
import Markdown from './Markdown';
import Card from 'react-bootstrap/Card';
import { DataContext, CategoryChoicesContext } from './App';
import { useCallback, useContext, useMemo, useState } from 'react';
import { calculatePoints } from '../utils/calculatePoints';
import { Button } from 'react-bootstrap';

function EntityLevel({
  entity,
  entityLevel,
}: {
  entity: EntityModel;
  entityLevel: EntityLevelModel;
}) {
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
    category,
    pointType,
    chosenLevel,
    usesPoints,
    pointsUsed,
    pointsRemaining,
    canBePurchased,
    pointsToShow,
    isSelected,
  } = useMemo(() => {
    const choice = choices.find((choice) => choice.entityKey === entityKey);
    const chosenLevel = choice?.level || 0;

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
    const pointsRemaining = usesPoints ? pointType.maxPoints - pointsUsed : 0;
    const canBePurchased = usesPoints
      ? pointsRemaining >= pointsUsedAfterPurchasingLevel - pointsUsed
      : true;
    const pointsToShow =
      entityLevel.level === chosenLevel
        ? pointsUsed - pointsUsedWithoutThisChoice
        : pointsUsedAfterPurchasingLevel - pointsUsedWithoutThisChoice;
    const isSelected = entityLevel.level <= chosenLevel;

    return {
      choice,
      category,
      pointType,
      chosenLevel,
      usesPoints,
      pointsUsed,
      pointsRemaining,
      pointsUsedAfterPurchasingLevel,
      canBePurchased,
      pointsToShow,
      isSelected,
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

  const onClick = useCallback(() => {
    console.log('onClick');
    if (entityLevel.level === chosenLevel) {
      onClickUnselect();
    } else {
      onClickSelect(entityLevel.level);
    }
  }, [entityLevel, chosenLevel]);

  const [buttonIsHovered, setButtonIsHovered] = useState(false);

  const buttonText = useMemo(() => {
    if (buttonIsHovered) {
      if (entityLevel.level === chosenLevel) {
        return 'Unselect';
      } else {
        if (!canBePurchased && !isSelected) {
          return 'Make invalid selection';
        }
        return 'Select';
      }
    } else {
      let str = '';
      if (!isSelected) {
        if (entity.grantedBy) {
          str = `Granted by ${entity.grantedBy}`;
        } else if (entity.entityLevels.length > 1) {
          str = `Level ${entityLevel.level}`;
        } else {
          str = 'Select';
        }
      } else {
        if (canBePurchased) {
          if (entity.grantedBy) {
            str = 'Granted';
          } else if (entity.entityLevels.length > 1) {
            str = `Level ${entityLevel.level} selected`;
          } else {
            str = 'Selected';
          }
        } else {
          str = `Invalid: Insufficient points`;
          if (entity.entityLevels.length > 1) {
            str += ` for level ${entityLevel.level}`;
          }
        }
      }
      const pointsStr =
        usesPoints && pointsToShow != 0
          ? `${pointsToShow} ${pointsToShow === 1 ? 'point' : 'points'}`
          : '';
      return (
        <>
          {str}
          <span style={{ fontSize: 'smaller', display: 'block' }}>
            {pointsStr}
          </span>
        </>
      );
    }
  }, [buttonIsHovered, isSelected]);

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
            onMouseEnter={() => setButtonIsHovered(true)}
            onMouseLeave={() => setButtonIsHovered(false)}
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
                    minHeight: '80px',
                  }
                : { marginBottom: '10px', minHeight: '80px' }
            }
          >
            <Card.Text>{buttonText}</Card.Text>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default EntityLevel;
