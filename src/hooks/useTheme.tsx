import { useColorScheme } from 'react-native';
import { useAppSettingsStore } from '../zustand';
import { ThemeColors, colorThemes } from '../constants';

export type ThemeMode = 'light' | 'dark' | 'automatic';

export const useTheme = () => {
  const { themeMode, setThemeMode } = useAppSettingsStore();
  const systemColorScheme = useColorScheme();

  // Determine if dark mode should be active
  const isDark = themeMode === 'automatic' 
    ? systemColorScheme === 'dark'
    : themeMode === 'dark';

  // Get the appropriate colors based on the current theme
  const getColors = (): ThemeColors => {
    if (isDark) {
      return colorThemes.dark;
    }
    return colorThemes.light;
    
    // Future: Add more theme options here
    // switch (themeMode) {
    //   case 'blue': return colorThemes.blue;
    //   case 'green': return colorThemes.green;
    //   default: return isDark ? colorThemes.dark : colorThemes.light;
    // }
  };

  const colors = getColors();

  return {
    themeMode,
    isDark,
    setThemeMode,
    colors,
  };
}; 