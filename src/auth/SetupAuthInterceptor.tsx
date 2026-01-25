import { useEffect } from 'react'
import { useOptionalAuth, type OptionalAuthState } from '@/auth/useOptionalAuth'
import api from '@/api/client'

const ENABLE_AUTH_DEBUG = import.meta.env.DEV

// Use a module-level variable to store the latest auth state
// This allows the interceptor to be registered once and always have access to the latest state
let latestAuth: OptionalAuthState | null = null

// Register the interceptor once at module level
api.interceptors.request.use(async (config) => {
  if (latestAuth?.isAuthenticated && !latestAuth?.isLoading) {
    try {
      const audience = import.meta.env.VITE_AUTH0_AUDIENCE
      const token = await latestAuth.getAccessTokenSilently({
        authorizationParams: {
          ...(audience && { audience }),
        },
      })
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        if (ENABLE_AUTH_DEBUG) {
          console.debug(`[Auth0] Authorization header attached for: ${config.method?.toUpperCase()} ${config.url}`)
        }
      }
    } catch (error) {
      if (ENABLE_AUTH_DEBUG) {
        console.warn('[Auth0] Failed to attach token:', error)
      }
    }
  }
  return config
})

export function useSetupAuthInterceptor() {
  const auth = useOptionalAuth()
  
  // Update synchronously during render so children can use it immediately
  // eslint-disable-next-line react-hooks/globals
  latestAuth = auth

  // Also update on every state change
  useEffect(() => {
    latestAuth = auth
  }, [auth])
}
