import { useEffect } from 'react'
import { useOptionalAuth } from '@/auth/useOptionalAuth'
import api from '@/api/client'

export function SetupAuthInterceptor() {
  const auth = useOptionalAuth()

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(async (config) => {
      if (auth.isAuthAvailable && auth.isAuthenticated) {
        try {
          const token = await auth.getAccessTokenSilently()
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        } catch {
          console.warn('Failed to attach Auth0 token to request')
        }
      }
      return config
    })

    return () => {
      api.interceptors.request.eject(requestInterceptor)
    }
  }, [auth])

  return null
}
