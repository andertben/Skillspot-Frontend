import { useState, useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { getProviders } from '@/api/providers'
import { getReviews, calculateAverageRating, getProviderReviews } from '@/api/reviews'
import type { Provider } from '@/types/Provider'
import type { Review } from '@/types/Review'
import StarRating from './StarRating'
import shadowUrl from '@/assets/leaflet/marker-shadow.svg'

const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export function ProviderMarkers() {
  useMap()
  const [providers, setProviders] = useState<Provider[]>([])
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [providersData, reviewsData] = await Promise.all([
          getProviders(),
          getReviews()
        ])
        setProviders(providersData)
        setReviews(reviewsData)
        if (import.meta.env.DEV) {
          console.log(`[MAP] Loaded ${providersData.length} providers and ${reviewsData.length} reviews`)
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
            position={[provider.locationLat, provider.locationLon]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="flex flex-col gap-1 p-1">
                <div className="font-bold text-sm leading-tight">{provider.firmenName}</div>
                <div className="flex items-center">
                  <StarRating rating={rating} />
                </div>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </>
  )
}
