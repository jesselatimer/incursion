import { z } from 'zod';
import type { MDXContent } from 'mdx/types';

export type PointTypeKey = string;

export const PointTypeSchema = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string(),
  compiledDescription: z
    .function()
    .optional()
    .transform((f) => {
      return f as MDXContent;
    }),
  maxPoints: z.number(),
});

export type PointType = z.infer<typeof PointTypeSchema>;
