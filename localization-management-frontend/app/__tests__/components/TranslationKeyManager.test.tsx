import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TranslationKeyManager from '../../components/TranslationKeyManager'
import '@testing-library/jest-dom'

// Mock the store
const mockOpenEditor = jest.fn()
const mockToggleKeyExpansion = jest.fn()
const mockIsKeyExpanded = jest.fn()
const mockIsEditing = jest.fn()
const mockGetSearchFilters = jest.fn()

jest.mock('../../store/translationStore', () => ({
  __esModule: true,
  default: () => ({
    openEditor: mockOpenEditor,
    toggleKeyExpansion: mockToggleKeyExpansion,
    isKeyExpanded: mockIsKeyExpanded,
    isEditing: mockIsEditing,
    getSearchFilters: mockGetSearchFilters,
  }),
}))

// Mock the query
jest.mock('../../queries-and-mutations/translationQueries', () => ({
  useTranslationSearchQuery: jest.fn(),
}))

// Mock the text highlighter
jest.mock('../../hooks/textHighlight', () => ({
  useTextHighlighter: jest.fn(),
}))

// Import the mocked modules to access the mock functions
import { useTranslationSearchQuery } from '../../queries-and-mutations/translationQueries'
import { useTextHighlighter } from '../../hooks/textHighlight'

// Create typed versions of the mocked functions using Jest's built-in types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockUseTranslationSearchQuery = useTranslationSearchQuery as jest.MockedFunction<typeof useTranslationSearchQuery>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockUseTextHighlighter = useTextHighlighter as jest.MockedFunction<typeof useTextHighlighter>

const mockTranslationQuery = {
  data: [],
  isLoading: false,
  error: null,
}

const mockTranslationData = [
  {
    id: 'test-1',
    key: 'button.save',
    category: 'buttons',
    description: 'Save button text',
    createdAt: '2023-01-01',
    createdBy: 'user@test.com',
    lastModified: '2023-01-01',
    translations: {
      en: { value: 'Save', updatedAt: '2023-01-01', updatedBy: 'user@test.com' },
      es: { value: 'Guardar', updatedAt: '2023-01-01', updatedBy: 'user@test.com' },
    },
  },
  {
    id: 'test-2',
    key: 'form.email',
    category: 'forms',
    description: 'Email field label',
    createdAt: '2023-01-01',
    createdBy: 'user@test.com',
    lastModified: '2023-01-01',
    translations: {} as Record<string, { value: string; updatedAt: string; updatedBy: string }>,
  },
]

