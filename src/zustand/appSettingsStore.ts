import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeMode } from "@/hooks/useTheme";
import { useEffect } from "react";

// App settings interface
interface AppSettingsState {
  // Theme settings
  themeMode: ThemeMode;

  // Language settings
  language: string;

  // Notification settings
  notificationsEnabled: boolean;
}

// Actions interface
interface AppSettingsActions {
  // Theme actions
  setThemeMode: (themeMode: ThemeMode) => void;

  // Language actions
  setLanguage: (language: string) => void;

  // Notification actions
  setNotificationsEnabled: (enabled: boolean) => void;

  // Utility actions
  resetToDefaults: () => void;

  // Persistence actions
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

// Combined store type
export type AppSettingsStore = AppSettingsState & AppSettingsActions;

// Default values
const DEFAULT_SETTINGS: AppSettingsState = {
  themeMode: "automatic",
  language: "en",
  notificationsEnabled: true,
};

// Validation functions
const isValidThemeMode = (value: string): value is ThemeMode => {
  return ["light", "dark", "automatic"].includes(value);
};

const isValidLanguage = (value: string): boolean => {
  return ["en", "zh"].includes(value);
};

// Storage keys
const STORAGE_KEYS = {
  THEME_MODE: "@scount:theme_mode",
  LANGUAGE: "@scount:language",
  NOTIFICATIONS_ENABLED: "@scount:notifications_enabled",
};

// Create the store without persist middleware
export const useAppSettingsStore = create<AppSettingsStore>((set, get) => ({
  // Initial state
  ...DEFAULT_SETTINGS,

  // Actions
  setThemeMode: (themeMode: ThemeMode) => {
    if (isValidThemeMode(themeMode)) {
      set({ themeMode });
      // Save to storage
      get().saveToStorage();
    }
  },

  setLanguage: (language: string) => {
    if (isValidLanguage(language)) {
      set({ language });
      // Save to storage
      get().saveToStorage();
    }
  },

  setNotificationsEnabled: (enabled: boolean) => {
    set({ notificationsEnabled: enabled });
    // Save to storage
    get().saveToStorage();
  },

  resetToDefaults: () => {
    set(DEFAULT_SETTINGS);
    // Save to storage
    get().saveToStorage();
  },

  // Persistence actions
  loadFromStorage: async () => {
    try {
      const [themeModeRaw, languageRaw, notificationsRaw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE),
        AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED),
      ]);

      const updates: Partial<AppSettingsState> = {};

      if (themeModeRaw && isValidThemeMode(themeModeRaw)) {
        updates.themeMode = themeModeRaw;
      }

      if (languageRaw && isValidLanguage(languageRaw)) {
        updates.language = languageRaw;
      }

      if (notificationsRaw !== null) {
        updates.notificationsEnabled = notificationsRaw === "true";
      }

      if (Object.keys(updates).length > 0) {
        set(updates);
      }
    } catch (error) {
      console.error("Failed to load app settings from storage:", error);
    }
  },

  saveToStorage: async () => {
    try {
      const state = get();
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, state.themeMode),
        AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, state.language),
        AsyncStorage.setItem(
          STORAGE_KEYS.NOTIFICATIONS_ENABLED,
          state.notificationsEnabled.toString(),
        ),
      ]);
    } catch (error) {
      console.error("Failed to save app settings to storage:", error);
    }
  },
}));
