export type EntityLevelKey = string;

export interface EntityLevel {
  key: EntityLevelKey;
  level: number;
  pointCost?: number;
  description?: string;
}
