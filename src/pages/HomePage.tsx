import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCategories, getTopLevelCategories, getSubCategories } from '@/api/categories'
import type { NormalizedCategory } from '@/types/Category'
import { ChevronRight } from 'lucide-react'
import { WeatherWidget } from '@/components/WeatherWidget'

const CATEGORY_COLORS = [
  { bg: 'bg-gradient-to-br from-blue-400 to-blue-600', light: 'from-blue-50 to-blue-100' },
  { bg: 'bg-gradient-to-br from-purple-400 to-purple-600', light: 'from-purple-50 to-purple-100' },
  { bg: 'bg-gradient-to-br from-pink-400 to-pink-600', light: 'from-pink-50 to-pink-100' },
  { bg: 'bg-gradient-to-br from-green-400 to-green-600', light: 'from-green-50 to-green-100' },
  { bg: 'bg-gradient-to-br from-orange-400 to-orange-600', light: 'from-orange-50 to-orange-100' },
  { bg: 'bg-gradient-to-br from-indigo-400 to-indigo-600', light: 'from-indigo-50 to-indigo-100' },
]

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<NormalizedCategory[]>([])
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
  }, [t, i18n.language])

  const topCategories = getTopLevelCategories(categories)

  const getSubcategoryCount = (topId: number): number => {
    return getSubCategories(categories, topId).length
  }

  const getColorForCategory = (index: number) => {
    return CATEGORY_COLORS[index % CATEGORY_COLORS.length]
  }

  const handleCategoryClick = (topId: number) => {
    navigate(`/services?top=${topId}`)
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-start">
        <div className="py-2">
          <h1 className="text-4xl font-bold mb-4">{t('pages.home.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('pages.home.description')}</p>
        </div>
        <div>
          <WeatherWidget />
        </div>
      </div>

      {loading && <p className="text-muted-foreground">{t('common.loading')}</p>}

      {error && <p className="text-destructive">{error}</p>}

      {!loading && !error && topCategories.length === 0 && (
        <div className="text-center py-12 bg-muted/10 rounded-xl border border-dashed">
          <p className="text-muted-foreground">{t('pages.home.noCategories')}</p>
        </div>
      )}

      {!loading && !error && topCategories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topCategories.map((category, index) => {
            const colors = getColorForCategory(index)
            const subcategoryCount = getSubcategoryCount(category.id)
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="rounded-xl overflow-hidden border hover:shadow-lg transition-shadow flex flex-col cursor-pointer"
                style={{ borderColor: 'hsl(var(--border))' }}
              >
                <div
                  className={`bg-gradient-to-br ${colors.light} p-8 min-h-64 flex flex-col justify-between`}
                >
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {category.name}
                    </h2>
                    <p className="text-gray-600">
                      {subcategoryCount} {t('pages.home.services')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-sm font-semibold">{t('pages.home.explore')}</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
