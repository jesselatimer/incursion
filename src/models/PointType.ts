export type PointTypeKey = string;

export interface PointType {
  key: PointTypeKey;
  label: string;
  pathToSelf: string; // A relic of Notion import, points to the .md file associated with record
  description: string;
  maxPoints: number;
}
