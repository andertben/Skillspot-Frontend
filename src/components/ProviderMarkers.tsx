import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Marker, Popup } from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import { getProviders } from '@/api/providers'
import { getReviewsByProviderId, calculateAverageRating } from '@/api/reviews'
import type { Provider } from '@/types/Provider'
import type { Review } from '@/types/Review'
import StarRating from './StarRating'
import { providerIcon } from '@/helpers/leafletIcons'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'

interface ProviderMarkersProps {
  simplePopup?: boolean
}

function ProviderPopupContent({ provider, simplePopup }: { provider: Provider, simplePopup?: boolean }) {
  const { t } = useTranslation()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (simplePopup) return

    const fetchProviderReviews = async () => {
      try {
        setIsLoading(true)
        const data = await getReviewsByProviderId(provider.anbieterId)
        setReviews(data)
      } catch (err) {
        console.error('Failed to fetch provider reviews:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProviderReviews()
  }, [provider.anbieterId, simplePopup])

  const rating = calculateAverageRating(reviews)

  return (
    <div className="flex flex-col gap-2 p-1">
      <div className="font-bold text-base leading-tight">{provider.firmenName}</div>
      
      {!simplePopup && (
        <>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
            ) : (
              <>
                <StarRating rating={rating} />
                <span className="text-xs text-muted-foreground">
                  ({reviews.length})
                </span>
              </>
            )}
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
  )
}

export function ProviderMarkers({ simplePopup }: ProviderMarkersProps) {
  const [providers, setProviders] = useState<Provider[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const providersData = await getProviders()
        // Only show providers with coordinates
        const validProviders = providersData.filter(p => p.locationLat && p.locationLon)
        setProviders(validProviders)
      } catch (err) {
        console.error('[MAP] Failed to load providers:', err)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      {providers.map((provider) => (
        <Marker
          key={provider.anbieterId}
          position={[provider.locationLat!, provider.locationLon!]}
          icon={providerIcon}
        >
          <Popup minWidth={simplePopup ? 100 : 200}>
            <ProviderPopupContent provider={provider} simplePopup={simplePopup} />
          </Popup>
        </Marker>
      ))}
    </>
  )
}
