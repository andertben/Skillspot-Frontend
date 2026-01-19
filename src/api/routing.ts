export interface RouteData {
  geometry: {
    type: string
    coordinates: [number, number][]
  }
  distance: number // meters
  duration: number // seconds
}

/**
 * Fetches routing data from OSRM public demo instance.
 * lon/lat format as required by OSRM.
 */
export async function getRoute(
  start: { lat: number; lon: number },
  end: { lat: number; lon: number }
): Promise<RouteData | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('OSRM request failed')
    }
    
    const data = await response.json()
    
    if (!data.routes || data.routes.length === 0) {
      return null
    }
    
    return {
      geometry: data.routes[0].geometry,
      distance: data.routes[0].distance,
      duration: data.routes[0].duration,
    }
  } catch (error) {
    console.error('[ROUTING] Failed to fetch route:', error)
    return null
  }
}
