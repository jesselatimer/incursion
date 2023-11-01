import { z } from 'zod';

export type PointTypeKey = string;

export const PointTypeSchema = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string(),
  maxPoints: z.number(),
});

export type PointType = z.infer<typeof PointTypeSchema>;
