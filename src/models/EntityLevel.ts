export type EntityLevelKey = string;

export interface EntityLevel {
  key: EntityLevelKey;
  pathToSelf: string; // A relic of Notion import, points to the .md file associated with record
  level: number;
  pointCost?: number;
  description?: string;
}
