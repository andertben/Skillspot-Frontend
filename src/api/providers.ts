import api from './client'
import type { Provider } from '@/types/Provider'
import { mockProviders } from '@/mocks/providers'

export async function getProviders(): Promise<Provider[]> {
  try {
    const response = await api.get<Provider[]>('/providers')
    if (response.data.length === 0 && import.meta.env.DEV) {
      return mockProviders
    }
    return response.data
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Failed to fetch providers, using mock data', error)
      return mockProviders
    }
    throw error
  }
}

export function getProviderById(providers: Provider[], id: number): Provider | undefined {
  return providers.find((p) => p.anbieter_id === id)
}
