import api from './client'
import type { Category } from '@/types/Category'

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await api.get<Category[]>('/categories')
    if (import.meta.env.DEV) {
      console.log(`[BACKEND] GET /categories → ${response.data.length} categories`)
    }
    return response.data
  } catch (error) {
    console.error('[BACKEND] GET /categories failed:', error)
    throw error
  }
}

export function getTopLevelCategories(categories: Category[]): Category[] {
  return categories.filter((c) => c.oberkategorie_id === 0)
}

export function getSubCategories(categories: Category[], topId: number): Category[] {
  return categories.filter((c) => c.oberkategorie_id === topId)
}
