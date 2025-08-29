export interface Profile {
  id: string;
  uuid: string;
  name: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  created_at?: number;
  updated_at?: number;
}

export interface CreateUserRequest {
  name: string;
  nickname?: string;
  email?: string;
  avatar?: string;
}

export interface UpdateUserRequest {
  name?: string;
  nickname?: string;
  email?: string;
  avatar?: string;
}

export interface UpdatePreferencesRequest {
  themeMode?: string;
  language?: string;
  notificationsEnabled?: boolean;
}

export interface UserPreferences {
  themeMode: string;
  language: string;
  notificationsEnabled: boolean;
  currency: string;
}


