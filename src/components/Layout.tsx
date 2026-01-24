import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useOptionalAuth } from '@/auth/useOptionalAuth'
import { useUserStore } from '@/hooks/useUserStore'
import { AuthLoginModal } from '@/components/AuthLoginModal'
import Footer from '@/components/Footer'
import { User, ChevronDown, PlusCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { getUnreadCount } from '@/api/chat'

export default function Layout() {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useOptionalAuth()
  const { profile } = useUserStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [loginModalError, setLoginModalError] = useState<string | null>(null)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    let interval: number

    const fetchUnread = async () => {
      if (auth.isAuthenticated && !auth.isLoading) {
        try {
          const count = await getUnreadCount()
          setUnreadCount(count)
        } catch (error) {
          console.error('[Layout] Failed to fetch unread count:', error)
          setUnreadCount(0)
        }
      } else {
        setUnreadCount(0)
      }
    }

    fetchUnread()
    
    const handleRefresh = () => fetchUnread()
    window.addEventListener('refresh-unread-count', handleRefresh)
    
    if (auth.isAuthenticated && !auth.isLoading) {
      interval = setInterval(fetchUnread, 30000) // 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
      window.removeEventListener('refresh-unread-count', handleRefresh)
    }
  }, [auth.isAuthenticated, auth.isLoading])

  useEffect(() => {
    if (auth.isAuthenticated && !auth.isLoading) {
      getUnreadCount().then(setUnreadCount)
    }
  }, [location.pathname, auth.isAuthenticated, auth.isLoading])

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
      <nav
        className="sticky top-0 z-[1001] w-full border-b border-border bg-background"
        style={{ backgroundColor: 'hsl(var(--background) / 1)', opacity: 1 }}
      >
        <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors text-xl"
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <Link to="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
              Skillspot
            </Link>

            <div className="hidden lg:flex items-center gap-6 ml-8">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-sm font-medium transition-all hover:text-primary relative py-1 ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {auth.isAuthenticated && profile?.role === 'PROVIDER' && (
              <button
                onClick={() => navigate('/services/new')}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
                title={t('common.createService') || 'Dienstleistung erstellen'}
              >
                <PlusCircle className="w-5 h-5 text-primary" />
              </button>
            )}

            {auth.isAuthenticated && auth.user ? (
              <button
                onClick={() => navigate('/account')}
                className="p-2 hover:bg-accent rounded-lg transition-colors relative"
                title={auth.user.name || auth.user.email}
              >
                <User className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold flex items-center justify-center shadow-sm border border-background">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
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
                style={{ borderColor: 'hsl(var(--input))' }}
                aria-label="Language selector"
              >
                {i18n.language === 'de' ? 'DE' : 'EN'}
                <ChevronDown className={`w-4 h-4 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {languageDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 rounded-lg shadow-lg z-[1002] min-w-36 overflow-hidden border bg-background"
                  style={{
                    borderColor: 'hsl(var(--input))',
                    backgroundColor: 'hsl(var(--background) / 1)',
                  }}
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
          <div
            className="lg:hidden px-4 py-3 border-t space-y-1 animate-in slide-in-from-top-2 duration-200 bg-background"
            style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--background) / 1)', opacity: 1 }}
          >
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block py-2.5 px-3 rounded-lg transition-all text-sm font-medium ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}
            
            {auth.isAuthenticated && profile?.role === 'PROVIDER' && (
              <Link
                to="/services/new"
                className={`block py-2.5 px-3 rounded-lg transition-all text-sm font-bold bg-primary text-primary-foreground mt-2 flex items-center justify-center gap-2`}
                onClick={() => setMenuOpen(false)}
              >
                <PlusCircle className="w-5 h-5" />
              </Link>
            )}
            {!auth.isAuthenticated && (
              <div className="sm:hidden flex flex-col gap-2 pt-3 mt-2 border-t" style={{ borderColor: 'hsl(var(--border)/0.4)' }}>
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
