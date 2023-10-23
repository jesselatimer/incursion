import { FOUNDATION_TYPE } from './Foundation';
import { PointType } from './PointType';

export interface Entity {
  label: string;
  description: string;
  subtype: FOUNDATION_TYPE;
  imageUrl?: string;
  pointType?: PointType;
}

export type EntityKey = string;
