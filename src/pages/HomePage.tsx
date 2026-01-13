import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCategories, getTopLevelCategories } from '@/api/categories'
import type { Category } from '@/types/Category'

export default function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
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
  }, [t])

  const topCategories = getTopLevelCategories(categories)

  const handleCategoryClick = (topId: number) => {
    navigate(`/services?top=${topId}`)
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{t('pages.home.title')}</h1>
      <p className="text-lg text-muted-foreground mb-12">{t('pages.home.description')}</p>

      {loading && <p className="text-muted-foreground">{t('common.loading')}</p>}

      {error && <p className="text-destructive">{error}</p>}

      {!loading && !error && topCategories.length === 0 && (
        <p className="text-muted-foreground">{t('pages.home.noCategories')}</p>
      )}

      {!loading && !error && topCategories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topCategories.map((category) => (
            <button
              key={category.kategorie_id}
              onClick={() => handleCategoryClick(category.kategorie_id)}
              className="p-6 border rounded-lg hover:shadow-lg transition-shadow hover:bg-accent text-left"
              style={{ borderColor: 'hsl(var(--border))' }}
            >
              <h2 className="text-2xl font-semibold">{category.bezeichnung}</h2>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
