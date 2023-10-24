import { Entity as EntityModel, EntityKey } from '../models/Entity';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { CategoryKey } from '../models/Category';
import { Choice } from '../models/Choice';

function Entity({
  entity,
  entityKey,
  choices,
  handleCategoryChoicesChange,
}: {
  entity: EntityModel;
  entityKey: EntityKey;
  choices: Choice[];
  handleCategoryChoicesChange: (
    newChoices: Choice[],
    categoryKey: CategoryKey
  ) => void;
}) {
  // TODO: get correct value once implemented
  const onClickSelect = () =>
    handleCategoryChoicesChange(
      [...choices, { entityKey, value: 1 }],
      entity.category.key
    );

  const onClickUnselect = () =>
    handleCategoryChoicesChange(
      choices.filter((choice) => choice.entityKey !== entityKey),
      entity.category.key
    );

  const isChosen = Boolean(
    choices.find((choice) => choice.entityKey === entityKey)
  );

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
        {isChosen ? (
          <Button onClick={onClickUnselect} variant="secondary">
            Unselect
          </Button>
        ) : (
          <Button onClick={onClickSelect}>Select</Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Entity;
