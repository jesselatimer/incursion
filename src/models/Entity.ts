import { z } from 'zod';
import type { MDXContent } from 'mdx/types';

export type EntityKey = string;

export const EntitySchema = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string(),
  compiledDescription: z
    .function()
    .optional()
    .transform((f) => {
      return f as MDXContent;
    }),
  imageUrl: z.string(),
  subCategory: z.string(),
  category: z.string(), // TODO: have both category and subcategory?
  entityLevels: z.array(z.string()).nonempty(),
  grantedBy: z.string().optional(),
  grants: z.array(z.string()).optional(),
});

export type Entity = z.infer<typeof EntitySchema>;
