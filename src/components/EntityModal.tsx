import { Entity as EntityModel } from '../models/Entity';
import { Choice } from '../models/Choice';
import {
  DataContext,
  REQUIRED_ENTITY_KEYS,
  CategoryChoicesContext,
} from './App';
import { useCallback, useContext, useMemo } from 'react';
import { calculatePoints } from '../utils/calculatePoints';
import { CloseButton, Modal } from 'react-bootstrap';
import Entity from './Entity';

function EntityModal({
  entity,
  choices,
  showModal,
  setShowModal,
}: {
  entity: EntityModel;
  choices: Choice[];
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}) {
  const dataByKey = useContext(DataContext);
  const { categoriesByKey, pointTypesByKey, entitiesByKey, entityLevelsByKey } =
    dataByKey;
  const entityKey = entity.key;

  const { setChoices } = useContext(CategoryChoicesContext);
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
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
      <CloseButton
        onClick={() => setShowModal(false)}
        style={{
          position: 'absolute',
          right: '10px',
          top: '10px',
          backgroundColor: 'white',
          borderRadius: '99px',
          zIndex: '1000000',
          padding: '7px',
        }}
      />
      <Modal.Body style={{ padding: '0' }}>
        <Entity entity={entity} choices={choices} style={'grid'} />
      </Modal.Body>
    </Modal>
  );
}

export default EntityModal;
