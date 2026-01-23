import L from 'leaflet'
import iconBlue from '@/assets/leaflet/marker-icon-blue.svg'
import iconRetinaBlue from '@/assets/leaflet/marker-icon-2x-blue.svg'
import iconRed from '@/assets/leaflet/marker-icon-red.svg'
import iconRetinaRed from '@/assets/leaflet/marker-icon-2x-red.svg'
import shadowUrl from '@/assets/leaflet/marker-shadow.svg'

export const userIcon = L.icon({
  iconUrl: iconRed,
  iconRetinaUrl: iconRetinaRed,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export const providerIcon = L.icon({
  iconUrl: iconBlue,
  iconRetinaUrl: iconRetinaBlue,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export const selectedIcon = L.icon({
  iconUrl: iconBlue,
  iconRetinaUrl: iconRetinaBlue,
  shadowUrl,
  iconSize: [30, 46],
  iconAnchor: [15, 46],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'hue-rotate-[120deg]', // Greenish
})
