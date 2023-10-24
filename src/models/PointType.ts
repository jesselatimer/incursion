import { Choice } from './Choice';
import { Entity } from './Entity';

export type PointTypeKey = string;

export interface PointType {
  key: string;
  label: string;
  description: string;
  startingValue: number;
}
