import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Carga traducciones usando http (archivos en public/locales)
  .use(Backend)
  // Detecta el idioma del navegador
  .use(LanguageDetector)
  // Pasa la instancia a react-i18next
  .use(initReactI18next)
  // Inicializa i18next
  .init({
    fallbackLng: 'es', // Idioma por defecto si falla la detección
    debug: true, // Útil para desarrollo, verás logs en la consola

    interpolation: {
      escapeValue: false, // React ya protege contra XSS
    }
  });

export default i18n;