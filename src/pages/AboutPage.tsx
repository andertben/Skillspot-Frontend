import { useTranslation } from 'react-i18next'
import { Users, Target, Zap, Heart, Eye, MessageSquare } from 'lucide-react'

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          {t('pages.about.title')}
        </h1>
        <p className="text-xl md:text-2xl text-primary font-medium">
          {t('pages.about.subtitle')}
        </p>
      </div>

      {/* Intro Section */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-16 space-y-6">
        <p>
          {t('pages.about.intro1')}
        </p>
        <p>
          {t('pages.about.intro2')}
        </p>
      </div>

      {/* Mission Section */}
      <section className="mb-16 bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">{t('pages.about.mission.title')}</h2>
        </div>
        <div className="space-y-6 text-lg">
          <p className="font-medium text-foreground/80">{t('pages.about.mission.subtitle')}</p>
          <p>{t('pages.about.mission.text')}</p>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 list-none p-0">
            {[
              t('pages.about.mission.point1'), 
              t('pages.about.mission.point2'), 
              t('pages.about.mission.point3')
            ].map((item, i) => (
              <li key={i} className="bg-secondary/50 p-4 rounded-2xl flex items-center gap-3 border border-border/50">
                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                <span className="text-sm font-semibold">{item}</span>
              </li>
            ))}
          </ul>
          <p className="pt-4 border-t border-border/50 italic text-muted-foreground text-center">
            {t('pages.about.mission.footer')}
          </p>
        </div>
      </section>

      {/* What makes us special */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Zap className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">{t('pages.about.special.title')}</h2>
        </div>
        <p className="text-lg mb-8">{t('pages.about.special.intro')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border p-6 rounded-2xl hover:shadow-md transition-shadow">
            <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
              <span className="text-primary">1.</span> {t('pages.about.special.point1.title')}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('pages.about.special.point1.text')}
            </p>
          </div>
          <div className="bg-card border border-border p-6 rounded-2xl hover:shadow-md transition-shadow">
            <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
              <span className="text-primary">2.</span> {t('pages.about.special.point2.title')}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('pages.about.special.point2.text')}
            </p>
          </div>
          <div className="bg-card border border-border p-6 rounded-2xl hover:shadow-md transition-shadow">
            <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
              <span className="text-primary">3.</span> {t('pages.about.special.point3.title')}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('pages.about.special.point3.text')}
            </p>
          </div>
        </div>
      </section>

      {/* For whom Section */}
      <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">{t('pages.about.audience.title')}</h2>
          <div className="space-y-4">
            <p className="text-lg">{t('pages.about.audience.intro')}</p>
            <ul className="space-y-3">
              {[
                t('pages.about.audience.point1'),
                t('pages.about.audience.point2'),
                t('pages.about.audience.point3')
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm italic text-muted-foreground pt-4">
              {t('pages.about.audience.footer')}
            </p>
          </div>
        </div>
        <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
          <div className="flex items-center gap-3 mb-6 text-primary">
            <Users className="w-8 h-8" />
            <h2 className="text-2xl font-bold">{t('pages.about.who.title')}</h2>
          </div>
          <p className="text-lg mb-6 leading-relaxed">{t('pages.about.who.intro')}</p>
          <div className="space-y-3 mb-8">
            <div className="bg-background px-6 py-3 rounded-xl border border-border font-bold shadow-sm">- {t('pages.about.who.founder1')}</div>
            <div className="bg-background px-6 py-3 rounded-xl border border-border font-bold shadow-sm">- {t('pages.about.who.founder2')}</div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('pages.about.who.text')}
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8 text-center justify-center">
          <Heart className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold text-center">{t('pages.about.values.title')}</h2>
        </div>
        <div className="bg-secondary/30 rounded-3xl p-8 md:p-12 border border-border">
          <p className="text-lg text-center mb-10 font-medium">{t('pages.about.values.intro')}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              t('pages.about.values.point1'),
              t('pages.about.values.point2'),
              t('pages.about.values.point3'),
              t('pages.about.values.point4'),
              t('pages.about.values.point5')
            ].map((value, i) => (
              <div key={i} className="bg-background p-4 rounded-2xl border border-border shadow-sm text-center flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                  {i + 1}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-tight leading-tight">{value}</span>
              </div>
            ))}
          </div>
          <p className="text-center mt-10 text-sm text-muted-foreground">
            {t('pages.about.values.footer')}
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">{t('pages.about.vision.title')}</h2>
        </div>
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <p className="text-xl">
            {t('pages.about.vision.text1')}
          </p>
          <div className="bg-primary text-primary-foreground p-8 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <Eye className="w-48 h-48" />
            </div>
            <h3 className="text-xl font-bold mb-3 uppercase tracking-widest text-primary-foreground/80">{t('pages.about.vision.highlight')}</h3>
            <p className="text-2xl font-bold leading-snug">
              {t('pages.about.vision.main')}
            </p>
          </div>
          <p className="text-lg italic text-muted-foreground">
            {t('pages.about.vision.footer')}
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-card border-2 border-primary/20 rounded-[2rem] p-10 md:p-16 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-tr-full" />
        
        <MessageSquare className="w-12 h-12 text-primary mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('pages.about.cta.title')}</h2>
        <p className="text-xl text-muted-foreground mb-4">{t('pages.about.cta.subtitle')}</p>
        <p className="text-2xl font-bold text-foreground">
          {t('pages.about.cta.text')}
        </p>
      </section>
    </div>
  )
}
