import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode } from '../hooks/useTheme';
import { useAsyncStorage } from '../hooks/useAsyncStorage';

// Storage keys - centralized
export const STORAGE_KEYS = {
  // App Settings
  THEME_MODE: '@scount:theme_mode',
  LANGUAGE: '@scount:language',
  NOTIFICATIONS_ENABLED: '@scount:notifications_enabled',
  
  // User Session
  CURRENT_USER_UUID: '@scount:current_user_uuid',
} as const;

// Centralized app defaults - easy to modify
const APP_DEFAULTS = {
  themeMode: 'automatic' as ThemeMode,
  language: 'en',
  notificationsEnabled: true,
  currentUserUuid: '550e8400-e29b-41d4-a716-446655440000' as string | null, // Jason's UUID
} as const;

// All settings interface
export interface AllSettings {
  // App Settings
  themeMode: ThemeMode;
  language: string;
  notificationsEnabled: boolean;
  
  // User Session
  currentUserUuid: string | null;
}

interface SettingsState {
  // App Settings
  themeMode: ThemeMode;
  language: string;
  notificationsEnabled: boolean;
  
  // User Session
  currentUserUuid: string | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
}

interface SettingsContextType extends SettingsState {
  // App Settings Actions
  setThemeMode: (themeMode: ThemeMode) => Promise<void>;
  setLanguage: (language: string) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  
  // User Session Actions
  setCurrentUserUuid: (userUuid: string | null) => Promise<void>;
  clearCurrentUserUuid: () => Promise<void>;
  
  // Utility Actions
  refreshAllSettings: () => Promise<void>;
  clearAllSettings: () => Promise<void>;
  clearError: () => void;
}

const defaultState: SettingsState = {
  // App Settings
  themeMode: APP_DEFAULTS.themeMode,
  language: APP_DEFAULTS.language,
  notificationsEnabled: APP_DEFAULTS.notificationsEnabled,
  
  // User Session
  currentUserUuid: APP_DEFAULTS.currentUserUuid,
  
  // UI State
  isLoading: true,
  error: null,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

// Validation functions
const isValidThemeMode = (value: string): value is ThemeMode => {
  return ['light', 'dark', 'automatic'].includes(value);
};

const isValidLanguage = (value: string): boolean => {
  return ['en', 'zh'].includes(value);
};

const isValidBoolean = (value: string): boolean => {
  return value === 'true' || value === 'false';
};

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [state, setState] = useState<SettingsState>(defaultState);
  const { get, set, remove, clear } = useAsyncStorage();

  // Initialize defaults and load settings on mount
  useEffect(() => {
    loadAllSettings();
  }, []);

  // Simple initialization function
  const initializeDefaults = async () => {
    try {
      console.log('🔧 Initializing app defaults...');
      
      const defaultSettings = {
        [STORAGE_KEYS.THEME_MODE]: APP_DEFAULTS.themeMode,
        [STORAGE_KEYS.LANGUAGE]: APP_DEFAULTS.language,
        [STORAGE_KEYS.NOTIFICATIONS_ENABLED]: APP_DEFAULTS.notificationsEnabled.toString(),
        [STORAGE_KEYS.CURRENT_USER_UUID]: APP_DEFAULTS.currentUserUuid || '',
      };

      for (const [key, value] of Object.entries(defaultSettings)) {
        const existing = await get(key);
        if (existing === null) {
          await set(key, value);
          console.log(`✅ Set default for ${key}: ${value}`);
        }
      }
      
      console.log('✅ App defaults initialized');
    } catch (error) {
      console.error('❌ Failed to initialize defaults:', error);
    }
  };

  const loadAllSettings = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Initialize defaults first
      await initializeDefaults();
      
      // Load all settings in parallel
      const [
        themeModeRaw,
        languageRaw,
        notificationsEnabledRaw,
        currentUserUuid,
      ] = await Promise.all([
        get(STORAGE_KEYS.THEME_MODE),
        get(STORAGE_KEYS.LANGUAGE),
        get(STORAGE_KEYS.NOTIFICATIONS_ENABLED),
        get(STORAGE_KEYS.CURRENT_USER_UUID),
      ]);
      
      // Parse and validate values
      const themeMode = themeModeRaw && isValidThemeMode(themeModeRaw) 
        ? themeModeRaw 
        : APP_DEFAULTS.themeMode;
      
      const language = languageRaw && isValidLanguage(languageRaw)
        ? languageRaw
        : APP_DEFAULTS.language;
      
      const notificationsEnabled = notificationsEnabledRaw && isValidBoolean(notificationsEnabledRaw)
        ? notificationsEnabledRaw === 'true'
        : APP_DEFAULTS.notificationsEnabled;
      
      setState(prev => ({
        ...prev,
        themeMode,
        language,
        notificationsEnabled,
        currentUserUuid,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Failed to load settings:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load settings',
      }));
    }
  };

  // App Settings Actions
  const setThemeMode = async (themeMode: ThemeMode) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await set(STORAGE_KEYS.THEME_MODE, themeMode);
      setState(prev => ({ ...prev, themeMode }));
    } catch (error) {
      console.error('Failed to save theme mode:', error);
      setState(prev => ({ ...prev, error: 'Failed to save theme preference' }));
      throw error;
    }
  };

  const setLanguage = async (language: string) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await set(STORAGE_KEYS.LANGUAGE, language);
      setState(prev => ({ ...prev, language }));
    } catch (error) {
      console.error('Failed to save language:', error);
      setState(prev => ({ ...prev, error: 'Failed to save language preference' }));
      throw error;
    }
  };

  const setNotificationsEnabled = async (enabled: boolean) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await set(STORAGE_KEYS.NOTIFICATIONS_ENABLED, enabled.toString());
      setState(prev => ({ ...prev, notificationsEnabled: enabled }));
    } catch (error) {
      console.error('Failed to save notifications setting:', error);
      setState(prev => ({ ...prev, error: 'Failed to save notifications setting' }));
      throw error;
    }
  };

  // User Session Actions
  const setCurrentUserUuid = async (userUuid: string | null) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      if (userUuid) {
        await set(STORAGE_KEYS.CURRENT_USER_UUID, userUuid);
      } else {
        await remove(STORAGE_KEYS.CURRENT_USER_UUID);
      }
      setState(prev => ({ ...prev, currentUserUuid: userUuid }));
    } catch (error) {
      console.error('Failed to save current user UUID:', error);
      setState(prev => ({ ...prev, error: 'Failed to save current user UUID' }));
      throw error;
    }
  };

  const clearCurrentUserUuid = async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await remove(STORAGE_KEYS.CURRENT_USER_UUID);
      setState(prev => ({ ...prev, currentUserUuid: null }));
    } catch (error) {
      console.error('Failed to clear current user UUID:', error);
      setState(prev => ({ ...prev, error: 'Failed to clear current user UUID' }));
      throw error;
    }
  };

  // Utility Actions
  const refreshAllSettings = async () => {
    await loadAllSettings();
  };

  const clearAllSettings = async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await clear();
      setState(prev => ({ ...prev, ...defaultState, isLoading: false }));
    } catch (error) {
      console.error('Failed to clear all settings:', error);
      setState(prev => ({ ...prev, error: 'Failed to clear all settings' }));
      throw error;
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: SettingsContextType = {
    ...state,
    setThemeMode,
    setLanguage,
    setNotificationsEnabled,
    setCurrentUserUuid,
    clearCurrentUserUuid,
    refreshAllSettings,
    clearAllSettings,
    clearError,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 