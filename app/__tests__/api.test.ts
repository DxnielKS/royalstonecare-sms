import { rest } from 'msw'
import { setupServer } from 'msw/node'
import type { RestRequest, RestContext } from 'msw'

// Define response types
interface CustomerResponse {
  customers: Array<{
    id: number
    name: string
    phone: string
  }>
}

interface MessageResponse {
  success: boolean
  messagesSent: number
}

// Mock API Server Setup
const server = setupServer(
  // Mock GET customers endpoint
  rest.get('/api/customers', (_req: RestRequest, res: any, ctx: RestContext) => {
    return res(
      ctx.json<CustomerResponse>({
        customers: [
          { id: 1, name: 'John Doe', phone: '+1234567890' },
          { id: 2, name: 'Jane Smith', phone: '+0987654321' },
        ]
      })
    )
  }),

  // Mock POST message endpoint
  rest.post('/api/send-message', (_req: RestRequest, res: any, ctx: RestContext) => {
    return res(
      ctx.json<MessageResponse>({
        success: true,
        messagesSent: 2,
      })
    )
  })
)

//🎬 Start/Stop mock server
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// 🧪 API Tests
describe('API Endpoints', () => {
  // 📋 Customer API Tests
  it('fetches customers successfully', async () => {
    const response = await fetch('/api/customers')
    const data = await response.json()
    
    expect(response.ok).toBe(true)
    expect(data.customers).toHaveLength(2)
    expect(data.customers[0].name).toBe('John Doe')
  })

  // 📱 SMS Sending Tests
  it('sends messages successfully', async () => {
    const response = await fetch('/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello customers!',
        customerIds: [1, 2],
      }),
    })
    const data = await response.json()
    
    expect(response.ok).toBe(true)
    expect(data.success).toBe(true)
    expect(data.messagesSent).toBe(2)
  })

  // 🚨 Error Handling Tests
  it('handles API errors gracefully', async () => {
    // Override the handler to simulate an error
    server.use(
      rest.post('/api/send-message', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Internal server error' })
        )
      })
    )

    const response = await fetch('/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello customers!',
        customerIds: [1, 2],
      }),
    })
    
    expect(response.ok).toBe(false)
    expect(response.status).toBe(500)
  })
}) 