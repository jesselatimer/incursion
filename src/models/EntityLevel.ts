import { z } from 'zod';

export type EntityLevelKey = string;

export const EntityLevelSchema = z.object({
  key: z.string(),
  level: z.number(),
  pointCost: z.any().optional(), // TODO this needs to handle empty string or number
  description: z.string().optional(),
});

export type EntityLevel = z.infer<typeof EntityLevelSchema>;
