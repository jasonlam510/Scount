import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from './useTheme';

// Storage keys
const STORAGE_KEYS = {
  THEME_MODE: '@scount:theme_mode',
  LANGUAGE: '@scount:language',
  IS_SEEDED: '@scount:is_seeded',
} as const;

// Default values
const DEFAULT_VALUES = {
  THEME_MODE: 'automatic' as ThemeMode,
  LANGUAGE: 'en',
  IS_SEEDED: false,
} as const;

export interface Preferences {
  themeMode: ThemeMode;
  language: string;
  isSeeded: boolean;
}

// Database seeding methods
export const isDatabaseSeeded = async (): Promise<boolean> => {
  try {
    const seeded = await AsyncStorage.getItem(STORAGE_KEYS.IS_SEEDED);
    return seeded === 'true';
  } catch (error) {
    console.warn('Failed to load database seeded status from storage:', error);
    return DEFAULT_VALUES.IS_SEEDED;
  }
};

export const setDatabaseSeeded = async (seeded: boolean = true): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.IS_SEEDED, seeded.toString());
  } catch (error) {
    console.error('Failed to save database seeded status to storage:', error);
    throw new Error('Failed to save database seeded status');
  }
};

// Reset all data (useful for development/testing)
export const resetAllData = async (): Promise<void> => {
  try {
    console.log('🔄 Resetting all app data...')
    
    // Clear AsyncStorage
    await clearAllPreferences()
    
    // Clear IndexedDB (for web)
    if (typeof window !== 'undefined' && window.indexedDB) {
      try {
        await new Promise<void>((resolve, reject) => {
          const request = indexedDB.deleteDatabase('scountDB')
          request.onsuccess = () => {
            console.log('✅ IndexedDB cleared')
            resolve()
          }
          request.onerror = () => {
            console.log('⚠️ IndexedDB clear failed (might not exist)')
            resolve() // Don't reject, just continue
          }
        })
      } catch (error) {
        console.log('⚠️ IndexedDB clear error:', error)
      }
    }
    
    console.log('✅ All data reset successfully')
    console.log('🔄 Please refresh the page to re-seed the database')
  } catch (error) {
    console.error('❌ Failed to reset data:', error)
    throw new Error('Failed to reset data')
  }
};

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
    const [themeMode, language, isSeeded] = await Promise.all([
      getThemeMode(),
      getLanguage(),
      isDatabaseSeeded(),
    ]);

    return {
      themeMode,
      language,
      isSeeded,
    };
  } catch (error) {
    console.warn('Failed to load preferences:', error);
    return {
      themeMode: DEFAULT_VALUES.THEME_MODE,
      language: DEFAULT_VALUES.LANGUAGE,
      isSeeded: DEFAULT_VALUES.IS_SEEDED,
    };
  }
};

// Clear all preferences (useful for testing or reset)
export const clearAllPreferences = async (): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.THEME_MODE),
      AsyncStorage.removeItem(STORAGE_KEYS.LANGUAGE),
      AsyncStorage.removeItem(STORAGE_KEYS.IS_SEEDED),
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