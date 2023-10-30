import { Choice } from './Choice';
import { Entity, EntityKey } from './Entity';

export type PointCalculator = (
  choices: Choice[],
  entitiesByKey: Record<EntityKey, Entity>
) => number;
