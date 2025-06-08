'use client'
import { Search as LucideSearch } from "lucide-react";
import useStore from '../store/translationStore';
import { useAvailableLocalesQuery } from '../queries-and-mutations/translationQueries';

export default function Toolbar() {
  const { 
    searchQuery, 
    selectedCategory, 
    selectedLocale,
    setSearchQuery,
    setSelectedCategory,
    setSelectedLocale,
    clearFilters
  } = useStore();

  const { data: availableLocales = [] } = useAvailableLocalesQuery();

  const availableCategories = ['buttons', 'forms', 'navigation', 'messages'];

  const hasFilters = searchQuery || selectedCategory || selectedLocale;

  return (
    <div className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-md p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 w-full">    
          <div className="relative flex-1">
            <input 
              type="text" 
              id="search" 
              placeholder="Search by key, description, category, or translation value" 
              className="border border-stone-300 dark:border-stone-600 rounded-md p-2 w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <LucideSearch className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="category-filter" className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Category:
            </label>
            <select
              id="category-filter"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="border border-stone-300 dark:border-stone-600 rounded-md p-1 text-sm bg-white dark:bg-stone-700"
            >
              <option value="">All Categories</option>
              {availableCategories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="locale-filter" className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Locale:
            </label>
            <select
              id="locale-filter"
              value={selectedLocale || ''}
              onChange={(e) => setSelectedLocale(e.target.value || null)}
              className="border border-stone-300 dark:border-stone-600 rounded-md p-1 text-sm bg-white dark:bg-stone-700"
            >
              <option value="">All Locales</option>
              {availableLocales.map(locale => (
                <option key={locale} value={locale}>
                  {locale.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 border border-stone-300 dark:border-stone-600 rounded-md hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {hasFilters && (
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-stone-600 dark:text-stone-400">Active filters:</span>
            {searchQuery && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                Search: {searchQuery}
              </span>
            )}
            {selectedCategory && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                Category: {selectedCategory}
              </span>
            )}
            {selectedLocale && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                Locale: {selectedLocale.toUpperCase()}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}