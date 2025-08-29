// App settings and user preferences
// These are stored in AsyncStorage or your preferred storage

export interface AppSettings {
  id: string;
  themeMode: 'light' | 'dark' | 'automatic';
  language: string;
  notificationsEnabled: boolean;
  currency: string;
  timezone: string;
  created_at: number;
  updated_at: number;
}

export interface CreateSettingsRequest {
  themeMode: 'light' | 'dark' | 'automatic';
  language: string;
  notificationsEnabled: boolean;
  currency: string;
  timezone: string;
}

export interface UpdateSettingsRequest extends Partial<CreateSettingsRequest> {
  id: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  expenseReminders: boolean;
  budgetAlerts: boolean;
  weeklyReports: boolean;
}

