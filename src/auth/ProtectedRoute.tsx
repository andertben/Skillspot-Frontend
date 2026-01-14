import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useOptionalAuth } from '@/auth/useOptionalAuth'

interface ProtectedRouteProps {
  children: ReactNode
}

const ENABLE_AUTH_DEBUG = import.meta.env.DEV

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { t } = useTranslation()
  const auth = useOptionalAuth()
  const location = useLocation()
  const alreadyTriggeredRef = useRef(false)

  useEffect(() => {
    if (auth.isLoading || !auth.isAuthAvailable) {
      return
    }

    if (!auth.isAuthenticated && !alreadyTriggeredRef.current) {
      alreadyTriggeredRef.current = true

      if (ENABLE_AUTH_DEBUG) {
        console.debug('[ProtectedRoute] Initiating Auth0 login popup', {
          intendedPath: location.pathname,
        })
      }

      auth.loginWithPopup({
        appState: { returnTo: location.pathname + location.search },
      }).catch((error) => {
        console.error('[ProtectedRoute] loginWithPopup failed:', error)
      })
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.isAuthAvailable, location, auth])

  if (auth.isLoading) {
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

  return <>{children}</>
}
