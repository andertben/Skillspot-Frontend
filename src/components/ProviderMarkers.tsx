import { useState, useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { getProviders } from '@/api/providers'
import type { Provider } from '@/types/Provider'
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

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await getProviders()
        setProviders(data)
        if (import.meta.env.DEV) {
          console.log(`[MAP] Loaded ${data.length} providers`)
        }
      } catch (err) {
        console.error('[MAP] Failed to load providers:', err)
      }
    }

    fetchProviders()
  }, [])

  return (
    <>
      {providers.map((provider) => (
        <Marker
          key={provider.anbieterId}
          position={[provider.locationLat, provider.locationLon]}
          icon={defaultIcon}
        >
          <Popup>
            <div className="font-semibold">{provider.firmenName}</div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}
