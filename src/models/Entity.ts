import { FOUNDATION_TYPE } from './Foundation';
import { PointType } from './PointType';

export interface Entity {
  label: string;
  description: string;
  subtype: FOUNDATION_TYPE;
  pointType?: PointType;
}

export type EntityKey = string;
