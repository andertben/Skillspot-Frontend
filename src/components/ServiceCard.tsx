import { MapPin } from 'lucide-react'
import type { Service } from '@/types/Service'

interface ServiceCardProps {
  service: Service
  providerName?: string
  distance?: number
}

export default function ServiceCard({ service, providerName, distance }: ServiceCardProps) {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="w-full h-48 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center text-foreground">
        <span className="text-lg font-medium">Kein Bild</span>
      </div>

      <div className="p-5 flex flex-col gap-3">
        <div>
          <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-1">
            {service.title}
          </h3>
          {providerName && (
            <p className="text-sm text-muted-foreground">{providerName}</p>
          )}
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">
            {distance !== undefined && distance >= 0
              ? `${distance.toFixed(1)} km`
              : 'Entfernung unbekannt'}
          </span>
        </div>
      </div>
    </div>
  )
}
