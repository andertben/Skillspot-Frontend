import { useAuth0 } from '@auth0/auth0-react'

export interface OptionalAuthState {
  isLoading: boolean
  isAuthenticated: boolean
  user: {
    name?: string
    email?: string
    sub?: string
    picture?: string
    email_verified?: boolean
    created_at?: string
    updated_at?: string
    [key: string]: unknown
  } | undefined
  loginWithPopup: (options?: Record<string, unknown>) => Promise<void>
  loginWithRedirect: (options?: Record<string, unknown>) => Promise<void>
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
      loginWithRedirect: async () => {
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

  // We must call the hook after checking AUTH_AVAILABLE to avoid crashing 
  // when Auth0Provider is not rendered. Since AUTH_AVAILABLE is a constant
  // derived from env vars, this doesn't violate the spirit of Rules of Hooks.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const auth0Context = useAuth0()

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
    loginWithRedirect: async (options?: Record<string, unknown>) => {
      const audience = import.meta.env.VITE_AUTH0_AUDIENCE
      const authParams = (options?.authorizationParams as Record<string, unknown>) || {}

      if (ENABLE_AUTH_DEBUG) {
        console.debug('[Auth0] Initiating loginWithRedirect', {
          domain: import.meta.env.VITE_AUTH0_DOMAIN,
          clientId: import.meta.env.VITE_AUTH0_CLIENT_ID?.substring(0, 10) + '***',
          audience: audience || 'none',
        })
      }

      await auth0Context.loginWithRedirect({
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
