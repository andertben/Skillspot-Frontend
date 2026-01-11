import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{t('pages.home.title')}</h1>
      <p className="text-lg text-muted-foreground">{t('pages.home.description')}</p>
    </div>
  )
}
