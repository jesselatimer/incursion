import { z } from 'zod';

export type SubCategoryKey = string;

export const SubCategorySchema = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string().optional(),
});

export type SubCategory = z.infer<typeof SubCategorySchema>;
