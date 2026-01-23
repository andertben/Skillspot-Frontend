import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useMap } from 'react-leaflet'
import { Marker, Popup } from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import { useUserLocation } from '@/hooks/useUserLocation'
import { userIcon } from '@/helpers/leafletIcons'

export function UserLocation() {
  const map = useMap()
  const { t } = useTranslation()
  const { location, error } = useUserLocation()
  
  const position: [number, number] | null = useMemo(() => 
    location ? [location.lat, location.lon] : null,
  [location])

  useEffect(() => {
    if (position) {
      map.setView(position, 13)
    }
  }, [position, map])

  useEffect(() => {
    if (error) {
      console.warn('Geolocation fehlgeschlagen:', error)
    }
  }, [error])

  if (!position) return null

  return (
    <Marker position={position} icon={userIcon}>
      <Popup>{t('map.youAreHere')}</Popup>
    </Marker>
  )
}

export function RecenterButton() {
  const map = useMap()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const handleRecenter = () => {
    if (!navigator.geolocation) {
      console.warn('Geolocation wird von diesem Browser nicht unterstützt')
      return
    }

    setLoading(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        map.setView([latitude, longitude], 15)
        setLoading(false)
      },
      (error) => {
        console.warn('Geolocation fehlgeschlagen:', error.message)
        setLoading(false)
      }
    )
  }

  const mapContainer = map.getContainer()

  const buttonElement = (
    <div className="absolute top-3 right-3 z-[1000]">
      <button
        onClick={handleRecenter}
        disabled={loading}
        className="bg-white text-black border border-gray-300 shadow hover:bg-gray-100 px-3 py-2 rounded-md disabled:opacity-50 pointer-events-auto"
      >
        {loading ? t('map.locating') : t('map.center')}
      </button>
    </div>
  )

  return mapContainer ? createPortal(buttonElement, mapContainer) : null
}
