import { CategoryKey } from './Category';
import { EntityLevelKey } from './EntityLevel';
import { SubCategoryKey } from './SubCategory';

export type EntityKey = string;

export interface Entity {
  key: EntityKey;
  label: string;
  description: string;
  subCategory: SubCategoryKey;
  category: CategoryKey; // TODO: have both category and subcategory?
  entityLevels: EntityLevelKey[];
}
