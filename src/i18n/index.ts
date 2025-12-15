import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

// Import translation files
import en from "./locales/en.json";
import zh from "./locales/zh.json";

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
};

// Get device locale with better fallback handling
const getDeviceLocale = () => {
  try {
    const locales = Localization.getLocales();
    if (locales && locales.length > 0) {
      const primaryLocale = locales[0];
      console.log("🌍 Device locale detected:", {
        languageCode: primaryLocale.languageCode,
        languageTag: primaryLocale.languageTag,
        regionCode: primaryLocale.regionCode,
        textDirection: primaryLocale.textDirection,
        decimalSeparator: primaryLocale.decimalSeparator,
        digitGroupingSeparator: primaryLocale.digitGroupingSeparator,
        currencyCode: primaryLocale.currencyCode,
        currencySymbol: primaryLocale.currencySymbol,
        measurementSystem: primaryLocale.measurementSystem,
      });
      return primaryLocale.languageCode || "en";
    }
  } catch (error) {
    console.warn("⚠️ Failed to get device locale:", error);
  }
  return "en";
};

// Get text direction for RTL support
const getTextDirection = () => {
  try {
    const locales = Localization.getLocales();
    if (locales && locales.length > 0) {
      return locales[0].textDirection || "ltr";
    }
  } catch (error) {
    console.warn("⚠️ Failed to get text direction:", error);
  }
  return "ltr";
};

// Initialize i18next with enhanced Expo integration
i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLocale(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  compatibilityJSON: "v4", // For React Native compatibility

  // Enhanced configuration for better Expo integration
  detection: {
    // Enable language detection
    order: ["localStorage", "navigator", "htmlTag"],
    caches: ["localStorage"],
  },

  react: {
    useSuspense: false, // Better for React Native
  },

  // Debug mode in development
  debug: __DEV__,
});

// Export locale information for use throughout the app
export const localeInfo = {
  languageCode: getDeviceLocale(),
  decimalSeparator: Localization.getLocales()[0]?.decimalSeparator || ".",
  digitGroupingSeparator:
    Localization.getLocales()[0]?.digitGroupingSeparator || ",",
  measurementSystem:
    Localization.getLocales()[0]?.measurementSystem || "metric",
};

export default i18n;
