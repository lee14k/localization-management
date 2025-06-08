import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../../components/Button'
import '@testing-library/jest-dom'

describe('Button Component', () => {
  const mockOnClick = jest.fn()

  beforeEach(() => {
    mockOnClick.mockClear()
  })

  // Test that button renders correctly with required props
  it('renders with required props', () => {
    render(<Button text="Test Button" onClick={mockOnClick} />)
    
    const button = screen.getByRole('button', { name: 'Test Button' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Test Button')
  })

  // Test that onClick handler is called when button is clicked
  it('calls onClick when clicked', () => {
    render(<Button text="Click Me" onClick={mockOnClick} />)
    
    const button = screen.getByRole('button', { name: 'Click Me' })
    fireEvent.click(button)
    
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  // Test that disabled button does not trigger onClick handler
  it('does not call onClick when disabled', () => {
    render(<Button text="Disabled" onClick={mockOnClick} disabled={true} />)
    
    const button = screen.getByRole('button', { name: 'Disabled' })
    fireEvent.click(button)
    
    expect(mockOnClick).not.toHaveBeenCalled()
    expect(button).toBeDisabled()
  })

  describe('Variants', () => {
    // Test that primary variant applies correct styling classes
    it('renders primary variant with correct classes', () => {
      render(<Button text="Primary" onClick={mockOnClick} variant="primary" />)
      
      const button = screen.getByRole('button', { name: 'Primary' })
      expect(button).toHaveClass('text-white', 'bg-blue-600')
    })

    // Test that secondary variant applies correct styling classes
    it('renders secondary variant with correct classes', () => {
      render(<Button text="Secondary" onClick={mockOnClick} variant="secondary" />)
      
      const button = screen.getByRole('button', { name: 'Secondary' })
      expect(button).toHaveClass('text-gray-600', 'border', 'border-gray-300', 'bg-white')
    })

    // Test that danger variant applies correct styling classes
    it('renders danger variant with correct classes', () => {
      render(<Button text="Danger" onClick={mockOnClick} variant="danger" />)
      
      const button = screen.getByRole('button', { name: 'Danger' })
      expect(button).toHaveClass('text-white', 'bg-red-600')
    })

    // Test that button defaults to primary variant when no variant is specified
    it('defaults to primary variant when no variant is specified', () => {
      render(<Button text="Default" onClick={mockOnClick} />)
      
      const button = screen.getByRole('button', { name: 'Default' })
      expect(button).toHaveClass('text-white', 'bg-blue-600')
    })
  })

  describe('Sizes', () => {
    // Test that small size applies correct styling classes
    it('renders small size with correct classes', () => {
      render(<Button text="Small" onClick={mockOnClick} size="sm" />)
      
      const button = screen.getByRole('button', { name: 'Small' })
      expect(button).toHaveClass('px-2', 'py-1', 'text-xs')
    })

    // Test that medium size applies correct styling classes
    it('renders medium size with correct classes', () => {
      render(<Button text="Medium" onClick={mockOnClick} size="md" />)
      
      const button = screen.getByRole('button', { name: 'Medium' })
      expect(button).toHaveClass('px-3', 'py-2', 'text-sm')
    })

    // Test that large size applies correct styling classes
    it('renders large size with correct classes', () => {
      render(<Button text="Large" onClick={mockOnClick} size="lg" />)
      
      const button = screen.getByRole('button', { name: 'Large' })
      expect(button).toHaveClass('px-4', 'py-2', 'text-base')
    })

    // Test that button defaults to small size when no size is specified
    it('defaults to small size when no size is specified', () => {
      render(<Button text="Default Size" onClick={mockOnClick} />)
      
      const button = screen.getByRole('button', { name: 'Default Size' })
      expect(button).toHaveClass('px-2', 'py-1', 'text-xs')
    })
  })

  describe('Disabled State', () => {
    // Test that disabled state applies appropriate visual styling
    it('applies disabled classes when disabled', () => {
      render(<Button text="Disabled" onClick={mockOnClick} disabled={true} />)
      
      const button = screen.getByRole('button', { name: 'Disabled' })
      expect(button).toHaveClass('bg-gray-400', 'cursor-not-allowed')
      expect(button).toBeDisabled()
    })

    // Test that enabled button does not have disabled styling
    it('applies variant classes when not disabled', () => {
      render(<Button text="Enabled" onClick={mockOnClick} disabled={false} />)
      
      const button = screen.getByRole('button', { name: 'Enabled' })
      expect(button).not.toHaveClass('bg-gray-400', 'cursor-not-allowed')
      expect(button).not.toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    // Test that button has proper focus styling for keyboard navigation
    it('has proper focus styles', () => {
      render(<Button text="Focus Test" onClick={mockOnClick} />)
      
      const button = screen.getByRole('button', { name: 'Focus Test' })
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2')
    })

    // Test that button maintains proper semantic HTML structure
    it('maintains button semantics', () => {
      render(<Button text="Semantic Test" onClick={mockOnClick} />)
      
      const button = screen.getByRole('button', { name: 'Semantic Test' })
      expect(button.tagName).toBe('BUTTON')
    })
  })
}) 