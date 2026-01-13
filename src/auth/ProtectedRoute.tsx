import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useOptionalAuth } from '@/auth/useOptionalAuth'
import { AuthLoadingOverlay } from '@/components/AuthLoadingOverlay'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { t } = useTranslation()
  const auth = useOptionalAuth()
  const location = useLocation()
  const alreadyTriggeredRef = useRef(false)
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (auth.isLoading || !auth.isAuthAvailable) {
      return
    }

    if (!auth.isAuthenticated && !alreadyTriggeredRef.current) {
      alreadyTriggeredRef.current = true
      const performLogin = async () => {
        setIsAuthLoading(true)
        setAuthError(null)
        try {
          await auth.loginWithPopup({
            appState: { returnTo: location.pathname + location.search },
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : t('common.error')
          setAuthError(errorMessage)
        } finally {
          setIsAuthLoading(false)
        }
      }
      performLogin()
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.isAuthAvailable, location, auth, t])

  const handleDismissError = () => {
    setAuthError(null)
    alreadyTriggeredRef.current = false
  }

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
      <>
        <AuthLoadingOverlay
          isOpen={isAuthLoading || !!authError}
          error={authError || undefined}
          onDismissError={handleDismissError}
        />
        <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
          <p className="text-muted-foreground">{t('auth.redirecting')}</p>
        </div>
      </>
    )
  }

  return <>{children}</>
}
