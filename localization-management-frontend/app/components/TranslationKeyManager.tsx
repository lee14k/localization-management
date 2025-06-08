'use client'
import { LucideChevronDown } from 'lucide-react';
import useStore from '../store/translationStore';
import InlineTranslationEditor from './TranslationEditor';
import Button from './Button';

export default function TranslationKeyManager() {
  const { translations, openEditor, toggleKeyExpansion, isKeyExpanded, isEditing } = useStore();

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mb-6">Translation Key Manager</h1>
            <div className="space-y-4">
        {translations.map((item) => {
          const isExpanded = isKeyExpanded(item.id);
          
          return (
          <div
            key={item.id}
            className="bg-white dark:bg-stone-800 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow w-full"
          >
            <div className="flex items-start justify-between mb-2 w-full">
              <div className="flex items-center gap-4 w-full">
                <div className="text-sm px-2 py-1 rounded font-mono dark:border-stone-600 rounded-md text-stone-500 dark:text-stone-300 border border-dashed border-stone-300 dark:bg-stone-700">
                  {item.key}
                </div>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${{
                  'buttons': 'bg-blue-100 dark:bg-stone-600 text-blue-700 dark:text-blue-200',
                  'forms': 'bg-green-100 dark:bg-stone-600 text-green-700 dark:text-green-200'
                }[item.category] || 'bg-gray-100 dark:bg-stone-600 text-gray-700'}`}>
                  {item.category}
                </span>
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
              <p className="text-stone-700 dark:text-stone-300 text-sm mb-3">{item.description}</p>
            )}
            
            {isExpanded && (
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
                            {translation.value}
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
            )}
          </div>
          );
        })}
      </div>
        </div>
    )
}