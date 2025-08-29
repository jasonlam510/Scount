import { IUserService } from '../../interfaces/IUserService';
import { 
  Profile, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UpdatePreferencesRequest,
  UserPreferences
} from '../../types/profiles';
import { 
  Group,
  CreateGroupRequest,
  UpdateGroupRequest
} from '../../types/groups';
import { 
  Participant,
  CreateParticipantRequest,
  UpdateParticipantRequest
} from '../../types/participants';
import { mockUsers } from '../data/users';
import { mockUserPreferencesByUser } from '../data/user-preferences';

export class MockUserService implements IUserService {
  private users: Profile[] = [...mockUsers];
  private currentUser: Profile | null = mockUsers[0]; // Jason Lam
  private userListeners: { [userId: string]: ((user: Profile) => void)[] } = {};
  private preferencesListeners: { [userId: string]: ((preferences: UserPreferences) => void)[] } = {};
  private groupListeners: { [groupId: string]: ((group: Group) => void)[] } = {};

  constructor() {
    this.loadInitialData();
  }

  // Real-time subscriptions (for future sync)
  subscribeToUserChanges(userId: string, callback: (user: Profile) => void) {
    if (!this.userListeners[userId]) {
      this.userListeners[userId] = [];
    }
    this.userListeners[userId].push(callback);
    
    // Initial call
    const user = this.users.find(u => u.id === userId);
    if (user) callback(user);
    
    return () => {
      const index = this.userListeners[userId].indexOf(callback);
      if (index > -1) {
        this.userListeners[userId].splice(index, 1);
      }
    };
  }

  subscribeToPreferencesChanges(userId: string, callback: (preferences: UserPreferences) => void) {
    if (!this.preferencesListeners[userId]) {
      this.preferencesListeners[userId] = [];
    }
    this.preferencesListeners[userId].push(callback);
    
    // Initial call
    const userPreferences = mockUserPreferencesByUser[userId];
    if (userPreferences) callback(userPreferences);
    
    return () => {
      const index = this.preferencesListeners[userId].indexOf(callback);
      if (index > -1) {
        this.preferencesListeners[userId].splice(index, 1);
      }
    };
  }

  subscribeToGroupChanges(groupId: string, callback: (group: Group) => void) {
    if (!this.groupListeners[groupId]) {
      this.groupListeners[groupId] = [];
    }
    this.groupListeners[groupId].push(callback);
    
    return () => {
      const index = this.groupListeners[groupId].indexOf(callback);
      if (index > -1) {
        this.groupListeners[groupId].splice(index, 1);
      }
    };
  }

  private notifyUserListeners(userId: string, user: Profile) {
    if (this.userListeners[userId]) {
      this.userListeners[userId].forEach(callback => callback(user));
    }
  }

  private notifyPreferencesListeners(userId: string, preferences: UserPreferences) {
    if (this.preferencesListeners[userId]) {
      this.preferencesListeners[userId].forEach(callback => callback(preferences));
    }
  }

  async getCurrentUser(): Promise<Profile | null> {
    await this.simulateDelay();
    return this.currentUser;
  }

  async getUserById(id: string): Promise<Profile | null> {
    await this.simulateDelay();
    return this.users.find(u => u.id === id) || null;
  }

  async getUserByUuid(uuid: string): Promise<Profile | null> {
    await this.simulateDelay();
    return this.users.find(u => u.uuid === uuid) || null;
  }

