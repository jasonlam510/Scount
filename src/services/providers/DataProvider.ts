import { IDataProvider } from '../interfaces/IDataProvider';
import { MockDataProvider } from './MockDataProvider';

// Change this when ready for your preferred database
const USE_MOCK = true;

export class DataProvider implements IDataProvider {
  private provider: IDataProvider;

  constructor() {
    if (USE_MOCK) {
      this.provider = new MockDataProvider();
    } else {
      // Future: Replace with your preferred database provider
      // this.provider = new YourDatabaseProvider();
      throw new Error('Database provider not implemented yet');
    }
  }

  // Delegate all calls to the selected provider
  get expenses() { return this.provider.expenses; }
  get users() { return this.provider.users; }
  get settings() { return this.provider.settings; }
  get groups() { return this.provider.groups; }
  get categories() { return this.provider.categories; }

  async initialize(): Promise<void> { return this.provider.initialize(); }
  async cleanup(): Promise<void> { return this.provider.cleanup(); }
  async isHealthy(): Promise<boolean> { return this.provider.isHealthy(); }
  async getConnectionStatus(): Promise<'online' | 'offline' | 'connecting'> { return this.provider.getConnectionStatus(); }
  async sync(): Promise<void> { return this.provider.sync(); }
  async getLastSyncTime(): Promise<Date | null> { return this.provider.getLastSyncTime(); }
  async getDatabaseInfo(): Promise<{ name: string; version: number; tables: string[] }> { return this.provider.getDatabaseInfo(); }
  async resetDatabase(): Promise<void> { return this.provider.resetDatabase(); }
  async exportDatabase(): Promise<any> { return this.provider.exportDatabase(); }
  async importDatabase(data: any): Promise<void> { return this.provider.importDatabase(data); }
  async getLastError(): Promise<string | null> { return this.provider.getLastError(); }
  async clearErrors(): Promise<void> { return this.provider.clearErrors(); }
}
