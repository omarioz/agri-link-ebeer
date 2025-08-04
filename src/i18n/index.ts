import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import localforage from 'localforage';

// Import translation files
import en from './locales/en.json';
import so from './locales/so.json';
import ar from './locales/ar.json';

const resources = {
  en: { translation: en },
  so: { translation: so },
  ar: { translation: ar },
};

// Get saved language from storage
const getSavedLanguage = async () => {
  try {
    const user = await localforage.getItem<any>('user');
    return user?.language || 'en';
  } catch {
    return 'en';
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Will be updated after checking storage
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Update language after initialization
getSavedLanguage().then(lang => {
  i18n.changeLanguage(lang);
});

export default i18n;