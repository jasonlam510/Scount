import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode } from '../hooks/useTheme';
import {
  getThemeMode,
  setThemeMode as saveThemeMode,
  getLanguage,
  setLanguage as saveLanguage,
  getAllPreferences,
  initializeDefaults,
  Preferences,
} from '../services/PreferencesService';

interface PreferencesState {
  themeMode: ThemeMode;
  language: string;
  isLoading: boolean;
  error: string | null;
}

interface PreferencesContextType extends PreferencesState {
  setThemeMode: (themeMode: ThemeMode) => Promise<void>;
  setLanguage: (language: string) => Promise<void>;
  refreshPreferences: () => Promise<void>;
  clearError: () => void;
}

const defaultState: PreferencesState = {
  themeMode: 'automatic',
  language: 'en',
  isLoading: true,
  error: null,
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

interface PreferencesProviderProps {
  children: ReactNode;
}

export const PreferencesProvider: React.FC<PreferencesProviderProps> = ({ children }) => {
  const [state, setState] = useState<PreferencesState>(defaultState);

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Initialize defaults if needed
      await initializeDefaults();
      
      // Load all preferences
      const preferences = await getAllPreferences();
      
      setState(prev => ({
        ...prev,
        themeMode: preferences.themeMode,
        language: preferences.language,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Failed to load preferences:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load preferences',
      }));
    }
  };

  const setThemeMode = async (themeMode: ThemeMode) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      // Save to storage
      await saveThemeMode(themeMode);
      
      // Update state
      setState(prev => ({ ...prev, themeMode }));
    } catch (error) {
      console.error('Failed to save theme mode:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to save theme preference' 
      }));
      throw error;
    }
  };

  const setLanguage = async (language: string) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      // Save to storage
      await saveLanguage(language);
      
      // Update state
      setState(prev => ({ ...prev, language }));
    } catch (error) {
      console.error('Failed to save language:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to save language preference' 
      }));
      throw error;
    }
  };

  const refreshPreferences = async () => {
    await loadPreferences();
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: PreferencesContextType = {
    ...state,
    setThemeMode,
    setLanguage,
    refreshPreferences,
    clearError,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = (): PreferencesContextType => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}; 