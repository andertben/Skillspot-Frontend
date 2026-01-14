import api from './client'
import type { Service } from '@/types/Service'

function detectAndFixTitleDescriptionSwap(services: Service[]): Service[] {
  if (services.length === 0) return services

  const firstService = services[0]
  const titleLength = (firstService.title || '').length
  const descLength = (firstService.beschreibung || '').length

  if (import.meta.env.DEV) {
    console.log(`[SERVICES] First service - title length: ${titleLength}, beschreibung length: ${descLength}`)
    console.log('[SERVICES] First service raw:', firstService)
  }

  const needsSwap = titleLength > 100 && descLength < 50
  if (needsSwap) {
    console.warn('[SERVICES] ⚠️ Detected title/beschreibung swap - fixing...')
    return services.map((service) => ({
      ...service,
      title: service.beschreibung,
      beschreibung: service.title,
    }))
  }

  return services
}

export async function getServices(): Promise<Service[]> {
  try {
    const response = await api.get<Service[]>('/services')
    const servicesData = response.data

    if (import.meta.env.DEV) {
      console.log(`[BACKEND] GET /services → Raw response length: ${servicesData.length}`)
      console.log('[BACKEND] First service object:', servicesData[0])
      console.log('[BACKEND] Last service object:', servicesData[servicesData.length - 1])
      console.log('[BACKEND] All service IDs:', servicesData.map((s) => s.dienstleistungId))
    }

    return detectAndFixTitleDescriptionSwap(servicesData)
  } catch (error) {
    console.error('[BACKEND] GET /services failed:', error)
    throw error
  }
}
