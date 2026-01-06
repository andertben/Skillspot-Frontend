import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import 'leaflet/dist/leaflet.css'

interface Service {
  id: number
  name: string
  description: string
  price: number
}

const servicesData: Service[] = []

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const position = [52.412, 11.779] as [number, number]

  const filteredServices = useMemo(() => {
    return servicesData.filter((service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Dienstleistungen</h1>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Dienstleistung suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Beschreibung</TableHead>
              <TableHead>Preis (€)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>{service.price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredServices.length === 0 && (
        <p className="text-center text-muted-foreground mb-8">Keine Dienstleistungen gefunden.</p>
      )}

      <h2 className="text-2xl font-bold mb-4">Standorte</h2>
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'hsl(var(--border))' }}>
        <div style={{ height: '400px', width: '100%' }}>
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>Skillspot - Magdeburger Str. 50, 14770 Brandenburg an der Havel</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
