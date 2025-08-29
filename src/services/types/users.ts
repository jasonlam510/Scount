// User-related types
export interface User {
  id: string;
  uuid: string;
  name: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  created_at: number;
  updated_at: number;
}

export interface CreateUserRequest {
  uuid: string;
  name: string;
  nickname?: string;
  email?: string;
  avatar?: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: string;
}

export interface UserPreferences {
  themeMode: 'light' | 'dark' | 'automatic';
  language: string;
  notificationsEnabled: boolean;
  currency: string;
  timezone: string;
}

export interface UpdatePreferencesRequest {
  userId: string;
  preferences: Partial<UserPreferences>;
}
