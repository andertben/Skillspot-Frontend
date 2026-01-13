import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useOptionalAuth } from '@/auth/useOptionalAuth'
import { SetupAuthInterceptor } from '@/auth/SetupAuthInterceptor'
import { AuthLoadingOverlay } from '@/components/AuthLoadingOverlay'

export default function Layout() {
  const { i18n, t } = useTranslation()
  const auth = useOptionalAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const toggleLanguage = () => {
    const newLang = i18n.language === 'de' ? 'en' : 'de'
    localStorage.setItem('language', newLang)
    i18n.changeLanguage(newLang)
  }

  const handleLoginClick = async () => {
    setAuthLoading(true)
    setAuthError(null)
    try {
      await auth.loginWithPopup()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('common.error')
      setAuthError(errorMessage)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignupClick = async () => {
    setAuthLoading(true)
    setAuthError(null)
    try {
      await auth.loginWithPopup({
        authorizationParams: { screen_hint: 'signup' },
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('common.error')
      setAuthError(errorMessage)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleDismissError = () => {
    setAuthError(null)
  }

  const menuItems = [
    { path: '/', label: t('menu.home') },
    { path: '/services', label: t('menu.services') },
    { path: '/map', label: t('menu.map') },
    { path: '/about', label: t('menu.about') },
  ]

  return (
    <div className="flex h-screen flex-col">
      <SetupAuthInterceptor />
      <AuthLoadingOverlay
        isOpen={authLoading || !!authError}
        error={authError || undefined}
        onDismissError={handleDismissError}
      />
      <nav className="bg-card" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl font-bold">
              ☰
            </button>
            <Link to="/" className="text-2xl font-bold hover:text-primary transition-colors">
              Skillspot
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {auth.isAuthenticated && auth.user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm">{auth.user.name || auth.user.email}</span>
                <Button variant="outline" size="sm" onClick={() => auth.logout({ returnTo: window.location.origin })}>
                  {t('common.logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button size="sm" onClick={handleLoginClick} disabled={authLoading}>
                  {t('auth.login')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignupClick}
                  disabled={authLoading}
                >
                  {t('auth.signup')}
                </Button>
              </div>
            )}

            <Button variant="outline" size="sm" onClick={toggleLanguage}>
              {i18n.language === 'de' ? 'EN' : 'DE'}
            </Button>
          </div>
        </div>

        {menuOpen && (
          <div className="bg-card px-4 py-2 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block py-2 cursor-pointer hover:text-primary"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="flex-1 overflow-auto bg-background">
        <Outlet />
      </main>
    </div>
  )
}
