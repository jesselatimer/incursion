import { Category } from './Category';

export interface Entity {
  label: string;
  description: string;
  subCategory: string; // TODO: better type safety
  category: Category;
  imageUrl?: string;
}

export type EntityKey = string;