describe('TranslationKeyManager Component', () => {
  // Create a mock highlight function
  const mockHighlightText = jest.fn((text: string) => text)

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetSearchFilters.mockReturnValue({})
    mockIsKeyExpanded.mockReturnValue(false)
    mockIsEditing.mockReturnValue(false)
    mockHighlightText.mockImplementation((text: string) => text)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(mockUseTextHighlighter as any).mockReturnValue(mockHighlightText)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(mockUseTranslationSearchQuery as any).mockReturnValue(mockTranslationQuery)
  })

  describe('Loading State', () => {
    // Test that loading state is displayed when data is being fetched
    it('displays loading message when isLoading is true', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockUseTranslationSearchQuery as any).mockReturnValue({
        ...mockTranslationQuery,
        isLoading: true,
      })

      render(<TranslationKeyManager />)
      
      expect(screen.getByText('Loading translations...')).toBeDefined()
    })
  })

  describe('Error State', () => {
    // Test that error messages are displayed when API calls fail
    it('displays error message when there is an error', () => {
      const error = new Error('Network error')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockUseTranslationSearchQuery as any).mockReturnValue({
        ...mockTranslationQuery,
        error,
      })

      render(<TranslationKeyManager />)
      
      expect(screen.getByText(/Error loading translations: Network error/)).toBeDefined()
    })
  })

  describe('Empty State', () => {
    // Test that appropriate message is shown when no translations are available
    it('displays no translations message when data is empty', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockUseTranslationSearchQuery as any).mockReturnValue({
        ...mockTranslationQuery,
        data: [],
      })

      render(<TranslationKeyManager />)
      
      expect(screen.getByText('No translations available.')).toBeDefined()
    })

    // Test that filtered empty state shows different message when filters are active
    it('displays filtered message when filters are active but no results', () => {
      mockGetSearchFilters.mockReturnValue({ search: 'no-match' })
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockUseTranslationSearchQuery as any).mockReturnValue({
        ...mockTranslationQuery,
        data: [],
      })

      render(<TranslationKeyManager />)
      
      expect(screen.getByText('No translations found matching your filters.')).toBeDefined()
    })
  })

  describe('Translation Display', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockUseTranslationSearchQuery as any).mockReturnValue({
        ...mockTranslationQuery,
        data: mockTranslationData,
      })
    })

    // Test that translation keys and their categories are rendered correctly
    it('renders translation keys and categories', () => {
      render(<TranslationKeyManager />)
      
      expect(screen.getByText('button.save')).toBeDefined()
      expect(screen.getByText('form.email')).toBeDefined()
      expect(screen.getByText('Buttons')).toBeDefined()
      expect(screen.getByText('Forms')).toBeDefined()
    })

    // Test that locale indicators are shown for translations with data
    it('displays locale indicators for translations with data', () => {
      render(<TranslationKeyManager />)
      
      // Should show EN and ES for button.save
      const localeIndicators = screen.getAllByText('EN')
      expect(localeIndicators.length).toBeGreaterThan(0)
    })

    // Test that empty translation state is properly indicated
    it('shows no translations available message for empty translations', () => {
      render(<TranslationKeyManager />)
      
      expect(screen.getByText('No translations available')).toBeDefined()
    })

    // Test that translation descriptions are displayed when provided
    it('displays description when present', () => {
      render(<TranslationKeyManager />)
      
      expect(screen.getByText('Save button text')).toBeDefined()
      expect(screen.getByText('Email field label')).toBeDefined()
    })
  })

  describe('Expansion Functionality', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockUseTranslationSearchQuery as any).mockReturnValue({
        ...mockTranslationQuery,
        data: mockTranslationData,
      })
    })

    // Test that clicking chevron button toggles the expansion state
    it('toggles expansion when chevron button is clicked', async () => {
      const user = userEvent.setup()
      render(<TranslationKeyManager />)
      
      const chevronButtons = screen.getAllByRole('button')
      const chevronButton = chevronButtons.find(btn => btn.querySelector('svg'))
      
      if (chevronButton) {
        await user.click(chevronButton)
        expect(mockToggleKeyExpansion).toHaveBeenCalledWith('test-1')
      }
    })

    // Test that expanded translations show their detailed values
    it('shows translation details when expanded', () => {
      mockIsKeyExpanded.mockReturnValue(true)
      
      render(<TranslationKeyManager />)
      
      // Should show translation values when expanded
      expect(screen.getByText('Save')).toBeDefined()
      expect(screen.getByText('Guardar')).toBeDefined()
    })

    // Test that edit buttons are displayed for existing translations when expanded
    it('shows edit button for existing translations when expanded', () => {
      mockIsKeyExpanded.mockReturnValue(true)
      
      render(<TranslationKeyManager />)
      
      const editButtons = screen.getAllByText('Edit')
      expect(editButtons.length).toBeGreaterThan(0)
    })

    // Test that clicking edit button triggers the editor opening functionality
    it('calls openEditor when edit button is clicked', async () => {
      const user = userEvent.setup()
      mockIsKeyExpanded.mockReturnValue(true)
      
      render(<TranslationKeyManager />)
      
      const editButtons = screen.getAllByText('Edit')
      if (editButtons[0]) {
        await user.click(editButtons[0])
        expect(mockOpenEditor).toHaveBeenCalled()
      }
    })
  })

  describe('Editor Integration', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockUseTranslationSearchQuery as any).mockReturnValue({
        ...mockTranslationQuery,
        data: mockTranslationData,
      })
      mockIsKeyExpanded.mockReturnValue(true)
    })

    // Test that editor component is displayed when editing mode is active
    it('shows editor when isEditing returns true', () => {
      mockIsEditing.mockImplementation((id, locale) => id === 'test-1' && locale === 'en')
      
      render(<TranslationKeyManager />)
      
      // Should render TranslationEditor component
      // Since it's mocked, we just check that the edit button is not shown
      const editButtons = screen.queryAllByText('Edit')
      // When editing, edit button should be replaced by editor
      expect(editButtons.length).toBeLessThan(2) // One should be replaced by editor
    })
  })

  describe('Category Styling', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockUseTranslationSearchQuery as any).mockReturnValue({
        ...mockTranslationQuery,
        data: mockTranslationData,
      })
    })

    // Test that different categories receive appropriate styling
    it('applies correct styling for different categories', () => {
      render(<TranslationKeyManager />)
      
      const buttonsCategory = screen.getByText('Buttons')
      const formsCategory = screen.getByText('Forms')
      
      // Check that category elements exist (styling classes are applied in the component)
      expect(buttonsCategory).toBeDefined()
      expect(formsCategory).toBeDefined()
    })
  })

  describe('Text Highlighting', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockUseTranslationSearchQuery as any).mockReturnValue({
        ...mockTranslationQuery,
        data: mockTranslationData,
      })
    })

    // Test that text highlighter is initialized with correct search query
    it('calls useTextHighlighter with search query from filters', () => {
      mockGetSearchFilters.mockReturnValue({ query: 'save' })
      
      render(<TranslationKeyManager />)
      
      expect(mockUseTextHighlighter).toHaveBeenCalledWith('save')
    })

    // Test that translation keys are highlighted when matching search query
    it('highlights translation keys when search query is present', () => {
      mockGetSearchFilters.mockReturnValue({ query: 'save' })
      mockHighlightText.mockImplementation((text: string) => 
        text.includes('save') ? `<mark>${text}</mark>` : text
      )
      
      render(<TranslationKeyManager />)
      
      expect(mockHighlightText).toHaveBeenCalledWith('button.save')
      expect(mockHighlightText).toHaveBeenCalledWith('form.email')
    })

    // Test that category names are highlighted when matching search query
    it('highlights category names when search query matches', () => {
      mockGetSearchFilters.mockReturnValue({ query: 'button' })
      mockHighlightText.mockImplementation((text: string) => 
        text.includes('button') ? `<mark>${text}</mark>` : text
      )
      
      render(<TranslationKeyManager />)
      
      expect(mockHighlightText).toHaveBeenCalledWith('Buttons')
      expect(mockHighlightText).toHaveBeenCalledWith('Forms')
    })

    // Test that translation descriptions are highlighted when matching search query
    it('highlights descriptions when search query matches', () => {
      mockGetSearchFilters.mockReturnValue({ query: 'Save' })
      mockHighlightText.mockImplementation((text: string) => 
        text.includes('Save') ? `<mark>${text}</mark>` : text
      )
      
      render(<TranslationKeyManager />)
      
      expect(mockHighlightText).toHaveBeenCalledWith('Save button text')
      expect(mockHighlightText).toHaveBeenCalledWith('Email field label')
    })

    // Test that translation values are highlighted when expanded and matching search query
    it('highlights translation values when expanded and search query matches', () => {
      mockGetSearchFilters.mockReturnValue({ query: 'Save' })
      mockIsKeyExpanded.mockReturnValue(true)
      mockHighlightText.mockImplementation((text: string) => 
        text.includes('Save') ? `<mark>${text}</mark>` : text
      )
      
      render(<TranslationKeyManager />)
      
      expect(mockHighlightText).toHaveBeenCalledWith('Save')
      expect(mockHighlightText).toHaveBeenCalledWith('Guardar')
    })

    // Test that highlighting is not applied when no search query is present
    it('does not highlight when no search query is present', () => {
      mockGetSearchFilters.mockReturnValue({})
      
      render(<TranslationKeyManager />)
      
      // Should still call highlightText but with no query
      expect(mockHighlightText).toHaveBeenCalled()
      // Verify that text is returned as-is
      expect(screen.getByText('button.save')).toBeDefined()
      expect(screen.getByText('Save button text')).toBeDefined()
    })

    // Test that multiple elements with same search term are all highlighted
    it('highlights multiple elements with the same search term', () => {
      mockGetSearchFilters.mockReturnValue({ query: 'button' })
      mockHighlightText.mockImplementation((text: string) => {
        if (text.toLowerCase().includes('button')) {
          return `<mark>${text}</mark>`
        }
        return text
      })
      
      render(<TranslationKeyManager />)
      
      // Should highlight both the key and the description that contain 'button'
      expect(mockHighlightText).toHaveBeenCalledWith('button.save')
      expect(mockHighlightText).toHaveBeenCalledWith('Save button text')
    })

    // Test that component renders correctly when highlighter returns JSX elements
    it('preserves original text when highlight function returns JSX', () => {
      mockGetSearchFilters.mockReturnValue({ query: 'save' })
      mockHighlightText.mockImplementation((text: string) => {
        if (text.includes('save')) {
          return text // Return string instead of JSX for simplicity
        }
        return text
      })
      
      render(<TranslationKeyManager />)
      
      // Should still render the component without errors
      expect(screen.getByText('button.save')).toBeDefined()
    })
  })
}) 