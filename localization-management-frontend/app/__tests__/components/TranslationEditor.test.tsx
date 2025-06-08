import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TranslationEditor from '../../components/TranslationEditor'
import '@testing-library/jest-dom'
// Mock the store
const mockCloseEditor = jest.fn()
jest.mock('../../store/translationStore', () => ({
  __esModule: true,
  default: () => ({
    closeEditor: mockCloseEditor,
  }),
}))

// Mock the mutation
const mockMutateAsync = jest.fn()
jest.mock('../../queries-and-mutations/translationMutations', () => ({
  useUpdateTranslationMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
    error: null,
  }),
}))

describe('TranslationEditor Component', () => {
  const defaultProps = {
    translationId: 'test-id',
    locale: 'en',
    currentValue: 'Hello World',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Test that the editor renders with the provided initial value
  it('renders with initial value', () => {
    render(<TranslationEditor {...defaultProps} />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveValue('Hello World')
  })

  // Test that save and cancel action buttons are rendered
  it('renders save and cancel buttons', () => {
    render(<TranslationEditor {...defaultProps} />)
    
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  // Test that keyboard shortcuts are displayed to guide user interaction
  it('displays keyboard shortcuts hint', () => {
    render(<TranslationEditor {...defaultProps} />)
    
    expect(screen.getByText('Press Enter to save, Escape to cancel')).toBeInTheDocument()
  })

  // Test that the textarea value updates correctly when user types
  it('updates value when typing', async () => {
    const user = userEvent.setup()
    render(<TranslationEditor {...defaultProps} />)
    
    const textarea = screen.getByRole('textbox')
    await user.clear(textarea)
    await user.type(textarea, 'New translation')
    
    expect(textarea).toHaveValue('New translation')
  })

  // Test that save functionality is triggered when save button is clicked
  it('calls mutateAsync when save button is clicked', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue({})
    
    render(<TranslationEditor {...defaultProps} />)
    
    const textarea = screen.getByRole('textbox')
    await user.clear(textarea)
    await user.type(textarea, 'Updated translation')
    
    const saveButton = screen.getByRole('button', { name: 'Save' })
    await user.click(saveButton)
    
    expect(mockMutateAsync).toHaveBeenCalledWith({
      id: 'test-id',
      locale: 'en',
      data: { value: 'Updated translation' }
    })
  })

  // Test that editor closes automatically after successful save operation
  it('closes editor after successful save', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue({})
    
    render(<TranslationEditor {...defaultProps} />)
    
    const saveButton = screen.getByRole('button', { name: 'Save' })
    await user.click(saveButton)
    
    await waitFor(() => {
      expect(mockCloseEditor).toHaveBeenCalled()
    })
  })

  // Test that editor closes when user clicks cancel button
  it('closes editor when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<TranslationEditor {...defaultProps} />)
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)
    
    expect(mockCloseEditor).toHaveBeenCalled()
  })

  // Test that Enter key saves the translation (keyboard shortcut)
  it('saves when Enter key is pressed without Shift', async () => {
    mockMutateAsync.mockResolvedValue({})
    
    render(<TranslationEditor {...defaultProps} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false })
    
    expect(mockMutateAsync).toHaveBeenCalled()
  })

  // Test that Escape key cancels the editing (keyboard shortcut)
  it('cancels when Escape key is pressed', async () => {
    render(<TranslationEditor {...defaultProps} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.keyDown(textarea, { key: 'Escape' })
    
    expect(mockCloseEditor).toHaveBeenCalled()
  })

  // Test that Shift+Enter allows new line without saving (multiline support)
  it('does not save when Shift+Enter is pressed', async () => {
    render(<TranslationEditor {...defaultProps} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })
    
    expect(mockMutateAsync).not.toHaveBeenCalled()
  })

  // Test that the textarea updates when the currentValue prop changes externally
  it('updates textarea value when currentValue prop changes', () => {
    const { rerender } = render(<TranslationEditor {...defaultProps} />)
    
    expect(screen.getByRole('textbox')).toHaveValue('Hello World')
    
    rerender(<TranslationEditor {...defaultProps} currentValue="Updated Value" />)
    
    expect(screen.getByRole('textbox')).toHaveValue('Updated Value')
  })
}) 