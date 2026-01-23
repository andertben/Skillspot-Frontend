import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { getServices } from '@/api/services'
import { getCategories } from '@/api/categories'
import { getProviders } from '@/api/providers'
import { getReviews, calculateAverageRating, getServiceReviews } from '@/api/reviews'
import { getRoute } from '@/api/routing'
import type { RouteData } from '@/api/routing'
import { useUserLocation } from '@/hooks/useUserLocation'
import { calculateHaversineDistance } from '@/helpers/distance'
import type { Service } from '@/types/Service'
import type { Category } from '@/types/Category'
import type { Provider } from '@/types/Provider'
import type { Review } from '@/types/Review'
import ServiceCard from '@/components/ServiceCard'
import { ChevronRight, Home, Navigation } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

import { userIcon, providerIcon, selectedIcon } from '@/helpers/leafletIcons'

// Component to handle map view updates
function MapController({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom())
    }
  }, [center, zoom, map])
  return null
}

export default function ServicesByCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const { t } = useTranslation()
  const { location: userLocation } = useUserLocation()
  
  const [services, setServices] = useState<Service[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [providers, setProviders] = useState<Provider[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null)
  const [expandedServiceId, setExpandedServiceId] = useState<number | null>(null)
  const [routeData, setRouteData] = useState<RouteData | null>(null)
  const [roadDistances, setRoadDistances] = useState<Record<number, number>>({})
  
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({})

  const defaultCenter: [number, number] = [52.41, 12.55] // Brandenburg/Potsdam area

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return
      setLoading(true)
      setError(null)
      try {
        const [allServices, allCategories, allProviders, allReviews] = await Promise.all([
          getServices(),
          getCategories(),
          getProviders(),
          getReviews()
        ])
        const catId = Number(categoryId)
        const filteredServices = allServices.filter(s => s.kategorieId === catId)
        const currentCategory = allCategories.find(c => c.kategorie_id === catId) || null
        setServices(filteredServices)
        setCategory(currentCategory)
        setProviders(allProviders)
        setReviews(allReviews)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.error'))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [categoryId, t])

  const providersById = useMemo(() => {
    const map: Record<number, Provider> = {}
    providers.forEach(p => {
      map[p.anbieterId] = p
    })
    return map
  }, [providers])

  const visibleProviders = useMemo(() => {
    const uniqueIds = Array.from(new Set(services.map(s => s.anbieterId)))
    return uniqueIds
      .map(id => providersById[id])
      .filter(p => p && p.locationLat && p.locationLon)
  }, [services, providersById])

  useEffect(() => {
    const fetchRoadDistances = async () => {
      if (!userLocation || visibleProviders.length === 0) return
      
      const distances: Record<number, number> = {}
      
      // Fetch road distances for all visible providers in parallel
      await Promise.all(
        visibleProviders.map(async (provider) => {
          // Skip if already have distance
          if (roadDistances[provider.anbieterId] !== undefined) return

          if (provider.locationLat && provider.locationLon) {
            const route = await getRoute(userLocation, {
              lat: provider.locationLat,
              lon: provider.locationLon
            })
            if (route) {
              distances[provider.anbieterId] = route.distance / 1000
            }
          }
        })
      )
      
      if (Object.keys(distances).length > 0) {
        setRoadDistances(prev => ({ ...prev, ...distances }))
      }
    }
    
    fetchRoadDistances()
  }, [userLocation, visibleProviders, roadDistances])

  const getServiceRating = (serviceId: number): number | null => {
    // ONLY use service-specific reviews
    const serviceReviews = getServiceReviews(reviews, serviceId)
    const rating = calculateAverageRating(serviceReviews)
    
    if (import.meta.env.DEV) {
      console.log(`[DEV] Service ID: ${serviceId}, Review Count: ${serviceReviews.length}, Rating: ${rating}`)
    }
    
    return rating
  }

  const handleSelectProvider = async (providerId: number, source: 'card' | 'marker', serviceId?: number) => {
    setSelectedProviderId(providerId)
    setRouteData(null)

    // Handle expansion logic
    if (source === 'card' && serviceId) {
      setExpandedServiceId(prev => prev === serviceId ? null : serviceId)
    }

    const provider = providersById[providerId]
    if (!provider) return

    // Scroll to card and expand if selected from marker
    if (source === 'marker') {
      const firstService = services.find(s => s.anbieterId === providerId)
      if (firstService) {
        setExpandedServiceId(firstService.dienstleistungId)
        if (cardRefs.current[firstService.dienstleistungId]) {
          cardRefs.current[firstService.dienstleistungId]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }
      }
    }

    // Calculate route if user location is available
    if (userLocation && provider.locationLat && provider.locationLon) {
      const route = await getRoute(
        userLocation,
        { lat: provider.locationLat, lon: provider.locationLon }
      )
      setRouteData(route)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12 text-center">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 pt-8 pb-4 flex-shrink-0">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            {t('menu.home')}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/services" className="hover:text-primary transition-colors">
            {t('menu.services')}
          </Link>
          {category && (
            <>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">{category.bezeichnung}</span>
            </>
          )}
        </nav>
        <h1 className="text-3xl font-bold mb-2">
          {category ? `${category.bezeichnung}` : t('pages.services.title')}
        </h1>
      </div>

      <div className="container mx-auto max-w-7xl px-4 flex-1 flex flex-col md:flex-row gap-6 mb-8 overflow-hidden">
        {/* Left column: List */}
        <div className="w-full md:w-1/2 overflow-y-auto custom-scrollbar px-2">
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-8">
              {error}
            </div>
          )}

          {services.length === 0 ? (
            <div className="text-center py-12 border rounded-xl bg-accent/10">
              <p className="text-lg text-muted-foreground">{t('pages.services.noServicesFound')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 py-2">
              {services.map((service) => {
                const isSelected = selectedProviderId === service.anbieterId
                const isExpanded = expandedServiceId === service.dienstleistungId
                const provider = providersById[service.anbieterId]
                
                // Prioritize route distance if selected, otherwise use roadDistance, then Haversine as fallback
                let displayDistance: number | undefined = undefined
                
                if (isSelected && routeData) {
                  displayDistance = routeData.distance / 1000
                } else if (roadDistances[service.anbieterId] !== undefined) {
                  displayDistance = roadDistances[service.anbieterId]
                } else if (userLocation && provider?.locationLat && provider?.locationLon) {
                  displayDistance = calculateHaversineDistance(
                    userLocation.lat,
                    userLocation.lon,
                    provider.locationLat,
                    provider.locationLon
                  )
                }
                
                const rating = getServiceRating(service.dienstleistungId)
                const serviceReviews = getServiceReviews(reviews, service.dienstleistungId)

                return (
                  <div 
                    key={service.dienstleistungId}
                    ref={(el) => {
                      cardRefs.current[service.dienstleistungId] = el
                    }}
                    onClick={() => handleSelectProvider(service.anbieterId, 'card', service.dienstleistungId)}
                    className={`cursor-pointer transition-all duration-300 rounded-2xl ${
                      isSelected ? 'ring-2 ring-primary shadow-xl scale-[1.01]' : ''
                    }`}
                  >
                    <ServiceCard 
                      service={service}
                      providerName={provider?.firmenName}
                      distance={displayDistance}
                      rating={rating}
                      isExpanded={isExpanded}
                      reviews={serviceReviews}
                    />
                    {isSelected && !routeData && (
                       <div className="px-5 pb-4">
                         <p className="text-xs text-muted-foreground italic">{t('map.routeNotCalculated')}</p>
                       </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right column: Map */}
        <div className="hidden md:block w-1/2 relative h-[600px] rounded-2xl overflow-hidden border border-border">
          <MapContainer 
            center={userLocation ? [userLocation.lat, userLocation.lon] : defaultCenter} 
            zoom={13} 
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
                <Popup>{t('map.youAreHere')}</Popup>
              </Marker>
            )}

            {visibleProviders.map(provider => (
              <Marker 
                key={provider.anbieterId}
                position={[provider.locationLat!, provider.locationLon!]}
                icon={selectedProviderId === provider.anbieterId ? selectedIcon : providerIcon}
                eventHandlers={{
                  click: () => handleSelectProvider(provider.anbieterId, 'marker')
                }}
              >
                <Popup>{provider.firmenName}</Popup>
              </Marker>
            ))}

            {routeData && userLocation && selectedProviderId && providersById[selectedProviderId] && (
               <>
                 <Polyline 
                   positions={routeData.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]])}
                   color="blue"
                   weight={5}
                   opacity={0.7}
                 />
                 {/* Optional: Label on route center */}
                 {routeData.geometry.coordinates.length > 0 && (
                   <Popup position={[
                     routeData.geometry.coordinates[Math.floor(routeData.geometry.coordinates.length / 2)][1],
                     routeData.geometry.coordinates[Math.floor(routeData.geometry.coordinates.length / 2)][0]
                   ]}>
                     <div className="flex items-center gap-1 font-bold">
                       <Navigation className="w-3 h-3" />
                       {(routeData.distance / 1000).toFixed(1)} km
                     </div>
                   </Popup>
                 )}
               </>
            )}

            {selectedProviderId && providersById[selectedProviderId] && (
              <MapController 
                center={[providersById[selectedProviderId].locationLat!, providersById[selectedProviderId].locationLon!]} 
              />
            )}
            {!selectedProviderId && userLocation && (
              <MapController center={[userLocation.lat, userLocation.lon]} />
            )}

            <div className="absolute top-4 right-4 z-[1000]">
              <button 
                onClick={() => {
                  if (userLocation) {
                    setSelectedProviderId(null)
                    setRouteData(null)
                  }
                }}
                className="bg-white px-3 py-2 rounded-md shadow-md hover:bg-accent transition-colors text-sm font-medium"
              >
                {t('map.center')}
              </button>
            </div>
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
