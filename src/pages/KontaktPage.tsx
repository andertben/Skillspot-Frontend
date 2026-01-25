import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Mail, Users, MessageSquare, Clock, ShieldCheck, Copy, Check, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function KontaktPage() {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(t('contact.section.details.emailValue'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          {t('contact.title')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t('contact.intro')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Contact Details Card */}
        <section className="bg-card border border-border p-8 rounded-3xl shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-8 text-primary">
            <Mail className="w-8 h-8" />
            <h2 className="text-2xl font-bold uppercase tracking-tight">
              {t('contact.section.details.title')}
            </h2>
          </div>
          
          <div className="space-y-8 flex-1">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {t('contact.section.details.emailLabel')}
              </label>
              <div className="flex flex-col gap-3">
                <p className="text-xl font-semibold break-all">
                  {t('contact.section.details.emailValue')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    className="rounded-xl flex-1 sm:flex-none"
                    onClick={() => window.location.href = `mailto:${t('contact.section.details.emailValue')}`}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {t('contact.actions.mailButton')}
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleCopyEmail}
                    className="rounded-xl flex-1 sm:flex-none"
                  >
                    {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? t('contact.actions.copied') : t('contact.actions.copyEmail')}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-border/50">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {t('contact.section.details.addressLabel')}
              </label>
              <address className="not-italic text-lg leading-relaxed text-foreground/80 whitespace-pre-line">
                {t('contact.section.details.addressValue')}
              </address>
            </div>
          </div>
        </section>

        {/* Support & People Card */}
        <div className="space-y-8">
          <section className="bg-secondary/20 border border-border/50 p-8 rounded-3xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">{t('contact.section.support.title')}</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('contact.section.support.text')}
            </p>
          </section>

          <section className="bg-card border border-border p-8 rounded-3xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">{t('contact.section.people.title')}</h2>
            </div>
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">{t('contact.section.people.intro')}</p>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4 bg-background p-4 rounded-2xl border border-border shadow-sm transition-transform hover:scale-[1.02]">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    BW
                  </div>
                  <div>
                    <h4 className="font-bold">{t('contact.section.people.person1.name')}</h4>
                    <p className="text-xs text-muted-foreground">{t('contact.section.people.person1.role')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-background p-4 rounded-2xl border border-border shadow-sm transition-transform hover:scale-[1.02]">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    BA
                  </div>
                  <div>
                    <h4 className="font-bold">{t('contact.section.people.person2.name')}</h4>
                    <p className="text-xs text-muted-foreground">{t('contact.section.people.person2.role')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Response Time */}
        <section className="bg-background border border-border p-8 rounded-3xl flex items-start gap-4 shadow-sm">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">{t('contact.section.responseTime.title')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('contact.section.responseTime.text')}
            </p>
          </div>
        </section>

        {/* Privacy Hint */}
        <section className="bg-background border border-border p-8 rounded-3xl flex items-start gap-4 shadow-sm">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">{t('contact.section.privacyHint.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('contact.section.privacyHint.text')}
            </p>
            <Link to="/datenschutz" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
              {t('footer.datenschutz')}
              <span className="text-lg">→</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
