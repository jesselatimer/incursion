import { z } from 'zod';

export type EntityKey = string;

export const EntitySchema = z.object({
  key: z.string(),
  label: z.string(),
  pathToSelf: z.string(), // A relic of Notion import, points to the .md file associated with record
  description: z.string(), // TODO: how should I handle this? Fetch description much earlier and assign?
  subCategory: z.string(),
  category: z.string(), // TODO: have both category and subcategory?
  entityLevels: z.array(z.string()).nonempty(),
});

export type Entity = z.infer<typeof EntitySchema>;
