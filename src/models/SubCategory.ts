export type SubCategoryKey = string;

export interface SubCategory {
  key: SubCategoryKey;
  label: String;
  pathToSelf: string; // A relic of Notion import, points to the .md file associated with record
  description?: string;
}
