import {SearchFilters} from "@/app/schemas";

const queryKeys = {
    translations: () => ['translations'] as const,
    translationsByLocale: (locale: string) => 
      ['translations', 'locale', locale] as const,
    translation: (id: string) => ['translations', id] as const,
        translationSearch: (filters: SearchFilters) =>
      ['translations', 'search', filters] as const,
        locales: () => ['locales'] as const,
  };

export { queryKeys };
export default queryKeys;