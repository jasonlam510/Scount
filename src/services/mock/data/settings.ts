import { AppSettings, NotificationSettings } from '../../types/app';

// Mock app settings for the current user
export const mockAppSettings: AppSettings = {
  id: '1',
  themeMode: 'automatic',
  language: 'en',
  notificationsEnabled: true,
  currency: 'HK$',
  timezone: 'Asia/Hong_Kong',
  created_at: Date.now() - 86400000 * 30,
  updated_at: Date.now()
};

// Mock notification settings
export const mockNotificationSettings: NotificationSettings = {
  pushEnabled: true,
  emailEnabled: false,
  expenseReminders: true,
  budgetAlerts: true,
  weeklyReports: false
};

// Mock app settings by user ID
export const mockSettingsByUser: { [userId: string]: AppSettings } = {
  '1': mockAppSettings, // Jason Lam
  '2': {
    id: '2',
    themeMode: 'light',
    language: 'zh',
    notificationsEnabled: false,
    currency: 'HK$',
    timezone: 'Asia/Hong_Kong',
    created_at: Date.now() - 86400000 * 25,
    updated_at: Date.now()
  },
  '3': {
    id: '3',
    themeMode: 'dark',
    language: 'en',
    notificationsEnabled: true,
    currency: 'USD',
    timezone: 'America/New_York',
    created_at: Date.now() - 86400000 * 20,
    updated_at: Date.now()
  }
};
