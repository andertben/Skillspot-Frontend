import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import SubCategoryCard from '@/components/SubCategoryCard'
import { getCategories } from '@/api/categories'
import { getServices, getServicesByCategory } from '@/api/services'
import { getProviders, getProviderById } from '@/api/providers'
import { calculateHaversineDistance, calculateMinDistanceForCategory } from '@/helpers/distance'
import type { Category } from '@/types/Category'
import type { Service } from '@/types/Service'
import type { Provider } from '@/types/Provider'

interface ServiceWithDistance extends Service {
  distance?: number
  providerName?: string
}

function isMainCategory(category: Category): boolean {
  return category.oberkategorie_id === 0
}

export default function ServicesPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const topId = parseInt(searchParams.get('top') || '0')

  const [categories, setCategories] = useState<Category[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchInput, setSearchInput] = useState('')
  const [maxDistanceKm, setMaxDistanceKm] = useState<number | null>(null)
  const [subId, setSubId] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [categoriesData, servicesData, providersData] = await Promise.all([
          getCategories(),
          getServices(),
          getProviders(),
        ])

        setCategories(categoriesData)
        setServices(servicesData)
        setProviders(providersData)

        if (import.meta.env.DEV) {
          console.log('[BACKEND] Loaded data:')
          console.log(`  - ${categoriesData.length} categories`)
          console.log(`  - ${servicesData.length} services`)
          console.log(`  - ${providersData.length} providers`)
        }

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserPosition([position.coords.latitude, position.coords.longitude])
            },
            () => {
              console.warn('Geolocation access denied')
            }
          )
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.error'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [t])

  const displayedCategories =
    topId === 0
      ? categories.filter(isMainCategory)
      : categories.filter((c) => c.oberkategorie_id === topId)

  const displayedCategoryIds = displayedCategories.map((c) => c.kategorie_id)

  const servicesInCategory = useMemo(() => {
    if (!subId && displayedCategoryIds.length === 0) {
      return []
    }

    if (subId) {
      return getServicesByCategory(services, subId)
    }

    return services.filter((s) => displayedCategoryIds.includes(s.kategorie_id))
  }, [services, subId, displayedCategoryIds])

  const servicesWithMetadata: ServiceWithDistance[] = useMemo(() => {
    return servicesInCategory.map((service) => {
      const provider = getProviderById(providers, service.anbieter_id)
      let distance: number | undefined

      if (userPosition && provider) {
        distance = calculateHaversineDistance(
          userPosition[0],
          userPosition[1],
          provider.location_lat,
          provider.location_lon
        )
      }

      return {
        ...service,
        distance,
        providerName: provider?.firmen_name,
      }
    })
  }, [servicesInCategory, providers, userPosition])

  const filteredServices: ServiceWithDistance[] = useMemo(() => {
    return servicesWithMetadata.filter((service) => {
      const searchLower = searchInput.toLowerCase().trim()

      if (searchLower === '') {
        const matchesDistance =
          !maxDistanceKm || service.distance === undefined || service.distance <= maxDistanceKm
        return matchesDistance
      }

      const matchesSearch =
        service.title.toLowerCase().startsWith(searchLower) ||
        service.beschreibung.toLowerCase().startsWith(searchLower) ||
        service.providerName?.toLowerCase().startsWith(searchLower) ||
        categories.find((c) => c.kategorie_id === service.kategorie_id)?.bezeichnung.toLowerCase().startsWith(searchLower)

      const matchesDistance =
        !maxDistanceKm || service.distance === undefined || service.distance <= maxDistanceKm

      return matchesSearch && matchesDistance
    })
  }, [servicesWithMetadata, searchInput, maxDistanceKm, categories])

  const categoryTitle = categories.find((c) => c.kategorie_id === topId)?.bezeichnung

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{categoryTitle || t('pages.services.title')}</h1>

      {loading && <p className="text-muted-foreground">{t('common.loading')}</p>}

      {error && <p className="text-destructive">{error}</p>}

      {!loading && !error && (
        <>
          <div className="mb-12 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder={t('pages.services.searchPlaceholder')}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pr-10"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {userPosition && (
              <div className="flex items-center gap-2 md:w-40">
                <label className="text-sm font-medium whitespace-nowrap">
                  {t('pages.services.maxDistance')}:
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  placeholder="km"
                  value={maxDistanceKm || ''}
                  onChange={(e) => setMaxDistanceKm(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-24 px-2 py-2 border rounded"
                  style={{ borderColor: 'hsl(var(--border))' }}
                />
              </div>
            )}
          </div>

          {displayedCategories.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">
                {topId === 0 ? t('pages.services.title') : t('pages.services.subcategories')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedCategories.map((category) => {
                  const distance = userPosition
                    ? calculateMinDistanceForCategory(category.kategorie_id, userPosition, services, providers)
                    : undefined

                  return (
                    <button
                      key={category.kategorie_id}
                      onClick={() => {
                        if (topId === 0) {
                          window.location.href = `/services?top=${category.kategorie_id}`
                        } else {
                          setSubId(category.kategorie_id)
                        }
                      }}
                      className="text-left"
                    >
                      <SubCategoryCard category={category} distance={distance} />
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              {searchInput && searchInput.trim() !== '' ? (
                <p className="text-muted-foreground">
                  {t('pages.services.noSearchResults', { query: searchInput })}
                </p>
              ) : (
                <p className="text-muted-foreground">{t('pages.services.noResults')}</p>
              )}
            </div>
          )}

          {filteredServices.length > 0 && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {t('pages.services.hits', { count: filteredServices.length })}
                </p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('pages.services.table.name')}</TableHead>
                      <TableHead>{t('pages.services.table.description')}</TableHead>
                      <TableHead>{t('pages.services.table.price')}</TableHead>
                      <TableHead>{t('pages.services.table.provider')}</TableHead>
                      {userPosition && <TableHead>{t('pages.services.table.distance')}</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow key={service.dienstleistung_id}>
                        <TableCell className="font-medium">{service.title}</TableCell>
                        <TableCell>{service.beschreibung}</TableCell>
                        <TableCell>{service.preis.toFixed(2)} €</TableCell>
                        <TableCell>{service.providerName}</TableCell>
                        {userPosition && (
                          <TableCell>
                            {service.distance ? `${service.distance.toFixed(1)} km` : '-'}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
