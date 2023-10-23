import { PointType } from './PointType';

export type CategoryKey = string;

export interface Category {
  label: string;
  pointType: PointType | null;
  subCategories?: string[];
}
