import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          welcome: 'Welcome Back, Admin',
          clients: 'Clients',
          dashboard: 'Dashboard',
          reports: 'Reports',
          settings: 'Settings',
          employers: 'Employers',
          vacancies: 'Vacancies',
        }
      },
      fr: {
        translation: {
          welcome: 'Bon retour, Administrateur',
          clients: 'Clients',
          dashboard: 'Tableau de bord',
          reports: 'Rapports',
          settings: 'Paramètres',
          employers: 'Employeurs',
          vacancies: 'Postes Vacants',
        }
      }
    }
  });

export default i18n;
