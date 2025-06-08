import { z } from 'zod';
import { 
  TranslationSchema, 
} from './translationSchema';
import {TranslationKeySchema} from './translationKeySchema';
import { 
  SearchFiltersSchema,  
} from './searchSchema';

export type Translation = z.infer<typeof TranslationSchema>;
export type TranslationKey = z.infer<typeof TranslationKeySchema>;
export type SearchFilters = z.infer<typeof SearchFiltersSchema>;

export {
  TranslationSchema,
  TranslationKeySchema,
  SearchFiltersSchema,
}; 