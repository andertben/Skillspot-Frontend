import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer } from 'react-leaflet'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import UserLocation from '@/components/UserLocation'
import 'leaflet/dist/leaflet.css'

interface Service {
  id: number
  name: string
  description: string
  price: number
}

const servicesData: Service[] = []

export default function ServicesPage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const defaultPosition = [52.412, 11.779] as [number, number]

  const filteredServices = useMemo(() => {
    return servicesData.filter((service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{t('pages.services.title')}</h1>

      <div className="mb-6">
        <Input
          type="text"
          placeholder={t('pages.services.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('pages.services.table.name')}</TableHead>
              <TableHead>{t('pages.services.table.description')}</TableHead>
              <TableHead>{t('pages.services.table.price')}</TableHead>
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
        <p className="text-center text-muted-foreground mb-8">{t('pages.services.noResults')}</p>
      )}

      <h2 className="text-2xl font-bold mb-4">{t('pages.services.locations')}</h2>
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
