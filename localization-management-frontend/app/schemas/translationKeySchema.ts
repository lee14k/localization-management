import { z } from 'zod';
import { TranslationSchema } from './translationSchema';

export const TranslationKeySchema = z.object({
    id: z.string().min(1, 'ID is required'),
    key: z.string().min(1, 'Key is required'),
    category: z.string().min(1, 'Category is required'),
    description: z.string().optional(),
    createdAt: z.string(),
    createdBy: z.string(),
    lastModified: z.string(),
    translations: z.record(TranslationSchema),
  });