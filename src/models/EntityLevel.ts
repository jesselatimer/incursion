import { z } from 'zod';
import type { MDXContent } from 'mdx/types';

export type EntityLevelKey = string;

export const EntityLevelSchema = z.object({
  key: z.string(),
  level: z.number(),
  pointCost: z.any().optional(),
  description: z.string().optional(),
  compiledDescription: z
    .function()
    .optional()
    .transform((f) => {
      return f as MDXContent;
    }),
});

export type EntityLevel = z.infer<typeof EntityLevelSchema>;
