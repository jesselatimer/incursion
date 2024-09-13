import { z } from 'zod';

export type EntityKey = string;

export const EntitySchema = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  subCategory: z.string(),
  category: z.string(), // TODO: have both category and subcategory?
  entityLevels: z.array(z.string()).nonempty(),
  grantedBy: z.string().optional(),
  grants: z.array(z.string()).optional(),
});

export type Entity = z.infer<typeof EntitySchema>;
