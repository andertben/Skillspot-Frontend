import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useOptionalAuth } from '@/auth/useOptionalAuth'
import { AuthLoginModal } from '@/components/AuthLoginModal'
import Footer from '@/components/Footer'
import { User, ChevronDown } from 'lucide-react'

export default function Layout() {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const auth = useOptionalAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [loginModalError, setLoginModalError] = useState<string | null>(null)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)

  const changeLanguage = (lang: string) => {
    localStorage.setItem('language', lang)
    i18n.changeLanguage(lang)
    setLanguageDropdownOpen(false)
  }

  const handleLoginClick = async () => {
    setLoginModalOpen(true)
    setLoginModalError(null)
    try {
      await auth.loginWithPopup()
      setLoginModalOpen(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('common.error')
      console.error('[Layout] Login failed:', errorMessage)
      setLoginModalError(errorMessage)
    }
  }

  const handleSignupClick = async () => {
    setLoginModalOpen(true)
    setLoginModalError(null)
    try {
      await auth.loginWithPopup({
        authorizationParams: { screen_hint: 'signup' },
      })
      setLoginModalOpen(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('common.error')
      console.error('[Layout] Signup failed:', errorMessage)
      setLoginModalError(errorMessage)
    }
  }

  const handleCloseLoginModal = () => {
    setLoginModalOpen(false)
    setLoginModalError(null)
  }

  const menuItems = [
    { path: '/', label: t('menu.home') },
    { path: '/services', label: t('menu.services') },
    { path: '/map', label: t('menu.map') },
    { path: '/about', label: t('menu.about') },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <AuthLoginModal
        isOpen={loginModalOpen}
        error={loginModalError}
        onClose={handleCloseLoginModal}
      />
      <nav className="sticky top-0 z-50 border-b border-border bg-white" style={{ backgroundColor: 'white' }}>
        <div className="px-4 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors text-xl"
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <Link to="/" className="text-2xl font-bold hover:text-primary transition-colors">
              Skillspot
            </Link>
            
            <div className="hidden lg:flex items-center gap-8 ml-8">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {auth.isAuthenticated && auth.user ? (
              <button
                onClick={() => navigate('/account')}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
                title={auth.user.name || auth.user.email}
              >
                <User className="w-5 h-5" />
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button size="sm" onClick={handleLoginClick}>
                  {t('auth.login')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignupClick}
                >
                  {t('auth.signup')}
                </Button>
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-accent transition-colors"
                style={{ borderColor: 'hsl(var(--border))' }}
                aria-label="Language selector"
              >
                {i18n.language === 'de' ? 'DE' : 'EN'}
                <ChevronDown className={`w-4 h-4 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {languageDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg z-50 min-w-36 overflow-hidden border border-t-0"
                  style={{ borderColor: 'hsl(var(--border))' }}
                >
                  <button
                    onClick={() => changeLanguage('de')}
                    className={`block w-full text-left px-4 py-2 hover:bg-accent transition-colors ${
                      i18n.language === 'de' ? 'text-primary font-semibold' : ''
                    }`}
                  >
                    {t('languages.de')}
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`block w-full text-left px-4 py-2 hover:bg-accent transition-colors border-t ${
                      i18n.language === 'en' ? 'text-primary font-semibold' : ''
                    }`}
                    style={{ borderColor: 'hsl(var(--border))' }}
                  >
                    {t('languages.en')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-card px-4 py-3 border-t space-y-2" style={{ borderColor: 'hsl(var(--border))' }}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block py-2 px-2 cursor-pointer hover:text-primary hover:bg-accent rounded-lg transition-colors text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {!auth.isAuthenticated && (
              <div className="sm:hidden flex flex-col gap-2 pt-2 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                <Button size="sm" onClick={handleLoginClick} className="w-full">
                  {t('auth.login')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignupClick}
                  className="w-full"
                >
                  {t('auth.signup')}
                </Button>
              </div>
            )}
          </div>
        )}
      </nav>

      <main className="flex-1 overflow-auto bg-background">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
