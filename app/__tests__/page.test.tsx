import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../page'

//�� Basic Rendering Tests
describe('Home Page', () => {
  it('shows the main heading', () => {
    render(<Home />)
    expect(screen.getByText('Royal Stone Care SMS Marketing')).toBeInTheDocument()
  })

  it('displays the customer section', () => {
    render(<Home />)
    expect(screen.getByText('Customers')).toBeInTheDocument()
  })

  it('displays the message composition section', () => {
    render(<Home />)
    expect(screen.getByText('Compose Message')).toBeInTheDocument()
  })

  // 🎯 Customer List Tests
  it('shows customer list with checkboxes', () => {
    render(<Home />)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(3) // Since we have 3 example customers
  })

  // ✍️ Message Composition Tests
  it('allows typing in the message textarea', () => {
    render(<Home />)
    const textarea = screen.getByPlaceholderText('Type your message here...')
    fireEvent.change(textarea, { target: { value: 'Hello customers!' } })
    expect(textarea).toHaveValue('Hello customers!')
  })

  it('has a working send button', () => {
    render(<Home />)
    const sendButton = screen.getByText('Send Message')
    expect(sendButton).toBeInTheDocument()
  })
}) 