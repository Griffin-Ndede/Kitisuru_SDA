import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../Api', () => ({
  getDocuments: vi.fn(),
  getMinistries: vi.fn(),
  getMinistry: vi.fn(),
  getUpcomingEvents: vi.fn(),
  getYoutubeLinks: vi.fn(),
}))

import * as api from '../Api'
import {
  homeLoader,
  ministriesLoader,
  ministryLoader,
  resourcesLoader,
} from '../Loaders/loaders'

beforeEach(() => vi.resetAllMocks())

describe('loaders', () => {
  it('homeLoader returns sermons and events together', async () => {
    api.getYoutubeLinks.mockResolvedValue([{ id: 1 }])
    api.getUpcomingEvents.mockResolvedValue([{ id: 2 }])
    expect(await homeLoader()).toEqual({
      youtubeContent: [{ id: 1 }],
      upcomingEvents: [{ id: 2 }],
    })
  })

  it('homeLoader lets API failures reach the error page', async () => {
    api.getYoutubeLinks.mockRejectedValue(new Error('network down'))
    api.getUpcomingEvents.mockResolvedValue([])
    await expect(homeLoader()).rejects.toThrow('network down')
  })

  it('ministriesLoader and resourcesLoader return their data', async () => {
    api.getMinistries.mockResolvedValue([{ id: 1 }])
    api.getDocuments.mockResolvedValue([{ id: 9 }])
    expect(await ministriesLoader()).toEqual({ ministries: [{ id: 1 }] })
    expect(await resourcesLoader()).toEqual({ documents: [{ id: 9 }] })
  })

  it('ministryLoader passes the route id to the API', async () => {
    api.getMinistry.mockResolvedValue({ id: 3 })
    expect(await ministryLoader({ params: { id: '3' } })).toEqual({ ministry: { id: 3 } })
    expect(api.getMinistry).toHaveBeenCalledWith('3')
  })

  it('ministryLoader turns an API 404 into a 404 response', async () => {
    api.getMinistry.mockRejectedValue({ response: { status: 404 } })
    const thrown = await ministryLoader({ params: { id: '999' } }).catch((e) => e)
    expect(thrown).toBeInstanceOf(Response)
    expect(thrown.status).toBe(404)
  })

  it('ministryLoader rethrows other errors unchanged', async () => {
    api.getMinistry.mockRejectedValue(new Error('timeout'))
    await expect(ministryLoader({ params: { id: '1' } })).rejects.toThrow('timeout')
  })
})
