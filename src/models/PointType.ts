import { Choice } from './Choice';
import { Entity } from './Entity';

export type PointTypeKey = string;

export interface PointType {
  label: string;
  description: string;
  startingValue: number;
  pointCalculator?: (
    entity: Entity,
    value: number,
    choices: Choice[]
  ) => number;
}
