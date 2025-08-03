import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from './useTheme';

// Storage keys
const STORAGE_KEYS = {
  THEME_MODE: '@scount:theme_mode',
  LANGUAGE: '@scount:language',
  IS_SEEDED: '@scount:is_seeded',
  CURRENT_USER_UUID: '@scount:current_user_uuid',
  NOTIFICATIONS_ENABLED: '@scount:notifications_enabled',
} as const;

// Default values
const DEFAULT_VALUES = {
  THEME_MODE: 'automatic' as ThemeMode,
  LANGUAGE: 'en',
  IS_SEEDED: false,
  CURRENT_USER_UUID: '550e8400-e29b-41d4-a716-446655440000' as string | null, // Jason's UUID
  NOTIFICATIONS_ENABLED: false,
} as const;

export interface Preferences {
  themeMode: ThemeMode;
  language: string;
  isSeeded: boolean;
  currentUserUuid: string | null;
  notificationsEnabled: boolean;
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

// Current user UUID methods
export const getCurrentUserUuid = async (): Promise<string | null> => {
  try {
    const userUuid = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER_UUID);
    return userUuid;
  } catch (error) {
    console.warn('Failed to load current user UUID from storage:', error);
    return DEFAULT_VALUES.CURRENT_USER_UUID;
  }
};

export const setCurrentUserUuid = async (userUuid: string | null): Promise<void> => {
  try {
    if (userUuid) {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER_UUID, userUuid);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER_UUID);
    }
  } catch (error) {
    console.error('Failed to save current user UUID to storage:', error);
    throw new Error('Failed to save current user UUID');
  }
};

export const clearCurrentUserUuid = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER_UUID);
  } catch (error) {
    console.error('Failed to clear current user UUID from storage:', error);
    throw new Error('Failed to clear current user UUID');
  }
};

// Notification methods
export const getNotificationsEnabled = async (): Promise<boolean> => {
  try {
    const enabled = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
    return enabled === null ? DEFAULT_VALUES.NOTIFICATIONS_ENABLED : enabled === 'true';
  } catch (error) {
    console.warn('Failed to load notifications setting from storage:', error);
    return DEFAULT_VALUES.NOTIFICATIONS_ENABLED;
  }
};

export const setNotificationsEnabled = async (enabled: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, enabled.toString());
  } catch (error) {
    console.error('Failed to save notifications setting to storage:', error);
    throw new Error('Failed to save notifications setting');
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
    const [themeMode, language, isSeeded, currentUserUuid, notificationsEnabled] = await Promise.all([
      getThemeMode(),
      getLanguage(),
      isDatabaseSeeded(),
      getCurrentUserUuid(),
      getNotificationsEnabled(),
    ]);

    return {
      themeMode,
      language,
      isSeeded,
      currentUserUuid,
      notificationsEnabled,
    };
  } catch (error) {
    console.warn('Failed to load preferences:', error);
    return {
      themeMode: DEFAULT_VALUES.THEME_MODE,
      language: DEFAULT_VALUES.LANGUAGE,
      isSeeded: DEFAULT_VALUES.IS_SEEDED,
      currentUserUuid: DEFAULT_VALUES.CURRENT_USER_UUID,
      notificationsEnabled: DEFAULT_VALUES.NOTIFICATIONS_ENABLED,
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
      AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER_UUID),
      AsyncStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED),
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
    const notificationsEnabled = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
    return !!(themeMode && language && notificationsEnabled !== null);
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
      console.log('🔧 Initializing default preferences...');
      await Promise.all([
        setThemeMode(DEFAULT_VALUES.THEME_MODE),
        setLanguage(DEFAULT_VALUES.LANGUAGE),
        setNotificationsEnabled(DEFAULT_VALUES.NOTIFICATIONS_ENABLED),
        setCurrentUserUuid(DEFAULT_VALUES.CURRENT_USER_UUID),
        setDatabaseSeeded(DEFAULT_VALUES.IS_SEEDED),
      ]);
      console.log('✅ Default preferences initialized');
    } else {
      console.log('✅ Preferences already initialized');
    }
  } catch (error) {
    console.error('Failed to initialize default preferences:', error);
    throw new Error('Failed to initialize preferences');
  }
}; 