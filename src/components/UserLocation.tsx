import { useState, useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { Marker, Popup } from 'react-leaflet'
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

export default function UserLocation() {
  const map = useMap()
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
      <Popup>Du bist hier</Popup>
    </Marker>
  )
}
