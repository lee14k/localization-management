import {create} from 'zustand';
import {produce} from 'immer';
import {enableMapSet} from 'immer';
import {TranslationSchema} from '../schemas/translationSchema';
import { z } from 'zod';

enableMapSet();

type Translation = z.infer<typeof TranslationSchema>;

interface TranslationItem {
  id: string;
  key: string;
  category: string;
  description?: string;
  createdAt: string;
  createdBy: string;
  lastModified: string;
  translations: Record<string, Translation>;
}

interface UIState {
  editingTranslationId: string | null;
  editingLocale: string | null;
  expandedKeys: Set<string>;
  isLoading: boolean;
  error: string | null;
}

interface DataState {
  translations: TranslationItem[];
  lastSaved: string | null;
}

interface UIActions {
  openEditor: (translationId: string, locale: string) => void;
  closeEditor: () => void;
  toggleKeyExpansion: (keyId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

interface DataActions {
  updateTranslation: (translationId: string, locale: string, newValue: string) => Promise<void>;
  duplicateTranslation: (translationId: string) => void;
}

interface Selectors {
  isKeyExpanded: (keyId: string) => boolean;
  isEditing: (translationId: string, locale: string) => boolean;
}

interface StoreState extends UIState, DataState, UIActions, DataActions, Selectors {}

const sampleData: TranslationItem[] = [
  {
    id: '1',
    key: 'button.save',
    category: 'buttons',
    description: 'Save button text',
    createdAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin@example.com',
    lastModified: '2024-01-20T14:30:00Z',
    translations: {
     en: { value: 'Save', updatedAt: '2024-01-15T10:00:00Z', updatedBy: 'admin@example.com' },
     es: { value: 'Guardar', updatedAt: '2024-01-16T09:15:00Z', updatedBy: 'translator@example.com' },
     fr: { value: 'Sauvegarder', updatedAt: '2024-01-17T11:20:00Z', updatedBy: 'translator@example.com' }
    }
  },
  {
    id: '2',
    key: 'button.cancel',
    category: 'buttons',
    description: 'Cancel button text',
    createdAt: '2024-01-15T10:05:00Z',
    createdBy: 'admin@example.com',
    lastModified: '2024-01-18T16:45:00Z',
    translations: {
      en: { value: 'Cancel', updatedAt: '2024-01-15T10:05:00Z', updatedBy: 'admin@example.com' },
      es: { value: 'Cancelar', updatedAt: '2024-01-16T09:20:00Z', updatedBy: 'translator@example.com' },
      fr: { value: 'Annuler', updatedAt: '2024-01-17T11:25:00Z', updatedBy: 'translator@example.com' }
    }
  },
  {
    id: '3',
    key: 'form.email.label',
    category: 'forms',
    description: 'Email field label',
    createdAt: '2024-01-16T14:20:00Z',
    createdBy: 'developer@example.com',
    lastModified: '2024-01-19T10:10:00Z',
    translations: {
      en: { value: 'Email Address', updatedAt: '2024-01-16T14:20:00Z', updatedBy: 'developer@example.com' },
      es: { value: 'Dirección de Correo', updatedAt: '2024-01-17T08:30:00Z', updatedBy: 'translator@example.com' },
      fr: { value: 'Adresse E-mail', updatedAt: '2024-01-18T13:15:00Z', updatedBy: 'translator@example.com' }
    }
  }
];

const useStore = create<StoreState>((set, get) => ({
  editingTranslationId: null,
  editingLocale: null,
  expandedKeys: new Set<string>(),
  isLoading: false,
  error: null,

  translations: sampleData,
  lastSaved: null,

  openEditor: (translationId: string, locale: string) =>
    set({
      editingTranslationId: translationId,
      editingLocale: locale,
      error: null,
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

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),

  updateTranslation: async (translationId: string, locale: string, newValue: string) => {
    const { setLoading, setError } = get();
    
    try {
      setLoading(true);
      setError(null);

      set(
        produce((state) => {
          const translation = state.translations.find((t: TranslationItem) => t.id === translationId);
          if (translation && translation.translations[locale]) {
            const newTranslation = {
              value: newValue,
              updatedAt: new Date().toISOString(),
              updatedBy: 'current@user.com',
            };

            try {
              const validatedTranslation = TranslationSchema.parse(newTranslation);
              translation.translations[locale] = validatedTranslation;
              translation.lastModified = new Date().toISOString();
              state.lastSaved = new Date().toISOString();
            } catch (error) {
              throw new Error('Invalid translation format');
            }
          }
        })
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update translation');
      throw error;
    } finally {
      setLoading(false);
    }
  },

  duplicateTranslation: (translationId: string) =>
    set(
      produce((state) => {
        const original = state.translations.find((t: TranslationItem) => t.id === translationId);
        if (original) {
          const now = new Date().toISOString();
          const duplicate: TranslationItem = {
            ...original,
            id: Date.now().toString(),
            key: `${original.key}_copy`,
            createdAt: now,
            lastModified: now,
          };
          state.translations.push(duplicate);
        }
      })
    ),

  isKeyExpanded: (keyId: string) => get().expandedKeys.has(keyId),
  
  isEditing: (translationId: string, locale: string) => {
    const state = get();
    return state.editingTranslationId === translationId && state.editingLocale === locale;
  },
}));

export default useStore;