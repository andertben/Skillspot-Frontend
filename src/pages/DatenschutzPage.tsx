import { useTranslation } from 'react-i18next'

export default function DatenschutzPage() {
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
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">
        {t('privacy.title')}
      </h1>
      
      <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
        {t('privacy.intro')}
      </p>

      <div className="space-y-12">
        {/* Controller Section */}
        <section className="bg-card border border-border p-8 rounded-3xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-primary uppercase tracking-wider">
            {t('privacy.section.controller.title')}
          </h2>
          <address className="not-italic text-lg leading-relaxed text-foreground/80">
            {renderMultiLine(t('privacy.section.controller.content'))}
          </address>
        </section>

        {/* Data Types Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">{t('privacy.section.dataTypes.title')}</h2>
          <p className="text-lg text-muted-foreground mb-6">{t('privacy.section.dataTypes.intro')}</p>
          <ul className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex items-start gap-3 bg-secondary/20 p-4 rounded-2xl border border-border/50">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-foreground/80">{t(`privacy.section.dataTypes.item${i}`)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Purposes Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">{t('privacy.section.purposes.title')}</h2>
          <p className="text-lg text-muted-foreground mb-6">{t('privacy.section.purposes.intro')}</p>
          <ul className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex items-start gap-3 bg-secondary/20 p-4 rounded-2xl border border-border/50">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-foreground/80">{t(`privacy.section.purposes.item${i}`)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Legal Basis Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">{t('privacy.section.legalBasis.title')}</h2>
          <p className="text-lg text-muted-foreground mb-6">{t('privacy.section.legalBasis.intro')}</p>
          <ul className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex items-start gap-3 bg-secondary/20 p-4 rounded-2xl border border-border/50">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-foreground/80">{t(`privacy.section.legalBasis.item${i}`)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Auth0 Section */}
        <section className="border-l-4 border-primary pl-6 py-2">
          <h2 className="text-2xl font-bold mb-4">{t('privacy.section.auth0.title')}</h2>
          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>{t('privacy.section.auth0.content1')}</p>
            <p>{t('privacy.section.auth0.content2')}</p>
          </div>
        </section>

        {/* Location Section */}
        <section className="bg-secondary/20 p-8 rounded-3xl border border-border/50">
          <h2 className="text-2xl font-bold mb-4">{t('privacy.section.location.title')}</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>{t('privacy.section.location.content1')}</p>
            <p>{t('privacy.section.location.content2')}</p>
          </div>
        </section>

        {/* Chat Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">{t('privacy.section.chat.title')}</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>{t('privacy.section.chat.content1')}</p>
            <p>{t('privacy.section.chat.content2')}</p>
          </div>
        </section>

        {/* Recipients Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">{t('privacy.section.recipients.title')}</h2>
          <p className="text-lg text-muted-foreground mb-6">{t('privacy.section.recipients.intro')}</p>
          <ul className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex items-start gap-3 bg-secondary/20 p-4 rounded-2xl border border-border/50">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-foreground/80">{t(`privacy.section.recipients.item${i}`)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Storage Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">{t('privacy.section.storage.title')}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('privacy.section.storage.content')}
          </p>
        </section>

        {/* Rights Section */}
        <section className="bg-primary/5 p-8 rounded-3xl border border-primary/20">
          <h2 className="text-2xl font-bold mb-6">{t('privacy.section.rights.title')}</h2>
          <p className="text-lg text-muted-foreground mb-6">{t('privacy.section.rights.intro')}</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <li key={i} className="flex items-start gap-3 bg-background p-4 rounded-xl border border-border">
                <span className="text-primary font-bold">Art. {14 + i}</span>
                <span className="text-sm text-foreground/80">{t(`privacy.section.rights.item${i}`)}</span>
              </li>
            ))}
          </ul>
          <p className="text-center font-bold text-primary">
            {t('privacy.section.rights.contact')}
          </p>
        </section>

        {/* Security Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">{t('privacy.section.security.title')}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('privacy.section.security.content')}
          </p>
        </section>

        {/* Changes Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">{t('privacy.section.changes.title')}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('privacy.section.changes.content')}
          </p>
        </section>

        {/* Meta Section */}
        <footer className="pt-8 border-t border-border text-sm text-muted-foreground text-right italic">
          {t('privacy.meta.lastUpdatedLabel')} {t('privacy.meta.lastUpdatedValue')}
        </footer>
      </div>
    </div>
  )
}
