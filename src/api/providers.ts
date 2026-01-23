import api from './client'
import type { Provider } from '@/types/Provider'

export async function getProviders(): Promise<Provider[]> {
  try {
    const response = await api.get<Provider[]>('/anbieter')
    if (import.meta.env.DEV) {
      console.log(`[BACKEND] GET /anbieter → ${response.data.length} providers`)
    }
    return response.data
  } catch (error) {
    console.error('[BACKEND] GET /anbieter failed:', error)
    throw error
  }
}

export function getProviderById(providers: Provider[], id: number): Provider | undefined {
  return providers.find((p) => p.anbieterId === id)
}
