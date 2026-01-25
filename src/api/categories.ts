import api from './client'
import type { Category, NormalizedCategory } from '@/types/Category'
import i18n from '@/i18n/i18n'
import { normalizeCategories } from '@/helpers/categoryNormalize'

function getLanguage(): 'de' | 'en' {
  const lang = (i18n.language || 'de').slice(0, 2)
  return lang === 'en' ? 'en' : 'de'
}

export async function getCategories(): Promise<NormalizedCategory[]> {
  try {
    const lang = getLanguage()
    const response = await api.get<Category[]>('/kategorien', {
      params: { lang }
    })
    
    const normalized = normalizeCategories(response.data)
    
    if (import.meta.env.DEV) {
      console.debug(`[API] GET /kategorien?lang=${lang} → ${normalized.length} categories (First: ${normalized[0]?.name})`)
    }
    
    return normalized
  } catch (error) {
    console.error('[API] GET /kategorien failed:', error)
    throw error
  }
}

export function getTopLevelCategories(categories: NormalizedCategory[]): NormalizedCategory[] {
  return categories.filter((c) => c.parentId === 0 || c.parentId === null)
}

export function getSubCategories(categories: NormalizedCategory[], topId: number): NormalizedCategory[] {
  return categories.filter((c) => c.parentId === topId)
}
