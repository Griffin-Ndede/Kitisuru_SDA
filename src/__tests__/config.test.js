import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('API base URL', () => {
  it('uses VITE_API_BASE_URL when it is set', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://example.test')
    const { default: BASE_URL } = await import('../config.jsx')
    expect(BASE_URL).toBe('https://example.test')
  })

  it('falls back to the local server in development', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    vi.stubEnv('DEV', true)
    const { default: BASE_URL } = await import('../config.jsx')
    expect(BASE_URL).toBe('http://127.0.0.1:8000')
  })

  it('falls back to the live API in a production build', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    vi.stubEnv('DEV', false)
    const { default: BASE_URL } = await import('../config.jsx')
    expect(BASE_URL).toBe('https://api.kitisurusda.org')
  })
})
