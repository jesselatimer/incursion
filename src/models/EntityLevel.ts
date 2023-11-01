import { z } from 'zod';

export type EntityLevelKey = string;

export const EntityLevelSchema = z.object({
  key: z.string(),
  level: z.number(),
  pointCost: z.number().optional(),
  description: z.string().optional(),
});

export type EntityLevel = z.infer<typeof EntityLevelSchema>;
