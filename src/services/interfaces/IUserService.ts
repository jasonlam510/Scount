import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UpdatePreferencesRequest,
  UserPreferences
} from '../types/users';

export interface IUserService {
  // User management
  getCurrentUser(): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  getUserByUuid(uuid: string): Promise<User | null>;
  createUser(user: CreateUserRequest): Promise<User>;
  updateUser(id: string, updates: UpdateUserRequest): Promise<User>;
  deleteUser(id: string): Promise<void>;
  
  // User preferences (stored separately from user table)
  getUserPreferences(userId: string): Promise<UserPreferences>;
  updateUserPreferences(request: UpdatePreferencesRequest): Promise<UserPreferences>;
  
  // User search and filtering
  searchUsers(query: string): Promise<User[]>;
  getUsersByGroup(groupId: string): Promise<User[]>;
  getActiveUsers(): Promise<User[]>;
  
  // Authentication (future)
  login(email: string, password: string): Promise<{ user: User; token: string }>;
  logout(): Promise<void>;
  refreshToken(): Promise<{ user: User; token: string }>;
  
  // Profile management
  updateAvatar(userId: string, avatarUrl: string): Promise<User>;
  updateNickname(userId: string, nickname: string): Promise<User>;
  
  // Real-time subscriptions (for future sync)
  subscribeToUserChanges(userId: string, callback: (user: User) => void): () => void;
  subscribeToPreferencesChanges(userId: string, callback: (preferences: UserPreferences) => void): () => void;
}
