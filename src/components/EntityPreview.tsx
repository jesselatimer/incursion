import '../css/EntityPreview.css';
import { Entity as EntityModel } from '../models/Entity';
import Markdown from './Markdown';
import Card from 'react-bootstrap/Card';
import { Choice } from '../models/Choice';
import {
  CategoryChoicesContext,
  DataContext,
  REQUIRED_ENTITY_KEYS,
} from './App';
import { useCallback, useContext, useMemo, useState } from 'react';
import { calculatePoints } from '../utils/calculatePoints';
import { Button, Stack } from 'react-bootstrap';
import EntityModal from './EntityModal';

function EntityPreview({
  entity,
  choices,
}: {
  entity: EntityModel;
  choices: Choice[];
}) {
  const dataByKey = useContext(DataContext);
  const { categoriesByKey, pointTypesByKey, entitiesByKey, entityLevelsByKey } =
    dataByKey;
  const entityKey = entity.key;
  const category = categoriesByKey[entity.category];

  const { choice, pointType, usesPoints, pointsUsed, pointsRemaining } =
    useMemo(() => {
      const choice = choices.find((choice) => choice.entityKey === entityKey);
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
        pointType,
        usesPoints,
        pointsUsed,
        pointsRemaining: usesPoints ? pointType.maxPoints - pointsUsed : 0,
      };
    }, [
      choices,
      entitiesByKey,
      entityLevelsByKey,
      category,
      entityKey,
      pointTypesByKey,
    ]);

  const [showModal, setShowModal] = useState<boolean>(false);

  const entityLevel = entityLevelsByKey[entity.entityLevels[0]];
  const pointsUsedAfterPurchasing = calculatePoints(
    [
      ...choices.filter((c) => c.entityKey !== entity.key),
      { entityKey: entity.key, level: entityLevel.level },
    ],
    entitiesByKey,
    entityLevelsByKey,
    pointType?.key
  );
  const canBePurchased = usesPoints
    ? pointsRemaining >= pointsUsedAfterPurchasing - pointsUsed
    : true;

  const chosenLevel = choice?.level || 0;
  const { addChoice, removeChoice, categoryChoices } = useContext(
    CategoryChoicesContext
  );
  const onClickIncrease = useCallback(() => {
    if (entity.grantedBy) return;
    addChoice({
      entityKey,
      level: chosenLevel + 1,
    });
  }, [addChoice, choices, category, chosenLevel, entityKey]);

  const onClickDecrease = useCallback(() => {
    if (entity.grantedBy) return;
    let level = chosenLevel > 1 ? chosenLevel - 1 : 0;
    if (REQUIRED_ENTITY_KEYS[category.key]?.includes(entity.key) && level < 1) {
      level = 1;
    }

    if (level > 0) {
      addChoice({
        entityKey,
        level,
      });
    } else {
      removeChoice({
        entityKey,
      });
    }
  }, [removeChoice, choices, chosenLevel, category, entity, entityKey]);

  return (
    <>
      <Card
        className={choice ? 'EntityPreviewCard chosen' : 'EntityPreviewCard'}
        style={{ marginBottom: '20px', height: 'calc(100% - 20px)' }}
      >
        <Card.Img
          className="EntityPreviewImg"
          variant="top"
          src={entity.imageUrl}
          onClick={() => setShowModal(true)}
        />
        <Card.Body
          className="EntityPreviewBody"
          style={{
            maxHeight: '400px',
            overflow: 'hidden',
            position: 'relative',
          }}
          onClick={() => setShowModal(true)}
        >
          <Card.Title>{entity.label}</Card.Title>
          <div
            style={{
              background:
                'linear-gradient(0deg, rgba(20,20,20,1) 0%, rgba(0,0,0,0) 30%',
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              zIndex: '2',
              borderRadius: 'var(--bs-card-border-radius)',
            }}
          />
          <Card.Title></Card.Title>
          {Boolean(entity.description) && (
            <Markdown key={entity.key}>{entity.compiledDescription}</Markdown>
          )}
        </Card.Body>
        <Card.Footer>
          <Stack direction="horizontal" gap={3}>
            <Button
              onClick={() => onClickDecrease()}
              disabled={chosenLevel < 1}
              variant="light"
              style={chosenLevel === 0 ? { visibility: 'hidden' } : {}}
            >
              -
            </Button>
            <div className="ms-auto">
              <span>
                {entity.entityLevels.length > 1 && (
                  <>
                    Level {choice ? choice.level : 0}/
                    {entity.entityLevels.length}{' '}
                  </>
                )}
                {entity.entityLevels.length === 1
                  ? (choice ? choice.level : 0) > 0
                    ? 'Selected'
                    : 'Select'
                  : ''}
              </span>
            </div>
            <Button
              className="ms-auto"
              onClick={() => onClickIncrease()}
              disabled={chosenLevel >= entity.entityLevels.length}
              variant={canBePurchased ? 'light' : 'danger'}
              style={
                chosenLevel >= entity.entityLevels.length
                  ? { visibility: 'hidden' }
                  : {}
              }
            >
              +
            </Button>
          </Stack>
        </Card.Footer>
      </Card>
      <EntityModal
        entity={entity}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
}

export default EntityPreview;
