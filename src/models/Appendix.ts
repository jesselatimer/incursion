import { z } from 'zod';

export type AppendixKey = string;

export const AppendixSchema = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string(),
});

export type Appendix = z.infer<typeof AppendixSchema>;
