export interface Category {
  id: number
  name: string
  icon?: string | null
  parentId?: number | null
  children?: Category[]
  
  // Keep old fields for compatibility with other pages until they are updated
  kategorie_id?: number
  bezeichnung?: string
  oberkategorie_id?: number | null
}
