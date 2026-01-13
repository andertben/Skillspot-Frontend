import api from './client'
import type { Service } from '@/types/Service'

export async function getServices(): Promise<Service[]> {
  try {
    const response = await api.get<Service[]>('/services')
    if (import.meta.env.DEV) {
      console.log(`[BACKEND] GET /services → ${response.data.length} services`)
    }
    return response.data
  } catch (error) {
    console.error('[BACKEND] GET /services failed:', error)
    throw error
  }
}

export function getServicesByCategory(services: Service[], categoryId: number): Service[] {
  return services.filter((s) => s.kategorie_id === categoryId)
}
