import { MapPin } from 'lucide-react'
import type { Service } from '@/types/Service'
import StarRating from './StarRating'

interface ServiceCardProps {
  service: Service
  providerName?: string
  distance?: number
  rating?: number | null
}

export default function ServiceCard({ service, providerName, distance, rating = null }: ServiceCardProps) {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-border">
      <div className="p-5 flex flex-col gap-2">
        <div>
          <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-0.5">
            {service.title}
          </h3>
          {providerName && (
            <p className="text-sm font-medium text-primary">{providerName}</p>
          )}
        </div>

        <div className="min-h-[24px] flex items-center">
          <StarRating rating={rating} />
        </div>

        {distance !== undefined && distance >= 0 && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">
              {distance.toFixed(1)} km
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
