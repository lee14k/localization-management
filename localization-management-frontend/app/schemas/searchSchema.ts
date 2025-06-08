import { z } from 'zod';

export const SearchFiltersSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  locale: z.string().optional(),
});