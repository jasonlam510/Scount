import { useTranslation } from 'react-i18next';
import { useEffect, useMemo } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { localeInfo } from '@/i18n';
import * as Localization from 'expo-localization';

export const useI18n = () => {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useAppSettings();

  // Update i18n language when preferences change
  useEffect(() => {
    if (language && isLanguageSupported(language)) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const changeLanguage = async (newLanguage: string) => {
    try {
      setLanguage(newLanguage);
      // i18n will be updated via useEffect
    } catch (error) {
      console.error('Failed to change language:', error);
      // Still change the i18n language even if storage fails
      i18n.changeLanguage(newLanguage);
    }
  };
  
  const getCurrentLanguage = () => i18n.language;
  
  const isLanguageSupported = (language: string) => {
    return Object.keys(i18n.options.resources || {}).includes(language);
  };
  
  const getSupportedLanguages = () => {
    return Object.keys(i18n.options.resources || {});
  };

  // Simple locale information (no formatting functions)
  const localeData = useMemo(() => {
    try {
      const locales = Localization.getLocales();
      const primaryLocale = locales[0];
      
      return {
        languageCode: primaryLocale?.languageCode || 'en',
        languageTag: primaryLocale?.languageTag || 'en-US',
        regionCode: primaryLocale?.regionCode || 'US'
      };
    } catch (error) {
      console.warn('Failed to get locale data:', error);
      return {
        languageCode: 'en',
        languageTag: 'en-US', 
        regionCode: 'US'
      };
    }
  }, []);
  
  return {
    // Basic i18n functions
    t,                    // Translation function
    changeLanguage,       // Language switcher
    getCurrentLanguage,   // Current language getter
    isLanguageSupported,  // Check if language is supported
    getSupportedLanguages, // Get list of supported languages
    isReady: i18n.isInitialized,
    currentLanguage: i18n.language,
    
    // Simple locale information (no formatting)
    locale: localeData
  };
}; 