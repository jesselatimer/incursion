import { z } from 'zod';
import type { MDXContent } from 'mdx/types';

export type AppendixKey = string;

export const AppendixSchema = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string(),
  compiledDescription: z
    .function()
    .optional()
    .transform((f) => {
      return f as MDXContent;
    }),
});

export type Appendix = z.infer<typeof AppendixSchema>;
