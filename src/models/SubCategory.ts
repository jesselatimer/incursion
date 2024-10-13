import { z } from 'zod';
import type { MDXContent } from 'mdx/types';

export type SubCategoryKey = string;

export const SubCategorySchema = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string().optional(),
  compiledDescription: z
    .function()
    .optional()
    .transform((f) => {
      return f as MDXContent;
    }),
});

export type SubCategory = z.infer<typeof SubCategorySchema>;
