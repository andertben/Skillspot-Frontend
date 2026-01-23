import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer } from 'react-leaflet'
import { UserLocation, RecenterButton } from '@/components/UserLocation'
import { ProviderMarkers } from '@/components/ProviderMarkers'
import 'leaflet/dist/leaflet.css'

export default function MapPage() {
  const { t } = useTranslation()
  const defaultPosition = [52.412, 11.779] as [number, number]

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{t('pages.map.title')}</h1>

      <div className="rounded-lg border overflow-hidden relative" style={{ borderColor: 'hsl(var(--border))', height: '600px', width: '100%' }}>
        <MapContainer center={defaultPosition} zoom={13} style={{ height: '100%', width: '100%', position: 'relative' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <UserLocation />
          <ProviderMarkers simplePopup />
          <RecenterButton />
        </MapContainer>
      </div>
    </div>
  )
}
