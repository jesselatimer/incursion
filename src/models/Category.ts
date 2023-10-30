import { PointTypeKey } from './PointType';
import { SubCategoryKey } from './SubCategory';

export type CategoryKey = string;

export interface Category {
  key: string;
  label: string;
  pointType: PointTypeKey | null;
  subCategories: SubCategoryKey[];
}
