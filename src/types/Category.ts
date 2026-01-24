export interface Category {
  id: number
  name: string
  icon?: string | null
  parentId?: number | null
  children?: Category[]
  
  // Keep old fields for compatibility with older components during transition
  kategorie_id?: number
  bezeichnung?: string
  oberkategorie_id?: number | null
}

export type { NormalizedCategory } from '@/helpers/categoryNormalize'
