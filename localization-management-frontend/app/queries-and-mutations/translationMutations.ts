import { useMutation, useQueryClient } from '@tanstack/react-query';
import queryKeys from './keys';
import { sampleTranslations, delay } from '../data/sampleData';
import type { TranslationKey } from '../schemas';

export const useUpdateTranslationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, locale, data }: { 
      id: string; 
      locale: string; 
      data: { value: string } 
    }) => {
      await delay(300);
      
      const translation = sampleTranslations.find(item => item.id === id);
      if (!translation) {
        throw new Error(`Translation with id ${id} not found`);
      }
      
      if (!translation.translations[locale]) {
        throw new Error(`Locale ${locale} not found for translation ${id}`);
      }
      
      translation.translations[locale] = {
        ...translation.translations[locale],
        value: data.value,
        updatedAt: new Date().toISOString(),
        updatedBy: 'current@user.com'
      };
      
      translation.lastModified = new Date().toISOString();
      
      return translation;
    },
    onMutate: async ({ id, locale, data }) => {

      await queryClient.cancelQueries({ queryKey: queryKeys.translation(id) });
      
      const previousTranslation = queryClient.getQueryData(queryKeys.translation(id));
      
      queryClient.setQueryData(queryKeys.translation(id), (old: TranslationKey | undefined) => {
        if (!old) return old;
        return {
          ...old,
          translations: {
            ...old.translations,
            [locale]: {
              ...old.translations[locale],
              value: data.value,
              updatedAt: new Date().toISOString(),
            }
          }
        };
      });

      return { previousTranslation };
    },
    onError: (_err, variables, context) => {

      if (context?.previousTranslation) {
        queryClient.setQueryData(
          queryKeys.translation(variables.id),
          context.previousTranslation
        );
      }
    },
    onSettled: async (_data, _error, variables) => {

      await queryClient.invalidateQueries({
        queryKey: queryKeys.translation(variables.id)
      });
      

      await queryClient.invalidateQueries({
        queryKey: queryKeys.translations()
      });
      

      await queryClient.invalidateQueries({
        queryKey: ['translations', 'search']
      });
    },
  });
};
