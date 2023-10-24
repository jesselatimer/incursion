import { Choice } from './Choice';
import { Entity } from './Entity';

export interface PointCalculator {
  pointCalculator: (entity: Entity, value: number, choices: Choice[]) => number;
}
