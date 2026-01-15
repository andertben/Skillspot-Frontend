import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-neutral-900 text-neutral-200 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-100">{t('footer.navigation')}</h3>
            <nav className="space-y-3">
              <div>
                <Link
                  to="/"
                  className="hover:text-neutral-100 hover:underline transition-colors"
                >
                  {t('footer.home')}
                </Link>
              </div>
              <div>
                <Link
                  to="/services"
                  className="hover:text-neutral-100 hover:underline transition-colors"
                >
                  {t('footer.services')}
                </Link>
              </div>
              <div>
                <Link
                  to="/about"
                  className="hover:text-neutral-100 hover:underline transition-colors"
                >
                  {t('footer.about')}
                </Link>
              </div>
              <div>
                <Link
                  to="/contact"
                  className="hover:text-neutral-100 hover:underline transition-colors"
                >
                  {t('footer.contact')}
                </Link>
              </div>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-100">{t('footer.legal')}</h3>
            <nav className="space-y-3">
              <div>
                <Link
                  to="/impressum"
                  className="hover:text-neutral-100 hover:underline transition-colors"
                >
                  {t('footer.impressum')}
                </Link>
              </div>
              <div>
                <Link
                  to="/datenschutz"
                  className="hover:text-neutral-100 hover:underline transition-colors"
                >
                  {t('footer.datenschutz')}
                </Link>
              </div>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-100">Skillspot</h3>
            <p className="text-sm leading-relaxed text-neutral-300">
              {t('footer.projectHint')}
            </p>
          </div>
        </div>

        <div className="border-t" style={{ borderColor: 'hsl(var(--border))' }}>
          <div className="pt-8 text-center text-sm text-neutral-400">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
