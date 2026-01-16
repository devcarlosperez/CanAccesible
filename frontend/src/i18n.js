import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Loads translations using http (files in public/locales)
  .use(Backend)
  // Detects browser language
  .use(LanguageDetector)
  // Passes instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    fallbackLng: 'es', // Default language if detection fails
    debug: true, // Useful for development, logs to console

    interpolation: {
      escapeValue: false, // React already protects against XSS
    }
  });

export default i18n;