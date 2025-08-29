import { ISettingsService } from '../../interfaces/ISettingsService';
import { 
  AppSettings, 
  CreateSettingsRequest, 
  UpdateSettingsRequest,
  NotificationSettings
} from '../../types/app';
import { 
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../../types/categories';
import { 
  Subcategory,
  CreateSubcategoryRequest,
  UpdateSubcategoryRequest
} from '../../types/subcategories';
import { 
  Tag,
  CreateTagRequest,
  UpdateTagRequest
} from '../../types/tags';
import { mockAppSettings, mockSettingsByUser, mockNotificationSettings } from '../data/settings';

export class MockSettingsService implements ISettingsService {
  private settings: { [userId: string]: AppSettings } = { ...mockSettingsByUser };
  private notificationSettings: { [userId: string]: NotificationSettings } = {};
  private settingsListeners: { [userId: string]: ((settings: AppSettings) => void)[] } = {};
  private themeListeners: { [userId: string]: ((themeMode: 'light' | 'dark' | 'automatic') => void)[] } = {};
  private notificationListeners: { [userId: string]: ((notifications: NotificationSettings) => void)[] } = {};

  constructor() {
    this.loadInitialData();
  }

  // App settings
  async getSettings(): Promise<AppSettings | null> {
    await this.simulateDelay();
    // For now, return current user's settings
    return this.settings['1'] || null;
  }

  async createSettings(settings: CreateSettingsRequest): Promise<AppSettings> {
    await this.simulateDelay();
    const newSettings: AppSettings = {
      ...settings,
      id: this.generateId(),
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    
    this.settings['1'] = newSettings;
    this.notifySettingsListeners('1', newSettings);
    return newSettings;
  }

  async updateSettings(id: string, updates: UpdateSettingsRequest): Promise<AppSettings> {
    await this.simulateDelay();
    const userId = '1'; // Current user
    const currentSettings = this.settings[userId];
    if (!currentSettings) throw new Error('Settings not found');
    
    const oldSettings = { ...currentSettings };
    const updatedSettings: AppSettings = { 
      ...currentSettings, 
      ...updates,
      updated_at: Date.now()
    };
    
    this.settings[userId] = updatedSettings;
    
    // Notify listeners
    this.notifySettingsListeners(userId, updatedSettings);
    
    // If theme changed, notify theme listeners
    if (updates.themeMode && updates.themeMode !== oldSettings.themeMode) {
      this.notifyThemeListeners(userId, updates.themeMode);
    }
    
    return updatedSettings;
  }

  async deleteSettings(id: string): Promise<void> {
    await this.simulateDelay();
    const userId = '1'; // Current user
    if (this.settings[userId]) {
      // Hard delete for mock
      delete this.settings[userId];
    }
  }

  // Specific settings
  async getThemeMode(): Promise<'light' | 'dark' | 'automatic'> {
    await this.simulateDelay();
    const settings = await this.getSettings();
    return settings?.themeMode || 'automatic';
  }

  async setThemeMode(mode: 'light' | 'dark' | 'automatic'): Promise<void> {
    await this.simulateDelay();
    await this.updateSettings('1', { id: '1', themeMode: mode });
  }

  async getLanguage(): Promise<string> {
    await this.simulateDelay();
    const settings = await this.getSettings();
    return settings?.language || 'en';
  }

  async setLanguage(language: string): Promise<void> {
    await this.simulateDelay();
    await this.updateSettings('1', { id: '1', language });
  }

  async getNotificationsEnabled(): Promise<boolean> {
    await this.simulateDelay();
    const settings = await this.getSettings();
    return settings?.notificationsEnabled || false;
  }

  async setNotificationsEnabled(enabled: boolean): Promise<void> {
    await this.simulateDelay();
    await this.updateSettings('1', { id: '1', notificationsEnabled: enabled });
  }

  async getCurrency(): Promise<string> {
    await this.simulateDelay();
    const settings = await this.getSettings();
    return settings?.currency || 'HK$';
  }

  async setCurrency(currency: string): Promise<void> {
    await this.simulateDelay();
    await this.updateSettings('1', { id: '1', currency });
  }

  async getTimezone(): Promise<string> {
    await this.simulateDelay();
    const settings = await this.getSettings();
    return settings?.timezone || 'Asia/Hong_Kong';
  }

  async setTimezone(timezone: string): Promise<void> {
    await this.simulateDelay();
    await this.updateSettings('1', { id: '1', timezone });
  }

  // Notification settings
  async getNotificationSettings(): Promise<NotificationSettings> {
    await this.simulateDelay();
    const userId = '1'; // Current user
    return this.notificationSettings[userId] || { ...mockNotificationSettings };
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    await this.simulateDelay();
    const userId = '1'; // Current user
    const currentSettings = this.notificationSettings[userId] || { ...mockNotificationSettings };
    
    this.notificationSettings[userId] = { 
      ...currentSettings, 
      ...settings 
    };
    
    return this.notificationSettings[userId];
  }

  // Category management
  async getCategories(type?: 'expense' | 'income' | 'transfer'): Promise<Category[]> {
    await this.simulateDelay();
    // Mock implementation - return empty array for now
    return [];
  }

  async getCategoryById(id: string): Promise<Category | null> {
    await this.simulateDelay();
    // Mock implementation
    return null;
  }

  async createCategory(category: any): Promise<Category> {
    await this.simulateDelay();
    // Mock implementation
    return {
      id: this.generateId(),
      name: category.name,
      type: category.type,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
  }

  async updateCategory(id: string, updates: any): Promise<Category> {
    await this.simulateDelay();
    // Mock implementation
    return {
      id,
      name: updates.name || 'Updated Category',
      type: updates.type || 'expense',
      created_at: Date.now(),
      updated_at: Date.now(),
    };
  }

  async deleteCategory(id: string): Promise<void> {
    await this.simulateDelay();
    // Mock implementation
    console.log(`Mock: Deleting category ${id}`);
  }

  // Subcategory management
  async getSubcategories(categoryId?: string, type?: 'expense' | 'income' | 'transfer'): Promise<Subcategory[]> {
    await this.simulateDelay();
    // Mock implementation - return empty array for now
    return [];
  }

  async getSubcategoryById(id: string): Promise<Subcategory | null> {
    await this.simulateDelay();
    // Mock implementation
    return null;
  }

  async createSubcategory(subcategory: any): Promise<Subcategory> {
    await this.simulateDelay();
    // Mock implementation
    return {
      id: this.generateId(),
      category_id: subcategory.category_id,
      name: subcategory.name,
      type: subcategory.type,
      icon: subcategory.icon,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
  }

  async updateSubcategory(id: string, updates: any): Promise<Subcategory> {
    await this.simulateDelay();
    // Mock implementation
    return {
      id,
      category_id: updates.category_id || '1',
      name: updates.name || 'Updated Subcategory',
      type: updates.type || 'expense',
      icon: updates.icon,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
  }

  async deleteSubcategory(id: string): Promise<void> {
    await this.simulateDelay();
    // Mock implementation
    console.log(`Mock: Deleting subcategory ${id}`);
  }

  // Tag management
  async getTags(): Promise<Tag[]> {
    await this.simulateDelay();
    // Mock implementation - return empty array for now
    return [];
  }

  async getTagById(id: string): Promise<Tag | null> {
    await this.simulateDelay();
    // Mock implementation
    return null;
  }

  async createTag(tag: any): Promise<Tag> {
    await this.simulateDelay();
    // Mock implementation
    return {
      id: this.generateId(),
      name: tag.name,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
  }

  async updateTag(id: string, updates: any): Promise<Tag> {
    await this.simulateDelay();
    // Mock implementation
    return {
      id,
      name: updates.name || 'Updated Tag',
      created_at: Date.now(),
      updated_at: Date.now(),
    };
  }

  async deleteTag(id: string): Promise<void> {
    await this.simulateDelay();
    // Mock implementation
    console.log(`Mock: Deleting tag ${id}`);
  }

  // Settings validation
  async validateSettings(settings: Partial<AppSettings>): Promise<boolean> {
    await this.simulateDelay();
    
    // Basic validation
    if (settings.themeMode && !['light', 'dark', 'automatic'].includes(settings.themeMode)) {
      return false;
    }
    
    if (settings.language && !['en', 'zh'].includes(settings.language)) {
      return false;
    }
    
    if (settings.currency && !['HK$', 'USD', 'EUR', 'JPY'].includes(settings.currency)) {
      return false;
    }
    
    return true;
  }

  // Real-time subscriptions (for future sync)
  subscribeToSettingsChanges(callback: (settings: AppSettings) => void) {
    // For now, subscribe to current user's settings
    const currentUserId = '1'; // Jason Lam
    if (!this.settingsListeners[currentUserId]) {
      this.settingsListeners[currentUserId] = [];
    }
    this.settingsListeners[currentUserId].push(callback);
    
    // Initial call
    const currentSettings = this.settings[currentUserId];
    if (currentSettings) callback(currentSettings);
    
    return () => {
      const index = this.settingsListeners[currentUserId].indexOf(callback);
      if (index > -1) {
        this.settingsListeners[currentUserId].splice(index, 1);
      }
    };
  }

  subscribeToThemeChanges(callback: (themeMode: 'light' | 'dark' | 'automatic') => void) {
    // For now, subscribe to current user's theme changes
    const currentUserId = '1'; // Jason Lam
    if (!this.themeListeners[currentUserId]) {
      this.themeListeners[currentUserId] = [];
    }
    this.themeListeners[currentUserId].push(callback);
    
    // Initial call
    const currentSettings = this.settings[currentUserId];
    if (currentSettings) callback(currentSettings.themeMode);
    
    return () => {
      const index = this.themeListeners[currentUserId].indexOf(callback);
      if (index > -1) {
        this.themeListeners[currentUserId].splice(index, 1);
      }
    };
  }

  subscribeToCategoryChanges(callback: (categories: Category[]) => void) {
    // Mock implementation
    callback([]);
    return () => {}; // No-op unsubscribe
  }

  // Settings backup and restore
  async exportSettings(): Promise<AppSettings> {
    await this.simulateDelay();
    const currentUserId = '1'; // Jason Lam
    const currentSettings = this.settings[currentUserId];
    if (!currentSettings) {
      throw new Error('No settings found for current user');
    }
    return currentSettings;
  }

  async importSettings(settings: AppSettings): Promise<void> {
    await this.simulateDelay();
    const currentUserId = '1'; // Jason Lam
    this.settings[currentUserId] = {
      ...settings,
      updated_at: Date.now()
    };
    this.notifySettingsListeners(currentUserId, this.settings[currentUserId]);
  }

  // Settings reset
  async resetToDefaults(): Promise<void> {
    await this.simulateDelay();
    const currentUserId = '1'; // Jason Lam
    const defaultSettings: AppSettings = {
      id: this.generateId(),
      themeMode: 'automatic',
      language: 'en',
      currency: 'HK$',
      timezone: 'Asia/Hong_Kong',
      notificationsEnabled: true,
      created_at: Date.now(),
      updated_at: Date.now()
    };
    
    this.settings[currentUserId] = defaultSettings;
    this.notifySettingsListeners(currentUserId, defaultSettings);
  }

  // Notification changes subscription
  subscribeToNotificationChanges(callback: (notifications: NotificationSettings) => void) {
    // Mock implementation
    const currentUserId = '1'; // Jason Lam
    if (!this.notificationListeners[currentUserId]) {
      this.notificationListeners[currentUserId] = [];
    }
    this.notificationListeners[currentUserId].push(callback);
    
    // Initial call
    const currentUserNotifications = this.notificationSettings[currentUserId] || { ...mockNotificationSettings };
    callback(currentUserNotifications);
    
    return () => {
      const index = this.notificationListeners[currentUserId].indexOf(callback);
      if (index > -1) {
        this.notificationListeners[currentUserId].splice(index, 1);
      }
    };
  }

  private notifySettingsListeners(userId: string, settings: AppSettings) {
    if (this.settingsListeners[userId]) {
      this.settingsListeners[userId].forEach(callback => callback(settings));
    }
  }

  private notifyThemeListeners(userId: string, themeMode: 'light' | 'dark' | 'automatic') {
    if (this.themeListeners[userId]) {
      this.themeListeners[userId].forEach(callback => callback(themeMode));
    }
  }

  private loadInitialData() {
    console.log('MockSettingsService initialized');
    console.log(`Loaded settings for ${Object.keys(this.settings).length} users`);
  }

  private generateId(): string {
    return `mock_settings_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async simulateDelay(ms: number = 100): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}
