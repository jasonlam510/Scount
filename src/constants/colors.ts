// Theme color definitions
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

// Light theme colors
export const lightColors: ThemeColors = {
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

// Dark theme colors
export const darkColors: ThemeColors = {
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

// Export all color themes
export const colorThemes = {
  light: lightColors,
  dark: darkColors,
} as const;

// Export individual colors for direct use
export const colors = {
  // Primary colors
  primary: '#007AFF',
  secondary: '#8e8e93',
  accent: '#007AFF',
  
  // Status colors
  success: '#34c759',
  danger: '#ff3b30',
  warning: '#ff9500',
  info: '#007AFF',
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9f9f9',
    100: '#f2f2f2',
    200: '#e5e5e5',
    300: '#d1d1d1',
    400: '#b3b3b3',
    500: '#8e8e93',
    600: '#666666',
    700: '#4d4d4d',
    800: '#333333',
    900: '#1a1a1a',
  },
} as const;
