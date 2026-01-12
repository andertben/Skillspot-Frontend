import api from './client'
import type { Category } from '@/types/Category'
import { mockCategories } from '@/mocks/categories'

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await api.get<Category[]>('/categories')
    if (response.data.length === 0 && import.meta.env.DEV) {
      return mockCategories
    }
    return response.data
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Failed to fetch categories, using mock data', error)
      return mockCategories
    }
    throw error
  }
}

export function getTopLevelCategories(categories: Category[]): Category[] {
  return categories.filter((c) => c.oberkategorie_id === 0)
}

export function getSubCategories(categories: Category[], topId: number): Category[] {
  return categories.filter((c) => c.oberkategorie_id === topId)
}
