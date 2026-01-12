import api from './client'
import type { Service } from '@/types/Service'
import { mockServices } from '@/mocks/services'

export async function getServices(): Promise<Service[]> {
  try {
    const response = await api.get<Service[]>('/services')
    if (response.data.length === 0 && import.meta.env.DEV) {
      return mockServices
    }
    return response.data
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Failed to fetch services, using mock data', error)
      return mockServices
    }
    throw error
  }
}

export function getServicesByCategory(services: Service[], categoryId: number): Service[] {
  return services.filter((s) => s.kategorie_id === categoryId)
}
