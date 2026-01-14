import { useAuth0 } from '@auth0/auth0-react'

interface OptionalAuthState {
  isLoading: boolean
  isAuthenticated: boolean
  user: { name?: string; email?: string; sub?: string } | undefined
  loginWithPopup: (options?: Record<string, unknown>) => Promise<void>
  logout: (options?: Record<string, unknown>) => void
  getAccessTokenSilently: (options?: Record<string, unknown>) => Promise<string | null>
  isAuthAvailable: boolean
}

const AUTH_AVAILABLE = !!(
  import.meta.env.VITE_AUTH0_DOMAIN &&
  import.meta.env.VITE_AUTH0_CLIENT_ID
)

const ENABLE_AUTH_DEBUG = import.meta.env.DEV

export function useOptionalAuth(): OptionalAuthState {
  const auth0Context = useAuth0()

  if (!AUTH_AVAILABLE) {
    return {
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
      loginWithPopup: async () => {
        console.warn(
          '[Auth0] Not configured. Set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in .env.local'
        )
      },
      logout: () => {
        if (ENABLE_AUTH_DEBUG) {
          console.warn('[Auth0] Logout called but Auth0 not configured')
        }
      },
      getAccessTokenSilently: async () => {
        if (ENABLE_AUTH_DEBUG) {
          console.warn('[Auth0] getAccessTokenSilently called but Auth0 not configured')
        }
        return null
      },
      isAuthAvailable: false,
    }
  }

  return {
    isLoading: auth0Context.isLoading,
    isAuthenticated: auth0Context.isAuthenticated,
    user: auth0Context.user,
    loginWithPopup: async (options?: Record<string, unknown>) => {
      const audience = import.meta.env.VITE_AUTH0_AUDIENCE
      const authParams = (options?.authorizationParams as Record<string, unknown>) || {}

      if (ENABLE_AUTH_DEBUG) {
        console.debug('[Auth0] Initiating loginWithPopup', {
          domain: import.meta.env.VITE_AUTH0_DOMAIN,
          clientId: import.meta.env.VITE_AUTH0_CLIENT_ID?.substring(0, 10) + '***',
          audience: audience || 'none',
        })
      }

      await auth0Context.loginWithPopup({
        ...options,
        authorizationParams: {
          scope: 'openid profile email',
          ...(audience && { audience }),
          ...authParams,
        },
      })
    },
    logout: auth0Context.logout,
    getAccessTokenSilently: async (options?: Record<string, unknown>) => {
      try {
        const token = await auth0Context.getAccessTokenSilently(options)
        return token
      } catch (error) {
        if (ENABLE_AUTH_DEBUG) {
          console.warn('[Auth0] Failed to get access token:', error instanceof Error ? error.message : error)
        }
        return null
      }
    },
    isAuthAvailable: true,
  }
}
