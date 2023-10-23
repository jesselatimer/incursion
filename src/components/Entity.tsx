import { Entity as EntityModel, EntityKey } from '../models/Entity';
import Button from './Button';

function Entity({
  entity,
  entityKey,
}: {
  entity: EntityModel;
  entityKey: EntityKey;
}) {
  return (
    <div>
      <h4>{entity.label}</h4>
      <p>{entity.description}</p>
      <Button label="Choose" onClick={() => alert(entityKey)} />
    </div>
  );
}

export default Entity;
