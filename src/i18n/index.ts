import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from "./locales/en/translation.json";
import translationZh from "./locales/zh/translation.json";

const resources = {
  en: { translation: translationEn },
  zh: { translation: translationZh },
};

const SUPPORTED_LANGS = ["en", "zh"] as const;

function resolveLanguage(stored: string | null): string {
  if (!stored || stored === "system") {
    const code = getLocales().at(0)?.languageCode ?? "en";
    return code.startsWith("zh") ? "zh" : "en";
  }
  return SUPPORTED_LANGS.includes(stored as (typeof SUPPORTED_LANGS)[number])
    ? stored
    : "en";
}

const initI18n = async () => {
  const stored = await AsyncStorage.getItem("language");
  const savedLanguage = resolveLanguage(stored);

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();
