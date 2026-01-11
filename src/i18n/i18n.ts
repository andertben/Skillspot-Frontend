import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import de from './locales/de.json'
import en from './locales/en.json'

const resources = {
  de: { translation: de },
  en: { translation: en },
}

const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage || 'de',
    fallbackLng: 'de',
    defaultNS: 'translation',
    ns: ['translation'],
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n
