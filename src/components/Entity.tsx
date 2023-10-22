import { Entity as EntityModel, EntityKey } from '../models/Entity';
import Button from './Button';

function Entity({ entity, key }: { entity: EntityModel; key: EntityKey }) {
  return (
    <div>
      <h4>{entity.label}</h4>
      <p>{entity.description}</p>
      <Button label="Choose" onClick={() => alert('clicked')} />
    </div>
  );
}

export default Entity;
