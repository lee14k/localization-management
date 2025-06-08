import {create} from 'zustand';
import {produce} from 'immer';
import {enableMapSet} from 'immer';

enableMapSet();

interface UIState {
  editingTranslationId: string | null;
  editingLocale: string | null;
  expandedKeys: Set<string>;

  searchQuery: string;
  selectedCategory: string | null;
  selectedLocale: string | null;
}

interface UIActions {
  // Editor actions
  openEditor: (translationId: string, locale: string) => void;
  closeEditor: () => void;
  
  // UI state actions
  toggleKeyExpansion: (keyId: string) => void;
  
  // Search actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedLocale: (locale: string | null) => void;
  clearFilters: () => void;
}


interface Selectors {
  isKeyExpanded: (keyId: string) => boolean;
  isEditing: (translationId: string, locale: string) => boolean;
  getSearchFilters: () => {
    query?: string;
    category?: string;
    locale?: string;
  };
}

interface StoreState extends UIState, UIActions, Selectors {}

const useStore = create<StoreState>((set, get) => ({

  editingTranslationId: null,
  editingLocale: null,
  expandedKeys: new Set<string>(),
  searchQuery: '',
  selectedCategory: null,
  selectedLocale: null,


  openEditor: (translationId: string, locale: string) =>
    set({
      editingTranslationId: translationId,
      editingLocale: locale,
    }),

  closeEditor: () =>
    set({
      editingTranslationId: null,
      editingLocale: null,
    }),

  toggleKeyExpansion: (keyId: string) =>
    set(
      produce((state) => {
        if (state.expandedKeys.has(keyId)) {
          state.expandedKeys.delete(keyId);
        } else {
          state.expandedKeys.add(keyId);
        }
      })
    ),


  setSearchQuery: (query: string) => set({ searchQuery: query }),
  
  setSelectedCategory: (category: string | null) => set({ selectedCategory: category }),
  
  setSelectedLocale: (locale: string | null) => set({ selectedLocale: locale }),
  
  clearFilters: () => set({ 
    searchQuery: '', 
    selectedCategory: null, 
    selectedLocale: null 
  }),

  isKeyExpanded: (keyId: string) => get().expandedKeys.has(keyId),
  
  isEditing: (translationId: string, locale: string) => {
    const state = get();
    return state.editingTranslationId === translationId && state.editingLocale === locale;
  },

  getSearchFilters: () => {
    const state = get();
    const filters: { query?: string; category?: string; locale?: string } = {};
    
    if (state.searchQuery.trim()) {
      filters.query = state.searchQuery.trim();
    }
    if (state.selectedCategory) {
      filters.category = state.selectedCategory;
    }
    if (state.selectedLocale) {
      filters.locale = state.selectedLocale;
    }
    
    return filters;
  },
}));

export default useStore;