import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useOptionalAuth } from '@/auth/useOptionalAuth'
import { useUserStore } from '@/hooks/useUserStore'

interface ProtectedRouteProps {
  children: ReactNode
}

const ENABLE_AUTH_DEBUG = import.meta.env.DEV

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { t } = useTranslation()
  const auth = useOptionalAuth()
  const { profile, loading: profileLoading } = useUserStore()
  const location = useLocation()
  const alreadyTriggeredRef = useRef(false)

  useEffect(() => {
    if (auth.isLoading || !auth.isAuthAvailable) {
      return
    }

    if (!auth.isAuthenticated && !alreadyTriggeredRef.current) {
      alreadyTriggeredRef.current = true

      if (ENABLE_AUTH_DEBUG) {
        console.debug('[ProtectedRoute] Initiating Auth0 login redirect', {
          intendedPath: location.pathname,
        })
      }

      auth.loginWithRedirect({
        appState: { returnTo: location.pathname + location.search },
      }).catch((error) => {
        console.error('[ProtectedRoute] loginWithRedirect failed:', error)
      })
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.isAuthAvailable, location, auth])

  // Only block with a loading screen if we are initially loading auth OR 
  // if we are authenticated but the profile is not yet in state.
  // We do NOT block if profile is already in state, even if 'profileLoading' is true (background refresh).
  if (auth.isLoading || (auth.isAuthenticated && !profile && profileLoading)) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-muted-foreground">{t('auth.loading')}</p>
      </div>
    )
  }

  if (!auth.isAuthAvailable) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-destructive">{t('auth.notConfigured')}</p>
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-muted-foreground">{t('auth.loading')}</p>
      </div>
    )
  }

  // If profile is still not there after loading, it might be a fetch error or slow API
  if (!profile) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-muted-foreground">{t('auth.loading')}</p>
      </div>
    )
  }

  // If profile is not complete, show loading. 
  // The ProfileGate (wrapping the whole app) will show the modal.
  if (!profile.profileComplete) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-muted-foreground">{t('auth.loading')}</p>
      </div>
    )
  }

  return <>{children}</>
}
