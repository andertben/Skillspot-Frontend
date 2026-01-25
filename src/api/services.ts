import api from './client'
import type { Category, NormalizedCategory } from '@/types/Category'
import type { Service } from '@/types/Service'
import i18n from '@/i18n/i18n'
import { normalizeCategories } from '@/helpers/categoryNormalize'

function getLanguage(): 'de' | 'en' {
  const lang = (i18n.language || 'de').slice(0, 2)
  return lang === 'en' ? 'en' : 'de'
}

export interface CreateServicePayload {
  kategorieId: number
  title: string
  beschreibung?: string
  preis?: number
}

export async function fetchKategorieTree(): Promise<NormalizedCategory[]> {
  try {
    const lang = getLanguage()
    const response = await api.get<Category[]>('/kategorien/tree', {
      params: { lang }
    })
    
    const normalized = normalizeCategories(response.data)
    
    if (import.meta.env.DEV) {
      console.debug(`[API] GET /kategorien/tree?lang=${lang} → ${normalized.length} root categories (First: ${normalized[0]?.name})`)
    }
    
    return normalized
  } catch (error) {
    console.error('[SERVICES API] fetchKategorieTree failed:', error)
    throw error
  }
}

export async function createDienstleistung(payload: CreateServicePayload): Promise<Service> {
  try {
    const response = await api.post<Service>('/dienstleistungen', payload)
    return response.data
  } catch (error) {
    console.error('[SERVICES API] createDienstleistung failed:', error)
    throw error
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const response = await api.get<Service[]>('/dienstleistungen')
    if (import.meta.env.DEV) {
      console.log(`[BACKEND] GET /dienstleistungen → status: ${response.status}, count: ${response.data.length}`)
    }
    return response.data
  } catch (error) {
    console.error('[SERVICES API] getServices failed:', error)
    throw error
  }
}

export async function getServiceById(id: number): Promise<Service> {
  try {
    const response = await api.get<Service>(`/dienstleistungen/${id}`)
    return response.data
  } catch (error) {
    console.error('[SERVICES API] getServiceById failed:', error)
    throw error
  }
}

export async function getMyServices(): Promise<Service[]> {
  try {
    const response = await api.get<Service[]>('/dienstleistungen/my')
    return response.data
  } catch (error) {
    console.error('[SERVICES API] getMyServices failed:', error)
    throw error
  }
}

export async function deleteDienstleistung(id: number): Promise<void> {
  try {
    await api.delete(`/dienstleistungen/${id}`)
  } catch (error) {
    console.error('[SERVICES API] deleteDienstleistung failed:', error)
    throw error
  }
}

export async function updateDienstleistung(id: number, payload: Partial<CreateServicePayload>): Promise<Service> {
  try {
    const response = await api.put<Service>(`/dienstleistungen/${id}`, payload)
    return response.data
  } catch (error) {
    console.error('[SERVICES API] updateDienstleistung failed:', error)
    throw error
  }
}
