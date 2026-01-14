import { useEffect } from 'react'
import { useOptionalAuth } from '@/auth/useOptionalAuth'
import api from '@/api/client'

const ENABLE_AUTH_DEBUG = import.meta.env.DEV

export function SetupAuthInterceptor() {
  const auth = useOptionalAuth()

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(async (config) => {
      if (auth.isAuthAvailable && auth.isAuthenticated) {
        try {
          const audience = import.meta.env.VITE_AUTH0_AUDIENCE
          const token = await auth.getAccessTokenSilently({
            authorizationParams: {
              ...(audience && { audience }),
            },
          })
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
            if (ENABLE_AUTH_DEBUG) {
              console.debug('[Auth0] Token attached to request', {
                tokenLength: token.length,
                audience: audience || 'none',
              })
            }
          }
        } catch (error) {
          if (ENABLE_AUTH_DEBUG) {
            console.warn('[Auth0] Failed to attach token:', error instanceof Error ? error.message : error)
          }
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
