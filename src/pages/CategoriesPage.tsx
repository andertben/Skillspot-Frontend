import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getCategories } from '@/api/categories'
import type { Category } from '@/types/Category'
import { useOptionalAuth } from '@/auth/useOptionalAuth'

export default function CategoriesPage() {
  const { t } = useTranslation()
  const auth = useOptionalAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      if (auth.isLoading) return

      try {
        setLoading(true)
        setError(null)
        const data = await getCategories()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.error'))
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [t, auth.isLoading])

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{t('pages.categories.title')}</h1>

      {loading && <p className="text-muted-foreground">{t('pages.categories.loading')}</p>}

      {error && <p className="text-destructive">{error}</p>}

      {!loading && !error && categories.length === 0 && (
        <p className="text-muted-foreground">{t('pages.categories.noResults')}</p>
      )}

      {!loading && !error && categories.length > 0 && (
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.kategorie_id} className="p-4 border rounded-lg" style={{ borderColor: 'hsl(var(--border))' }}>
              <div>
                <h2 className="text-xl font-semibold">{category.bezeichnung}</h2>
                <p className="text-sm text-muted-foreground">{t('pages.categories.id')}: {category.kategorie_id}</p>
                {category.oberkategorie_id !== null && category.oberkategorie_id > 0 && (
                  <p className="text-sm text-muted-foreground">{t('pages.categories.parentCategory')}: {category.oberkategorie_id}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
