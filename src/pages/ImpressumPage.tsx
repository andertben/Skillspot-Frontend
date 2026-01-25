import { useTranslation } from 'react-i18next'

export default function ImpressumPage() {
  const { t } = useTranslation()

  const renderMultiLine = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-12 tracking-tight">
        {t('imprint.title')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Operator Section */}
        <section className="bg-card border border-border p-8 rounded-3xl shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-primary uppercase tracking-wider">
            {t('imprint.section.operator.title')}
          </h2>
          <address className="not-italic text-lg leading-relaxed text-foreground/80">
            {renderMultiLine(t('imprint.section.operator.content'))}
          </address>
        </section>

        {/* Contact Section */}
        <section className="bg-card border border-border p-8 rounded-3xl shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-primary uppercase tracking-wider">
            {t('imprint.section.contact.title')}
          </h2>
          <div className="space-y-4 text-lg">
            <p className="flex flex-col sm:flex-row sm:gap-2">
              <span className="font-semibold">{t('imprint.section.contact.phoneLabel')}</span>
              <a href={`tel:${t('imprint.section.contact.phoneValue')}`} className="hover:text-primary transition-colors">
                {t('imprint.section.contact.phoneValue')}
              </a>
            </p>
            <p className="flex flex-col sm:flex-row sm:gap-2">
              <span className="font-semibold">{t('imprint.section.contact.emailLabel')}</span>
              <a href={`mailto:${t('imprint.section.contact.emailValue')}`} className="hover:text-primary transition-colors break-all">
                {t('imprint.section.contact.emailValue')}
              </a>
            </p>
          </div>
        </section>
      </div>

      <div className="space-y-12">
        {/* Responsible Section */}
        <section className="border-l-4 border-primary pl-6 py-2">
          <h2 className="text-2xl font-bold mb-4">
            {t('imprint.section.responsible.title')}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {renderMultiLine(t('imprint.section.responsible.content'))}
          </p>
        </section>

        {/* Disclaimer Section */}
        <section className="bg-secondary/20 p-8 rounded-3xl border border-border/50">
          <h2 className="text-2xl font-bold mb-6">
            {t('imprint.section.disclaimer.title')}
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>{t('imprint.section.disclaimer.content1')}</p>
            <p>{t('imprint.section.disclaimer.content2')}</p>
            <p>{t('imprint.section.disclaimer.content3')}</p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Links & Copyright */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">{t('imprint.section.links.title')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('imprint.section.links.content')}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">{t('imprint.section.copyright.title')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('imprint.section.copyright.content')}</p>
          </section>
        </div>

        {/* Privacy Section */}
        <section className="pt-8 border-t border-border">
          <h2 className="text-2xl font-bold mb-4">{t('imprint.section.privacy.title')}</h2>
          <p className="text-lg text-muted-foreground">
            {t('imprint.section.privacy.content')}
          </p>
        </section>
      </div>
    </div>
  )
}
