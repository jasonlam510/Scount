// User interface is now defined in expense.ts to match WatermelonDB schema
// This file now contains user-related types and preferences

export interface UserPreferences {
  themeMode: 'light' | 'dark' | 'automatic';
  language: string;
  notificationsEnabled: boolean;
  currency: string;
  timezone: string;
  defaultPayer?: string;
  defaultCurrency?: string;
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

export interface UpdatePreferencesRequest {
  userId: string;
  preferences: Partial<UserPreferences>;
}

// Group-related types
export interface CreateGroupRequest {
  title: string;
  icon?: string;
  currency: string;
}

export interface UpdateGroupRequest extends Partial<CreateGroupRequest> {
  id: string;
}

export interface CreateParticipantRequest {
  group_id: string;
  user_id: string;
  display_name?: string;
}

export interface UpdateParticipantRequest extends Partial<CreateParticipantRequest> {
  id: string;
}
