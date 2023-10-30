import { CategoryKey } from './Category';
import { EntityLevelKey } from './EntityLevel';
import { SubCategoryKey } from './SubCategory';

export type EntityKey = string;

export interface Entity {
  key: EntityKey;
  label: string;
  pathToSelf: string; // A relic of Notion import, points to the .md file associated with record
  description: string; // TODO: how should I handle this? Fetch description much earlier and assign?
  subCategory: SubCategoryKey;
  category: CategoryKey; // TODO: have both category and subcategory?
  entityLevels: EntityLevelKey[];
}