  async createUser(user: CreateUserRequest): Promise<Profile> {
    await this.simulateDelay();
    const newUser: Profile = {
      ...user,
      id: this.generateId(),
      avatar: user.avatar || `https://via.placeholder.com/80x80?text=${user.nickname}`,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    
    this.users.push(newUser);
    this.notifyUserListeners(newUser.id, newUser);
    return newUser;
  }

  async updateUser(id: string, updates: UpdateUserRequest): Promise<Profile> {
    await this.simulateDelay();
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    const oldUser = { ...this.users[index] };
    this.users[index] = { 
      ...this.users[index], 
      ...updates,
      updated_at: Date.now()
    };
    
    // Update current user if it's the same user
    if (this.currentUser && this.currentUser.id === id) {
      this.currentUser = this.users[index];
    }
    
    this.notifyUserListeners(id, this.users[index]);
    return this.users[index];
  }

  async deleteUser(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    // Remove from current user if it's the same user
    if (this.currentUser && this.currentUser.id === id) {
      this.currentUser = null;
    }
    
    // Hard delete for mock
    this.users.splice(index, 1);
    
    this.notifyUserListeners(id, this.users[index] || { id, uuid: '', name: '', created_at: 0, updated_at: 0 });
  }

  async getUserPreferences(userId: string): Promise<UserPreferences> {
    await this.simulateDelay();
    const userPreferences = mockUserPreferencesByUser[userId];
    if (!userPreferences) throw new Error('User preferences not found');
    
    return userPreferences;
  }

  async updateUserPreferences(request: UpdatePreferencesRequest): Promise<UserPreferences> {
    await this.simulateDelay();
    const { userId, preferences } = request;
    const currentPreferences = mockUserPreferencesByUser[userId];
    if (!currentPreferences) throw new Error('User preferences not found');
    
    const updatedPreferences: UserPreferences = { 
      ...currentPreferences, 
      ...preferences 
    };
    
    // Update mock data
    mockUserPreferencesByUser[userId] = updatedPreferences;
    
    this.notifyPreferencesListeners(userId, updatedPreferences);
    return updatedPreferences;
  }

  async login(email: string, password: string): Promise<{ user: Profile; token: string }> {
    await this.simulateDelay();
    const user = this.users.find(u => u.email === email);
    if (!user) throw new Error('Invalid credentials');
    
    // Mock authentication - in real app, validate password
    this.currentUser = user;
    
    return {
      user,
      token: `mock_token_${user.id}_${Date.now()}`
    };
  }

  async logout(): Promise<void> {
    await this.simulateDelay();
    this.currentUser = null;
  }

  async refreshToken(): Promise<{ user: Profile; token: string }> {
    await this.simulateDelay();
    if (!this.currentUser) throw new Error('No user logged in');
    
    return {
      user: this.currentUser,
      token: `mock_refresh_token_${this.currentUser.id}_${Date.now()}`
    };
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<Profile> {
    await this.simulateDelay();
    return this.updateUser(userId, { id: userId, avatar: avatarUrl });
  }

  async updateNickname(userId: string, nickname: string): Promise<Profile> {
    await this.simulateDelay();
    return this.updateUser(userId, { id: userId, nickname });
  }

  // Group management
  async getUserGroups(userId: string): Promise<Group[]> {
    await this.simulateDelay();
    // Mock implementation - return groups where user is a participant
    return [];
  }

  async createGroup(group: any): Promise<Group> {
    await this.simulateDelay();
    const newGroup: Group = {
      ...group,
      id: this.generateId(),
      is_archived: false,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    
    return newGroup;
  }

  async updateGroup(id: string, updates: any): Promise<Group> {
    await this.simulateDelay();
    // Mock implementation
    return {
      id,
      title: 'Updated Group',
      icon: '🎯',
      currency: 'HK$',
      is_archived: false,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
  }

  async deleteGroup(id: string): Promise<void> {
    await this.simulateDelay();
    // Mock implementation
    console.log(`Mock: Deleting group ${id}`);
  }

  // Participant management
  async getGroupParticipants(groupId: string): Promise<Participant[]> {
    await this.simulateDelay();
    // Mock implementation
    return [];
  }

  async addParticipantToGroup(participant: any): Promise<Participant> {
    await this.simulateDelay();
    const newParticipant: Participant = {
      ...participant,
      id: this.generateId(),
      is_active: true,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    
    return newParticipant;
  }

  async updateParticipant(id: string, updates: any): Promise<Participant> {
    await this.simulateDelay();
    // Mock implementation
    return {
      id,
      group_id: '1',
      user_id: '1',
      is_active: true,
      display_name: 'Updated Participant',
      created_at: Date.now(),
      updated_at: Date.now(),
    };
  }

  async removeParticipantFromGroup(groupId: string, userId: string): Promise<void> {
    await this.simulateDelay();
    // Mock implementation
    console.log(`Mock: Removing participant ${userId} from group ${groupId}`);
  }

  // User search and filtering
  async searchUsers(query: string): Promise<Profile[]> {
    await this.simulateDelay();
    const lowercaseQuery = query.toLowerCase();
    return this.users.filter(user => 
      user.name.toLowerCase().includes(lowercaseQuery) ||
      (user.nickname && user.nickname.toLowerCase().includes(lowercaseQuery)) ||
      (user.email && user.email.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getUsersByGroup(groupId: string): Promise<Profile[]> {
    await this.simulateDelay();
    // Mock implementation - in real app this would query participants table
    // For now, return all users as a mock
    return this.users;
  }

  async getActiveUsers(): Promise<Profile[]> {
    await this.simulateDelay();
    // Mock implementation - in real app this would filter by active status
    // For now, return all users as a mock
    return this.users;
  }

  private loadInitialData() {
    console.log(`MockUserService initialized with ${this.users.length} users`);
  }

  private generateId(): string {
    return `mock_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async simulateDelay(ms: number = 100): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}
