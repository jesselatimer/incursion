import { z } from 'zod';

export type PointTypeKey = string;

export const PointTypeSchema = z.object({
  key: z.string(),
  label: z.string(),
  pathToSelf: z.string(), // A relic of Notion import, points to the .md file associated with record
  description: z.string(),
  maxPoints: z.number(),
});

export type PointType = z.infer<typeof PointTypeSchema>;
