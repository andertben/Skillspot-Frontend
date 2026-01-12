import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useMap } from 'react-leaflet'
import { Marker, Popup } from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import L from 'leaflet'
import iconUrl from '@/assets/leaflet/marker-icon-red.svg'
import iconRetinaUrl from '@/assets/leaflet/marker-icon-2x-red.svg'
import shadowUrl from '@/assets/leaflet/marker-shadow.svg'

const redIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export function UserLocation() {
  const map = useMap()
  const { t } = useTranslation()
  const [position, setPosition] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('Geolocation wird von diesem Browser nicht unterstützt')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const userPosition: [number, number] = [latitude, longitude]
        setPosition(userPosition)
        map.setView(userPosition, 13)
      },
      (error) => {
        console.warn('Geolocation fehlgeschlagen:', error.message)
      }
    )
  }, [map])

  if (!position) return null

  return (
    <Marker position={position} icon={redIcon}>
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
