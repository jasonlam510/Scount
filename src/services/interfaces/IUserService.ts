import { 
  Profile, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UpdatePreferencesRequest,
  UserPreferences
} from '../types/profiles';

export interface IUserService {
  // User management
  getCurrentUser(): Promise<Profile | null>;
  getUserById(id: string): Promise<Profile | null>;
  getUserByUuid(uuid: string): Promise<Profile | null>;
  createUser(user: CreateUserRequest): Promise<Profile>;
  updateUser(id: string, updates: UpdateUserRequest): Promise<Profile>;
  deleteUser(id: string): Promise<void>;
  
  // User preferences (stored separately from user table)
  getUserPreferences(userId: string): Promise<UserPreferences>;
  updateUserPreferences(request: UpdatePreferencesRequest): Promise<UserPreferences>;
  
  // User search and filtering
  searchUsers(query: string): Promise<Profile[]>;
  getUsersByGroup(groupId: string): Promise<Profile[]>;
  getActiveUsers(): Promise<Profile[]>;
  
  // Authentication (future)
  login(email: string, password: string): Promise<{ user: Profile; token: string }>;
  logout(): Promise<void>;
  refreshToken(): Promise<{ user: Profile; token: string }>;
  
  // Profile management
  updateAvatar(userId: string, avatarUrl: string): Promise<Profile>;
  updateNickname(userId: string, nickname: string): Promise<Profile>;
  
  // Real-time subscriptions (for future sync)
  subscribeToUserChanges(userId: string, callback: (user: Profile) => void): () => void;
  subscribeToPreferencesChanges(userId: string, callback: (preferences: UserPreferences) => void): () => void;
}
