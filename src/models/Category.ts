import { z } from 'zod';

export type CategoryKey = string;

export const CategorySchema = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string().optional(),
  pointType: z.string().nullable(),
  subCategories: z.array(z.string()).nonempty(),
  appendices: z.array(z.string()).optional(),
});

export type Category = z.infer<typeof CategorySchema>;
