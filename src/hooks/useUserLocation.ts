import { useState, useEffect } from 'react'

export interface UserLocation {
  lat: number
  lon: number
}

interface UseUserLocationReturn {
  location: UserLocation | null
  loading: boolean
  error: string | null
}

export function useUserLocation(): UseUserLocationReturn {
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [error, setError] = useState<string | null>(
    typeof navigator !== 'undefined' && !navigator.geolocation 
      ? 'Geolocation wird von diesem Browser nicht unterstützt' 
      : null
  )
  const [loading, setLoading] = useState<boolean>(!error)

  useEffect(() => {
    if (error || !navigator.geolocation) {
      return
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      })
      setLoading(false)
      setError(null)
    }

    const handleError = (error: GeolocationPositionError) => {
      setError(error.message)
      setLoading(false)
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError)
  }, [error])

  return { location, loading, error }
}
