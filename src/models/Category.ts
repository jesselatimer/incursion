import { PointTypeKey } from './PointType';
import { SubCategoryKey } from './SubCategory';

export type CategoryKey = string;

export interface Category {
  key: string;
  label: string;
  pathToSelf: string; // A relic of Notion import, points to the .md file associated with record
  pointType: PointTypeKey | null;
  subCategories: SubCategoryKey[];
}
