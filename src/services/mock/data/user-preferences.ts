import { UserPreferences } from '../../types/users';

// Mock user preferences data
export const mockUserPreferences: UserPreferences = {
  themeMode: 'automatic',
  language: 'en',
  notificationsEnabled: true,
  currency: 'HK$',
  timezone: 'Asia/Hong_Kong'
};

// Mock user preferences by user ID
export const mockUserPreferencesByUser: { [userId: string]: UserPreferences } = {
  '1': { // Jason Lam
    themeMode: 'automatic',
    language: 'en',
    notificationsEnabled: true,
    currency: 'HK$',
    timezone: 'Asia/Hong_Kong'
  },
  '2': { // Shirley
    themeMode: 'light',
    language: 'zh',
    notificationsEnabled: false,
    currency: 'HK$',
    timezone: 'Asia/Hong_Kong'
  },
  '3': { // Kim Kam
    themeMode: 'dark',
    language: 'en',
    notificationsEnabled: true,
    currency: 'USD',
    timezone: 'America/New_York'
  }
};

