import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import fr from './translations/fr.json';
import en from './translations/en.json';
import es from './translations/es.json';
import de from './translations/de.json';

const LANGUAGE_KEY = '@BlockR:language';

export const resources = {
  fr: { translation: fr },
  en: { translation: en },
  es: { translation: es },
  de: { translation: de },
};

export const availableLanguages = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
};

// Obtenir la langue sauvegardée
const getStoredLanguage = async () => {
  try {
    const language = await AsyncStorage.getItem(LANGUAGE_KEY);
    return language || 'fr'; // Français par défaut
  } catch {
    return 'fr';
  }
};

// Sauvegarder la préférence de langue
export const changeLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error('Erreur lors du changement de langue:', error);
  }
};

// Initialiser i18n
export const initI18n = async () => {
  const savedLanguage = await getStoredLanguage();
  
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: 'fr',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
};

export default i18n;