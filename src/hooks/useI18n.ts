import { useTranslation } from 'react-i18next';

export const useI18n = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };
  
  const getCurrentLanguage = () => i18n.language;
  
  const isLanguageSupported = (language: string) => {
    return Object.keys(i18n.options.resources || {}).includes(language);
  };
  
  const getSupportedLanguages = () => {
    return Object.keys(i18n.options.resources || {});
  };
  
  return {
    t,                    // Translation function
    changeLanguage,       // Language switcher
    getCurrentLanguage,   // Current language getter
    isLanguageSupported,  // Check if language is supported
    getSupportedLanguages, // Get list of supported languages
    isReady: i18n.isInitialized,
    currentLanguage: i18n.language
  };
}; 