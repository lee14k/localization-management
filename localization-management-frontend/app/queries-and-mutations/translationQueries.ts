import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import queryKeys from './keys';
import { sampleTranslations, delay } from '../data/sampleData';
import type { TranslationKey, SearchFilters } from '../schemas';

const searchTranslations = (data: TranslationKey[], filters: SearchFilters): TranslationKey[] => {
  let results = [...data];
  
  if (filters.query) {
    const query = filters.query.toLowerCase();
    results = results.filter(item => 
      item.key.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      Object.values(item.translations).some(translation => 
        translation.value.toLowerCase().includes(query)
      )
    );
  }
  
  if (filters.category) {
    results = results.filter(item => item.category === filters.category);
  }
  
  if (filters.locale) {
    results = results.filter(item => item.translations[filters.locale!]);
  }
  
  return results;
};

const getAvailableLocales = (data: TranslationKey[]): string[] => {
  const locales = new Set<string>();
  data.forEach(translation => {
    Object.keys(translation.translations).forEach(locale => {
      locales.add(locale);
    });
  });
  return Array.from(locales).sort();
};

export const useTranslationSearchQuery = (
  filters: SearchFilters,
  options?: UseQueryOptions<TranslationKey[], Error>
) => {
  return useQuery({
    queryKey: queryKeys.translationSearch(filters),
    queryFn: async () => {
      await delay(300);
      return searchTranslations(sampleTranslations, filters);
    },
    staleTime: 30 * 1000,
    ...options,
  });
};

export const useAvailableLocalesQuery = (
  options?: UseQueryOptions<string[], Error>
) => {
  return useQuery({
    queryKey: queryKeys.locales(),
    queryFn: async () => {
      await delay(200);
      return getAvailableLocales(sampleTranslations);
    },
    staleTime: 5 * 60 * 1000, 
    ...options,
  });
};