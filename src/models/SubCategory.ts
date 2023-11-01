import { z } from 'zod';

export type SubCategoryKey = string;

export const SubCategorySchema = z.object({
  key: z.string(),
  label: z.string(),
  pathToSelf: z.string(), // A relic of Notion import, points to the .md file associated with record
  description: z.string().optional(),
});

export type SubCategory = z.infer<typeof SubCategorySchema>;
