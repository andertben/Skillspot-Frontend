
export interface NormalizedCategory {
  id: number
  name: string
  parentId: number | null
  icon?: string | null
  children?: NormalizedCategory[]
}

/**
 * Normalizes a category object from the backend to a consistent frontend format.
 * Handles both camelCase and snake_case fields.
 */
export function normalizeCategory(cat: any): NormalizedCategory {
  if (!cat) return { id: 0, name: '', parentId: null }

  const normalized: NormalizedCategory = {
    id: Number(cat.id ?? cat.kategorie_id ?? 0),
    name: String(cat.name ?? cat.bezeichnung ?? ''),
    parentId: cat.parentId !== undefined ? cat.parentId : (cat.oberkategorie_id !== undefined ? cat.oberkategorie_id : null),
    icon: cat.icon ?? null,
  }

  // Handle parentId 0 as null for consistency
  if (normalized.parentId === 0) {
    normalized.parentId = null
  }

  if (Array.isArray(cat.children)) {
    normalized.children = cat.children.map(normalizeCategory)
  }

  return normalized
}

/**
 * Normalizes an array of categories.
 */
export function normalizeCategories(categories: any[]): NormalizedCategory[] {
  if (!Array.isArray(categories)) return []
  return categories.map(normalizeCategory)
}
