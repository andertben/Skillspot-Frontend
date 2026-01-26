import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCategories, getSubCategories } from '@/api/categories'
import type { NormalizedCategory } from '@/types/Category'
import { WeatherWidget } from '@/components/WeatherWidget'

const CATEGORY_COLORS = [
  'bg-blue-100',
  'bg-purple-100',
  'bg-pink-100',
  'bg-green-100',
  'bg-yellow-100',
  'bg-red-100',
  'bg-indigo-100',
  'bg-cyan-100',
]

export default function ServicesPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [subcategories, setSubcategories] = useState<NormalizedCategory[]>([])
  const [topCategory, setTopCategory] = useState<NormalizedCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [searchText, setSearchText] = useState('')

  const topCategoryId = searchParams.get('top') ? parseInt(searchParams.get('top')!) : null

  const isGardening = 
    topCategory?.name.toLowerCase() === 'gartenarbeiten' || 
    topCategory?.name.toLowerCase() === 'gardening'

  const filteredSubcategories = subcategories.filter((category) =>
    category.name.toLowerCase().startsWith(searchText.toLowerCase())
  )

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        const categories = await getCategories()

        const allSubcategories = categories.filter((c) => c.parentId && c.parentId !== 0)

        if (topCategoryId) {
          const filtered = getSubCategories(categories, topCategoryId)
          setSubcategories(filtered)
          
          const foundTop = categories.find(c => c.id === topCategoryId)
          setTopCategory(foundTop || null)

          if (import.meta.env.DEV) {
            console.log('categories total', categories.length)
            console.log('subcategories', filtered.length, '(filtered by topCategoryId:', topCategoryId, ')')
          }
        } else {
          setSubcategories(allSubcategories)
          setTopCategory(null)
          if (import.meta.env.DEV) {
            console.log('categories total', categories.length)
            console.log('subcategories', allSubcategories.length, '(all subcategories)')
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.error'))
        console.error('[SUBCATEGORIESPAGE] Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [topCategoryId, t, i18n.language, retryCount])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  const getColorForCategory = (kategorieId: number): string => {
    return CATEGORY_COLORS[kategorieId % CATEGORY_COLORS.length]
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 items-end">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('pages.services.title')}</h1>
            {topCategory && (
              <p className="text-lg text-muted-foreground">{topCategory.name}</p>
            )}
          </div>
          
          {!loading && !error && subcategories.length > 0 && (
            <div className="max-w-md">
              <input
                type="text"
                placeholder={t('pages.services.searchPlaceholder')}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                style={{ borderColor: 'hsl(var(--border))' }}
              />
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2">
          {isGardening && <WeatherWidget />}
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            {t('pages.services.retry')}
          </button>
        </div>
      )}

      {!loading && !error && subcategories.length > 0 && (
        <>
          {filteredSubcategories.length === 0 && (
            <p className="text-muted-foreground text-center py-12">{t('pages.services.noResults')}</p>
          )}

          {filteredSubcategories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSubcategories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => navigate(`/services/category/${category.id}`)}
                  className="rounded-lg border overflow-hidden hover:shadow-lg transition-shadow flex flex-col cursor-pointer"
                  style={{ borderColor: 'hsl(var(--border))' }}
                >
                  <div
                    className={`${getColorForCategory(category.id)} w-full h-40 flex items-center justify-center rounded-t-lg`}
                  >
                    <span className="text-4xl text-gray-700" aria-hidden="true">
                      {category.icon ?? '🚫'}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold mb-4 line-clamp-2">{category.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !error && subcategories.length === 0 && (
        <p className="text-muted-foreground text-center py-12">{t('pages.services.noResults')}</p>
      )}
    </div>
  )
}
