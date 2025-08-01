import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '../hooks/useTheme';

// Storage keys
const STORAGE_KEYS = {
  THEME_MODE: '@scount:theme_mode',
  LANGUAGE: '@scount:language',
} as const;

// Default values
const DEFAULT_VALUES = {
  THEME_MODE: 'automatic' as ThemeMode,
  LANGUAGE: 'en',
} as const;

export interface Preferences {
  themeMode: ThemeMode;
  language: string;
}

// Theme methods
export const getThemeMode = async (): Promise<ThemeMode> => {
  try {
    const storedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
    if (storedTheme && ['light', 'dark', 'automatic'].includes(storedTheme)) {
      return storedTheme as ThemeMode;
    }
    return DEFAULT_VALUES.THEME_MODE;
  } catch (error) {
    console.warn('Failed to load theme mode from storage:', error);
    return DEFAULT_VALUES.THEME_MODE;
  }
};

export const setThemeMode = async (themeMode: ThemeMode): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, themeMode);
  } catch (error) {
    console.error('Failed to save theme mode to storage:', error);
    throw new Error('Failed to save theme preference');
  }
};

// Language methods
export const getLanguage = async (): Promise<string> => {
  try {
    const storedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (storedLanguage && ['en', 'zh'].includes(storedLanguage)) {
      return storedLanguage;
    }
    return DEFAULT_VALUES.LANGUAGE;
  } catch (error) {
    console.warn('Failed to load language from storage:', error);
    return DEFAULT_VALUES.LANGUAGE;
  }
};

export const setLanguage = async (language: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  } catch (error) {
    console.error('Failed to save language to storage:', error);
    throw new Error('Failed to save language preference');
  }
};

// Get all preferences
export const getAllPreferences = async (): Promise<Preferences> => {
  try {
    const [themeMode, language] = await Promise.all([
      getThemeMode(),
      getLanguage(),
    ]);

    return {
      themeMode,
      language,
    };
  } catch (error) {
    console.warn('Failed to load preferences:', error);
    return {
      themeMode: DEFAULT_VALUES.THEME_MODE,
      language: DEFAULT_VALUES.LANGUAGE,
    };
  }
};

// Clear all preferences (useful for testing or reset)
export const clearAllPreferences = async (): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.THEME_MODE),
      AsyncStorage.removeItem(STORAGE_KEYS.LANGUAGE),
    ]);
  } catch (error) {
    console.error('Failed to clear preferences:', error);
    throw new Error('Failed to clear preferences');
  }
};

// Check if preferences are initialized
export const isInitialized = async (): Promise<boolean> => {
  try {
    const themeMode = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
    const language = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return !!(themeMode && language);
  } catch (error) {
    console.warn('Failed to check initialization status:', error);
    return false;
  }
};

// Initialize with default values if not already set
export const initializeDefaults = async (): Promise<void> => {
  try {
    const initialized = await isInitialized();
    if (!initialized) {
      await Promise.all([
        setThemeMode(DEFAULT_VALUES.THEME_MODE),
        setLanguage(DEFAULT_VALUES.LANGUAGE),
      ]);
    }
  } catch (error) {
    console.error('Failed to initialize default preferences:', error);
    throw new Error('Failed to initialize preferences');
  }
}; 