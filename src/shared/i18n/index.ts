import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { appConfig } from '@/config/env'
import enCommon from './locales/en/common.json'
import esArCommon from './locales/es-AR/common.json'

const resources = {
  en: {
    common: enCommon,
  },
  'es-AR': {
    common: esArCommon,
  },
  es: {
    common: esArCommon,
  },
} as const

function syncDocumentLanguage(language: string) {
  document.documentElement.lang = language.startsWith('es') ? 'es' : language
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: appConfig.defaultLocale,
    fallbackLng: 'es-AR',
    supportedLngs: ['es-AR', 'es', 'en'],
    nonExplicitSupportedLngs: true,
    defaultNS: 'common',
    ns: ['common'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['htmlTag', 'navigator'],
      caches: [],
    },
    react: {
      useSuspense: false,
    },
  })
  .then(() => {
    syncDocumentLanguage(i18n.resolvedLanguage ?? appConfig.defaultLocale)
  })

i18n.on('languageChanged', syncDocumentLanguage)

export default i18n
