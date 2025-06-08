import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Toolbar from '../../components/Toolbar'
import '@testing-library/jest-dom'

// Mock the store
const mockSetSearchQuery = jest.fn()
const mockSetSelectedCategory = jest.fn()
const mockSetSelectedLocale = jest.fn()
const mockClearFilters = jest.fn()

const mockStore = {
  searchQuery: '',
  selectedCategory: null as string | null,
  selectedLocale: null as string | null,
  setSearchQuery: mockSetSearchQuery,
  setSelectedCategory: mockSetSelectedCategory,
  setSelectedLocale: mockSetSelectedLocale,
  clearFilters: mockClearFilters,
}

jest.mock('../../store/translationStore', () => ({
  __esModule: true,
  default: () => mockStore,
}))

// Mock the query
jest.mock('../../queries-and-mutations/translationQueries', () => ({
  useAvailableLocalesQuery: () => ({
    data: ['en', 'es', 'fr'],
  }),
}))

describe('Toolbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset mock store to default state
    mockStore.searchQuery = ''
    mockStore.selectedCategory = null
    mockStore.selectedLocale = null
  })

  // Test that search input field is rendered with correct placeholder
  it('renders search input', () => {
    render(<Toolbar />)
    
    const searchInput = screen.getByPlaceholderText('Search by key, description, category, or translation value')
    expect(searchInput).toBeDefined()
    expect(searchInput.tagName).toBe('INPUT')
  })

  // Test that category filter dropdown is rendered with proper label
  it('renders category filter dropdown', () => {
    render(<Toolbar />)
    
    const categorySelect = screen.getByLabelText('Category:')
    expect(categorySelect).toBeDefined()
    expect(categorySelect.tagName).toBe('SELECT')
    
    // Check for default "All Categories" option
    expect(screen.getByText('All Categories')).toBeDefined()
  })

  // Test that locale filter dropdown is rendered with proper label
  it('renders locale filter dropdown', () => {
    render(<Toolbar />)
    
    const localeSelect = screen.getByLabelText('Locale:')
    expect(localeSelect).toBeDefined()
    expect(localeSelect.tagName).toBe('SELECT')
    
    // Check for default "All Locales" option
    expect(screen.getByText('All Locales')).toBeDefined()
  })

  // Test that available locales from API are displayed in dropdown
  it('displays available locales in dropdown', () => {
    render(<Toolbar />)
    
    expect(screen.getByText('EN')).toBeDefined()
    expect(screen.getByText('ES')).toBeDefined()
    expect(screen.getByText('FR')).toBeDefined()
  })

  // Test that predefined categories are displayed in dropdown
  it('displays available categories in dropdown', () => {
    render(<Toolbar />)
    
    expect(screen.getByText('Buttons')).toBeDefined()
    expect(screen.getByText('Forms')).toBeDefined()
    expect(screen.getByText('Navigation')).toBeDefined()
    expect(screen.getByText('Messages')).toBeDefined()
  })

  // Test that search input changes trigger store update
  it('calls setSearchQuery when search input changes', async () => {
    render(<Toolbar />)
    
    const searchInput = screen.getByPlaceholderText('Search by key, description, category, or translation value')
    fireEvent.change(searchInput, { target: { value: 'test search' } })
    
    expect(mockSetSearchQuery).toHaveBeenCalledWith('test search')
  })

  // Test that category selection triggers store update
  it('calls setSelectedCategory when category changes', async () => {
    const user = userEvent.setup()
    render(<Toolbar />)
    
    const categorySelect = screen.getByLabelText('Category:')
    await user.selectOptions(categorySelect, 'buttons')
    
    expect(mockSetSelectedCategory).toHaveBeenCalledWith('buttons')
  })

  // Test that locale selection triggers store update
  it('calls setSelectedLocale when locale changes', async () => {
    const user = userEvent.setup()
    render(<Toolbar />)
    
    const localeSelect = screen.getByLabelText('Locale:')
    await user.selectOptions(localeSelect, 'en')
    
    expect(mockSetSelectedLocale).toHaveBeenCalledWith('en')
  })

  // Test that selecting "All Categories" clears the category filter
  it('clears category filter when "All Categories" is selected', async () => {
    const user = userEvent.setup()
    render(<Toolbar />)
    
    const categorySelect = screen.getByLabelText('Category:')
    await user.selectOptions(categorySelect, '')
    
    expect(mockSetSelectedCategory).toHaveBeenCalledWith(null)
  })

  // Test that selecting "All Locales" clears the locale filter
  it('clears locale filter when "All Locales" is selected', async () => {
    const user = userEvent.setup()
    render(<Toolbar />)
    
    const localeSelect = screen.getByLabelText('Locale:')
    await user.selectOptions(localeSelect, '')
    
    expect(mockSetSelectedLocale).toHaveBeenCalledWith(null)
  })

  // Test that active filters and clear button are displayed when filters are set
  it('shows clear filters button and active filters when filters are active', async () => {
    // Set up active filters
    mockStore.searchQuery = 'test query'
    mockStore.selectedCategory = 'buttons'
    mockStore.selectedLocale = 'en'
    
    render(<Toolbar />)
    
    // Should show clear button
    expect(screen.getByText('Clear Filters')).toBeDefined()
    
    // Should show active filter indicators
    expect(screen.getByText(/Search:.*test query/)).toBeDefined()
    expect(screen.getByText('Category: buttons')).toBeDefined()
    expect(screen.getByText('Locale: EN')).toBeDefined()
  })

  // Test that clear filters button triggers store action to reset filters
  it('calls clearFilters when clear button is clicked', async () => {
    const user = userEvent.setup()
    
    // Set up active filters
    mockStore.searchQuery = 'test query'
    
    render(<Toolbar />)
    
    const clearButton = screen.getByText('Clear Filters')
    await user.click(clearButton)
    
    expect(mockClearFilters).toHaveBeenCalled()
  })
}) 