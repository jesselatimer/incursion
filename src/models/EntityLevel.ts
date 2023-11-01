import { z } from 'zod';

export type EntityLevelKey = string;

export const EntityLevelSchema = z.object({
  key: z.string(),
  pathToSelf: z.string(), // A relic of Notion import, points to the .md file associated with record
  level: z.number(),
  pointCost: z.number().optional(),
  description: z.string().optional(),
});

export type EntityLevel = z.infer<typeof EntityLevelSchema>;
