import { z } from 'zod';

export type CategoryKey = string;

export const CategorySchema = z.object({
  key: z.string(),
  label: z.string(),
  pathToSelf: z.string(), // A relic of Notion import, points to the .md file associated with record
  pointType: z.string().nullable(),
  subCategories: z.array(z.string()).nonempty(),
});

export type Category = z.infer<typeof CategorySchema>;
