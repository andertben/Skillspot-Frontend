import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Marker, Popup } from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import { getProviders } from '@/api/providers'
import { getReviews, calculateAverageRating, getProviderReviews } from '@/api/reviews'
import type { Provider } from '@/types/Provider'
import type { Review } from '@/types/Review'
import StarRating from './StarRating'
import { providerIcon } from '@/helpers/leafletIcons'
import { Button } from './ui/button'

interface ProviderMarkersProps {
  simplePopup?: boolean
}

export function ProviderMarkers({ simplePopup }: ProviderMarkersProps) {
  const { t } = useTranslation()
  const [providers, setProviders] = useState<Provider[]>([])
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [providersData, reviewsData] = await Promise.all([
          getProviders(),
          getReviews()
        ])
        // Only show providers with coordinates
        const validProviders = providersData.filter(p => p.locationLat && p.locationLon)
        setProviders(validProviders)
        setReviews(reviewsData)
        if (import.meta.env.DEV) {
          console.log(`[MAP] Loaded ${validProviders.length} providers with coordinates`)
        }
      } catch (err) {
        console.error('[MAP] Failed to load data:', err)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      {providers.map((provider) => {
        const providerReviews = getProviderReviews(reviews, provider.anbieterId)
        const rating = calculateAverageRating(providerReviews)

        return (
          <Marker
            key={provider.anbieterId}
            position={[provider.locationLat!, provider.locationLon!]}
            icon={providerIcon}
          >
            <Popup minWidth={simplePopup ? 100 : 200}>
              <div className="flex flex-col gap-2 p-1">
                <div className="font-bold text-base leading-tight">{provider.firmenName}</div>
                
                {!simplePopup && (
                  <>
                    <div className="flex items-center gap-2">
                      <StarRating rating={rating} />
                      <span className="text-xs text-muted-foreground">
                        ({providerReviews.length})
                      </span>
                    </div>
                    {provider.beschreibung && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {provider.beschreibung}
                      </p>
                    )}
                    <div className="pt-2">
                      <Link to={`/services`}>
                        <Button size="sm" className="w-full h-8 text-xs">
                          {t('pages.map.viewServices')}
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        )
      })}
    </>
  )
}
