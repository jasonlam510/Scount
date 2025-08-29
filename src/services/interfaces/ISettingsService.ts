import { 
  AppSettings, 
  CreateSettingsRequest, 
  UpdateSettingsRequest,
  NotificationSettings
} from '../types/app';
import { 
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../types/categories';
import { 
  Subcategory,
  CreateSubcategoryRequest,
  UpdateSubcategoryRequest
} from '../types/subcategories';
import { 
  Tag,
  CreateTagRequest,
  UpdateTagRequest
} from '../types/tags';

export interface ISettingsService {
  // App settings
  getSettings(): Promise<AppSettings | null>;
  createSettings(settings: CreateSettingsRequest): Promise<AppSettings>;
  updateSettings(id: string, updates: UpdateSettingsRequest): Promise<AppSettings>;
  deleteSettings(id: string): Promise<void>;
  
  // Specific settings
  getThemeMode(): Promise<'light' | 'dark' | 'automatic'>;
  setThemeMode(mode: 'light' | 'dark' | 'automatic'): Promise<void>;
  
  getLanguage(): Promise<string>;
  setLanguage(language: string): Promise<void>;
  
  getNotificationsEnabled(): Promise<boolean>;
  setNotificationsEnabled(enabled: boolean): Promise<void>;
  
  getCurrency(): Promise<string>;
  setCurrency(currency: string): Promise<void>;
  
  getTimezone(): Promise<string>;
  setTimezone(timezone: string): Promise<void>;
  
  // Notification settings
  getNotificationSettings(): Promise<NotificationSettings>;
  updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings>;
  
  // Category management
  getCategories(type?: 'expense' | 'income' | 'transfer'): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | null>;
  createCategory(category: CreateCategoryRequest): Promise<Category>;
  updateCategory(id: string, updates: UpdateCategoryRequest): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  
  // Subcategory management
  getSubcategories(categoryId?: string, type?: 'expense' | 'income' | 'transfer'): Promise<Subcategory[]>;
  getSubcategoryById(id: string): Promise<Subcategory | null>;
  createSubcategory(subcategory: CreateSubcategoryRequest): Promise<Subcategory>;
  updateSubcategory(id: string, updates: UpdateSubcategoryRequest): Promise<Subcategory>;
  deleteSubcategory(id: string): Promise<void>;
  
  // Tag management
  getTags(): Promise<Tag[]>;
  getTagById(id: string): Promise<Tag | null>;
  createTag(tag: CreateTagRequest): Promise<Tag>;
  updateTag(id: string, updates: UpdateTagRequest): Promise<Tag>;
  deleteTag(id: string): Promise<void>;
  
  // Settings validation
  validateSettings(settings: Partial<AppSettings>): Promise<boolean>;
  
  // Settings backup and restore
  exportSettings(): Promise<AppSettings>;
  importSettings(settings: AppSettings): Promise<void>;
  
  // Settings reset
  resetToDefaults(): Promise<void>;
  
  // Real-time subscriptions (for future sync)
  subscribeToSettingsChanges(callback: (settings: AppSettings) => void): () => void;
  subscribeToThemeChanges(callback: (themeMode: 'light' | 'dark' | 'automatic') => void): () => void;
  subscribeToCategoryChanges(callback: (categories: Category[]) => void): () => void;
  subscribeToNotificationChanges(callback: (notifications: NotificationSettings) => void): () => void;
}
