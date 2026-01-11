import { MapContainer, TileLayer } from 'react-leaflet'
import UserLocation from '@/components/UserLocation'
import 'leaflet/dist/leaflet.css'

export default function MapPage() {
  const defaultPosition: [number, number] = [52.412, 11.779]

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Karte</h1>

      <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
        <div style={{ height: '600px', width: '100%' }}>
          <MapContainer center={defaultPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <UserLocation />
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
