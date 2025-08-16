import { vi } from 'vitest'

const { mockedGet } = vi.hoisted(() => ({
  mockedGet: vi.fn(),
}))

vi.mock('@/lib/appwrite', () => ({
  account: { get: mockedGet },
}))

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect } from 'vitest'
import useSession from './user'

describe('useSession', () => {
  it('fetches the current session', async () => {
    const user = { $id: '1', name: 'John Doe', email: 'john@example.com' }
    mockedGet.mockResolvedValue(user)

    const queryClient = new QueryClient()
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useSession(), { wrapper })

    await waitFor(() => {
      expect(result.current.data).toEqual(user)
    })

    expect(mockedGet).toHaveBeenCalled()
  })
})
