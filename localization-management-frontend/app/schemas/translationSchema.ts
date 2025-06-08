import { z } from 'zod';

export const TranslationSchema = z.object({
  value: z.string().min(1, "Translation cannot be empty"),
  updatedAt: z.string().datetime(),
  updatedBy: z.string()
});