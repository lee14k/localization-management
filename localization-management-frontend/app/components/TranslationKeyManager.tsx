'use client'
import { LucideAlertCircle, LucideChevronDown } from 'lucide-react';
import useStore from '../store/translationStore';
import InlineTranslationEditor from './TranslationEditor';
import Button from './Button';
import { useTranslationSearchQuery } from '../queries-and-mutations/translationQueries';
import { useTextHighlighter } from '../hooks/textHighlight';

export default function TranslationKeyManager() {
  const { 
    openEditor, 
    toggleKeyExpansion, 
    isKeyExpanded, 
    isEditing,
    getSearchFilters 
  } = useStore();

  // Get search filters from store
  const searchFilters = getSearchFilters();
  
  const { 
    data: translations = [], 
    isLoading, 
    error 
  } = useTranslationSearchQuery(searchFilters);

  // Custom hook for highlighting with performance optimization
  const highlightText = useTextHighlighter(searchFilters.query);

  if (isLoading) {
    return (
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-6">Translation Key Manager</h1>
        <div className="flex items-center justify-center py-12">
          <div className="text-stone-500">Loading translations...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-6">Translation Key Manager</h1>
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">Error loading translations: {error.message}</div>
        </div>
      </div>
    );
  }

  if (translations.length === 0) {
    return (
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-6">Translation Key Manager</h1>
        <div className="flex items-center justify-center py-12">
          <div className="text-stone-500">
            {Object.keys(searchFilters).length > 0 
              ? 'No translations found matching your filters.' 
              : 'No translations available.'
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Translation Key Manager</h1>
      <div className="space-y-4">
        {translations.map((item) => {
          const isExpanded = isKeyExpanded(item.id);
          const hasTranslations = Object.keys(item.translations).length > 0;
          
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-stone-800 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow w-full"
            >
              <div className="flex items-start justify-between mb-2 w-full">
                <div className="flex items-center gap-4 w-full">
                  <div className="text-sm px-2 py-1 rounded font-mono dark:border-stone-600 rounded-md text-stone-500 dark:text-stone-300 border border-dashed border-stone-300 dark:bg-stone-700">
                    {highlightText(item.key)}
                  </div>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${{
                    'buttons': 'bg-blue-100 dark:bg-stone-600 text-blue-700 dark:text-blue-200',
                    'forms': 'bg-green-100 dark:bg-stone-600 text-green-700 dark:text-green-200',
                    'notifications': 'bg-yellow-100 dark:bg-stone-600 text-yellow-700 dark:text-yellow-200'
                  }[item.category] || 'bg-gray-100 dark:bg-stone-600 text-gray-700'}`}>
                    {highlightText(item.category.charAt(0).toUpperCase() + item.category.slice(1))}
                  </span>

                  
                  <div className="flex items-center gap-1 ml-2">
                    {hasTranslations ? (
                      Object.keys(item.translations).map((locale) => (
                        <span
                          key={locale}
                          className="inline-flex items-center justify-center w-6 h-4 text-xs font-medium bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded border border-stone-200 dark:border-stone-600"
                          title={`Available in ${locale.toUpperCase()}`}
                        >
                          {locale.toUpperCase().slice(0, 2)}
                        </span>
                      ))
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded border border-orange-200 dark:border-orange-700">
                        No translations available
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleKeyExpansion(item.id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <LucideChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                </div>
              </div>
              
              {item.description && (
                <p className="text-stone-700 dark:text-stone-300 text-sm mb-3">
                  {highlightText(item.description)}
                </p>
              )}
              
              {isExpanded && (
                <div className="mt-3">
                  {hasTranslations ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(item.translations).map(([locale, translation]) => {
                        const isCurrentlyEditing = isEditing(item.id, locale);
                        
                        return (
                          <div key={locale} className="bg-gray-50 dark:bg-stone-600 p-2 rounded">
                            <div className="text-xs text-gray-500 dark:text-stone-200 uppercase font-medium mb-1">
                              {locale}
                            </div>
                            
                            {isCurrentlyEditing ? (
                              <InlineTranslationEditor
                                translationId={item.id}
                                locale={locale}
                                currentValue={translation.value}
                              />
                            ) : (
                              <>
                                <div className="text-sm mb-2">
                                  {highlightText(translation.value)}
                                </div>
                                <Button
                                  onClick={() => openEditor(item.id, locale)}
                                  variant="primary"
                                  size="sm"
                                  text="Edit"
                                />
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <LucideAlertCircle className="w-5 h-5 text-orange-500" />
                        <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                          No Translations Available
                        </h3>
                      </div>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                        This translation key '<strong>
                          {highlightText(item.key)}
                        </strong>' has not been translated into any language yet. 
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
}