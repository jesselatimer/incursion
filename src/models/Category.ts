import { z } from 'zod';
import type { MDXContent } from 'mdx/types';

export type CategoryKey = string;

export const CategorySchema = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string().optional(),
  compiledDescription: z
    .function()
    .optional()
    .transform((f) => {
      return f as MDXContent;
    }),
  pointType: z.string().nullable(),
  subCategories: z.array(z.string()).nonempty(),
  appendices: z.array(z.string()).optional(),
});

export type Category = z.infer<typeof CategorySchema>;
