import { Entity as EntityModel, EntityKey } from '../models/Entity';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Choice } from '../models/Choice';
import { SetChoicesContext } from './App';
import { useCallback, useContext, useMemo } from 'react';

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
  const choice = useMemo(
    () => choices.find((choice) => choice.entityKey === entityKey),
    [choices]
  );
  const isMaxLevel = useMemo(() => {
    if (!choice) return false;
    return choice.value >= entity.levels.length;
  }, [choice]);

  const onClickSelect = useCallback(() => {
    let value = 1;
    if (choice) value = choice.value + 1;
    setChoices(
      [
        ...choices.filter((choice) => choice.entityKey !== entityKey),
        { entityKey, value },
      ],
      entity.category.key
    );
  }, [setChoices, choices, choice]);

  const onClickUnselect = useCallback(() => {
    if (choice && choice.value > 1) {
      setChoices(
        [
          ...choices.filter((choice) => choice.entityKey !== entityKey),
          {
            entityKey,
            value: choice.value - 1,
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
        {isMaxLevel ? null : (
          <Button onClick={onClickSelect}>Increase level</Button>
        )}
        {choice ? (
          <Button onClick={onClickUnselect} variant="secondary">
            Decrease level
          </Button>
        ) : null}
      </Card.Body>
    </Card>
  );
}

export default Entity;
