import { PointType } from './PointType';

export type CategoryKey = string;

export interface Category {
  key: string;
  label: string;
  pointType: PointType | null;
  subCategories: string[];
}
