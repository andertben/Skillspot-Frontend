import type { Service } from '@/types/Service'
import type { Provider } from '@/types/Provider'

export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

export function calculateMinDistanceForCategory(
  categoryId: number,
  userPosition: [number, number],
  services: Service[],
  providers: Provider[]
): number | undefined {
  const servicesInCategory = services.filter((s) => s.kategorie_id === categoryId)

  if (servicesInCategory.length === 0) {
    return undefined
  }

  const distances = servicesInCategory
    .map((service) => {
      const provider = providers.find((p) => p.anbieter_id === service.anbieter_id)
      if (!provider) return Infinity

      return calculateHaversineDistance(
        userPosition[0],
        userPosition[1],
        provider.location_lat,
        provider.location_lon
      )
    })
    .filter((d) => d !== Infinity)

  if (distances.length === 0) {
    return undefined
  }

  return Math.min(...distances)
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}
