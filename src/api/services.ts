import api from './client'
import type { Category } from '@/types/Category'
import type { Service } from '@/types/Service'

export interface CreateServicePayload {
  kategorieId: number
  title: string
  beschreibung?: string
  preis?: number
}

export async function fetchKategorieTree(): Promise<Category[]> {
  try {
    const response = await api.get<Category[]>('/kategorien/tree')
    return response.data
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
    const response = await api.get<Service[]>('/dienstleistungen/me')
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
