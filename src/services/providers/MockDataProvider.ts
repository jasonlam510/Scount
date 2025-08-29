import { IDataProvider } from '../interfaces/IDataProvider';
import { MockExpenseService } from '../mock/services/MockExpenseService';
import { MockUserService } from '../mock/services/MockUserService';
import { MockSettingsService } from '../mock/services/MockSettingsService';
import { MockGroupService } from '../mock/services/MockGroupService';
import { MockCategoryService } from '../mock/services/MockCategoryService';

export class MockDataProvider implements IDataProvider {
  public expenses: MockExpenseService;
  public users: MockUserService;
  public settings: MockSettingsService;
  public groups: MockGroupService;
  public categories: MockCategoryService;

  private lastError: string | null = null;
  private lastSyncTime: Date | null = null;
  private connectionStatus: 'online' | 'offline' | 'connecting' = 'online';

  constructor() {
    this.expenses = new MockExpenseService();
    this.users = new MockUserService();
    this.settings = new MockSettingsService();
    this.groups = new MockGroupService();
    this.categories = new MockCategoryService();
  }

  async initialize(): Promise<void> {
    try {
      console.log('🔧 Initializing Mock Data Provider...');
      
      // Simulate initialization delay
      await this.simulateDelay(200);
      
      // Set initial sync time
      this.lastSyncTime = new Date();
      
      console.log('✅ Mock Data Provider initialized successfully');
    } catch (error) {
      this.lastError = `Failed to initialize: ${error}`;
      console.error('❌ Failed to initialize Mock Data Provider:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    try {
      console.log('🧹 Cleaning up Mock Data Provider...');
      
      // Simulate cleanup delay
      await this.simulateDelay(100);
      
      // Clear any listeners or subscriptions
      this.lastError = null;
      this.lastSyncTime = null;
      
      console.log('✅ Mock Data Provider cleaned up successfully');
    } catch (error) {
      console.error('❌ Failed to cleanup Mock Data Provider:', error);
      throw error;
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      // Check if all services are responding
      const [expensesHealthy, usersHealthy, settingsHealthy, groupsHealthy, categoriesHealthy] = await Promise.all([
        this.expenses.getTransactions().then(() => true).catch(() => false),
        this.users.getCurrentUser().then(() => true).catch(() => false),
        this.settings.getSettings().then(() => true).catch(() => false),
        this.groups.getGroups().then(() => true).catch(() => false),
        this.categories.getCategories().then(() => true).catch(() => false)
      ]);
      
      return expensesHealthy && usersHealthy && settingsHealthy && groupsHealthy && categoriesHealthy;
    } catch (error) {
      this.lastError = `Health check failed: ${error}`;
      return false;
    }
  }

  async getConnectionStatus(): Promise<'online' | 'offline' | 'connecting'> {
    // Mock connection status - always online for now
    return this.connectionStatus;
  }

  async sync(): Promise<void> {
    try {
      console.log('🔄 Starting mock data sync...');
      this.connectionStatus = 'connecting';
      
      // Simulate sync delay
      await this.simulateDelay(500);
      
      // Update sync time
      this.lastSyncTime = new Date();
      this.connectionStatus = 'online';
      
      console.log('✅ Mock data sync completed');
    } catch (error) {
      this.connectionStatus = 'offline';
      this.lastError = `Sync failed: ${error}`;
      console.error('❌ Mock data sync failed:', error);
      throw error;
    }
  }

  async getLastSyncTime(): Promise<Date | null> {
    return this.lastSyncTime;
  }

  async getLastError(): Promise<string | null> {
    return this.lastError;
  }

  async clearErrors(): Promise<void> {
    this.lastError = null;
  }

  // Mock database operations
  async getDatabaseInfo(): Promise<{ name: string; version: number; tables: string[] }> {
    return {
      name: 'MockDatabase',
      version: 1,
      tables: [
        'users',
        'user_preferences', 
        'groups',
        'participants',
        'categories',
        'subcategories',
        'tags',
        'transactions',
        'transaction_payers',
        'transaction_tags',
        'transaction_media',
        'settings'
      ]
    };
  }

  async resetDatabase(): Promise<void> {
    console.log('🔄 Resetting mock database...');
    await this.simulateDelay(300);
    console.log('✅ Mock database reset completed');
  }

  async exportDatabase(): Promise<any> {
    console.log('📤 Exporting mock database...');
    await this.simulateDelay(200);
    return {
      transactions: await this.expenses.getTransactions(),
      categories: await this.categories.getCategories(),
      users: [await this.users.getCurrentUser()],
      settings: await this.settings.getSettings()
    };
  }

  async importDatabase(data: any): Promise<void> {
    console.log('📥 Importing mock database...');
    await this.simulateDelay(400);
    console.log('✅ Mock database import completed');
  }

  private async simulateDelay(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}
