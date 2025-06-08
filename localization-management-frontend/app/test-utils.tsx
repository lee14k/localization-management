import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Mock data for testing
export const mockTranslationData = [
  {
    id: 'test-1',
    key: 'button.save',
    category: 'buttons',
    description: 'Save button text',
    createdAt: '2023-01-01T00:00:00Z',
    createdBy: 'admin@test.com',
    lastModified: '2023-01-01T00:00:00Z',
    translations: {
      en: { value: 'Save', updatedAt: '2023-01-01T00:00:00Z', updatedBy: 'user@test.com' },
      es: { value: 'Guardar', updatedAt: '2023-01-01T00:00:00Z', updatedBy: 'user@test.com' },
      fr: { value: 'Sauvegarder', updatedAt: '2023-01-01T00:00:00Z', updatedBy: 'user@test.com' },
    },
  },
  {
    id: 'test-2',
    key: 'form.email',
    category: 'forms',
    description: 'Email field label',
    createdAt: '2023-01-01T00:00:00Z',
    createdBy: 'admin@test.com',
    lastModified: '2023-01-01T00:00:00Z',
    translations: {
      en: { value: 'Email', updatedAt: '2023-01-01T00:00:00Z', updatedBy: 'user@test.com' },
      es: { value: 'Correo electrónico', updatedAt: '2023-01-01T00:00:00Z', updatedBy: 'user@test.com' },
    },
  },
  {
    id: 'test-3',
    key: 'nav.home',
    category: 'navigation',
    description: 'Home navigation link',
    createdAt: '2023-01-01T00:00:00Z',
    createdBy: 'admin@test.com',
    lastModified: '2023-01-01T00:00:00Z',
    translations: {},
  },
]

export const mockAvailableLocales = ['en', 'es', 'fr', 'de']

// Common mock functions
export const createMockStoreFunctions = () => ({
  setSearchQuery: jest.fn(),
  setSelectedCategory: jest.fn(),
  setSelectedLocale: jest.fn(),
  clearFilters: jest.fn(),
  openEditor: jest.fn(),
  closeEditor: jest.fn(),
  toggleKeyExpansion: jest.fn(),
  isKeyExpanded: jest.fn().mockReturnValue(false),
  isEditing: jest.fn().mockReturnValue(false),
  getSearchFilters: jest.fn().mockReturnValue({}),
})

export const createMockQueryHooks = () => ({
  useTranslationSearchQuery: jest.fn().mockReturnValue({
    data: mockTranslationData,
    isLoading: false,
    error: null,
  }),
  useAvailableLocalesQuery: jest.fn().mockReturnValue({
    data: mockAvailableLocales,
    isLoading: false,
    error: null,
  }),
  useUpdateTranslationMutation: jest.fn().mockReturnValue({
    mutateAsync: jest.fn().mockResolvedValue({}),
    isPending: false,
    error: null,
  }),
})

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

// Custom render function that can be extended with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { ...options })

export * from '@testing-library/react'
export { customRender as render } 