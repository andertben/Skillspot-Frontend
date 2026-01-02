import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const { i18n, t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleLanguage = () => {
    const newLang = i18n.language === 'de' ? 'en' : 'de'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  return (
    <div className="flex h-screen flex-col">
      <nav className="bg-card" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl font-bold">
              ☰
            </button>
            <h1 className="text-2xl font-bold">Skillspot</h1>
          </div>

          <Button variant="outline" size="sm" onClick={toggleLanguage}>
            {i18n.language === 'de' ? 'EN' : 'DE'}
          </Button>
        </div>

        {menuOpen && (
          <div className="bg-card px-4 py-2 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
            <p className="py-2 cursor-pointer hover:text-primary">{t('menu.home')}</p>
            <p className="py-2 cursor-pointer hover:text-primary">{t('menu.categories')}</p>
          </div>
        )}
      </nav>

      <main className="flex-1 overflow-auto bg-background">
        <Outlet />
      </main>
    </div>
  )
}
