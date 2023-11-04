import '../css/EntityPreview.css';
import { Entity as EntityModel } from '../models/Entity';
import Markdown from './Markdown';
import Card from 'react-bootstrap/Card';
import { Choice } from '../models/Choice';
import { DataContext } from './App';
import { useContext, useMemo, useState } from 'react';
import { calculatePoints } from '../utils/calculatePoints';
import Entity from './Entity';

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

  const { choice, pointType, usesPoints, pointsUsed, pointsRemaining } =
    useMemo(() => {
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
        pointType,
        usesPoints,
        pointsUsed,
        pointsRemaining: usesPoints ? pointType.maxPoints - pointsUsed : 0,
      };
    }, [choices, dataByKey]);

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

  return (
    <>
      <Card
        className={choice ? 'EntityPreviewCard chosen' : 'EntityPreviewCard'}
        border={canBePurchased ? '' : 'danger'}
        style={{ marginBottom: '20px' }}
        onClick={() => setShowModal(true)}
      >
        <Card.Img variant="top" src={entity.imageUrl} />
        <Card.Body
          style={{
            maxHeight: '400px',
            overflow: 'hidden',
            position: 'relative',
          }}
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
            <Card.Text>
              <Markdown>{entity.description}</Markdown>
            </Card.Text>
          )}
          <Card.Text>
            Level: {choice ? choice.level : 0}/{entity.entityLevels.length}
          </Card.Text>
        </Card.Body>
      </Card>
      <Entity
        entity={entity}
        choices={choices}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
}

export default EntityPreview;
