import { useColorScheme } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';

export type ThemeMode = 'light' | 'dark' | 'automatic';

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  success: string;
  danger: string;
}

const lightColors: ThemeColors = {
  background: '#f5f5f5',
  surface: '#ffffff',
  primary: '#007AFF',
  secondary: '#8e8e93',
  text: '#333333',
  textSecondary: '#666666',
  border: '#dddddd',
  accent: '#007AFF',
  success: '#34c759',
  danger: '#ff3b30',
};

const darkColors: ThemeColors = {
  background: '#000000',
  surface: '#1c1c1e',
  primary: '#007AFF',
  secondary: '#8e8e93',
  text: '#ffffff',
  textSecondary: '#8e8e93',
  border: '#3a3a3c',
  accent: '#007AFF',
  success: '#34c759',
  danger: '#ff3b30',
};

// Future theme examples - you can add more themes here
const blueColors: ThemeColors = {
  background: '#f0f8ff',
  surface: '#ffffff',
  primary: '#0066cc',
  secondary: '#4a90e2',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#cce0ff',
  accent: '#0066cc',
  success: '#28a745',
  danger: '#dc3545',
};

const greenColors: ThemeColors = {
  background: '#f0fff0',
  surface: '#ffffff',
  primary: '#28a745',
  secondary: '#6c757d',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#d4edda',
  accent: '#28a745',
  success: '#28a745',
  danger: '#dc3545',
};

export const useTheme = () => {
  const { themeMode, setThemeMode, isLoading } = useSettings();
  const systemColorScheme = useColorScheme();

  // Determine if dark mode should be active
  const isDark = themeMode === 'automatic' 
    ? systemColorScheme === 'dark'
    : themeMode === 'dark';

  // Get the appropriate colors based on the current theme
  const getColors = (): ThemeColors => {
    if (isDark) {
      return darkColors;
    }
    return lightColors;
    // Future: Add more theme options here
    // switch (themeMode) {
    //   case 'blue': return blueColors;
    //   case 'green': return greenColors;
    //   default: return isDark ? darkColors : lightColors;
    // }
  };

  const colors = getColors();

  return {
    themeMode,
    isDark,
    setThemeMode,
    colors,
    isLoading,
  };
}; 