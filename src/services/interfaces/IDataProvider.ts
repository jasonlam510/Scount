import { IExpenseService } from './IExpenseService';
import { IUserService } from './IUserService';
import { ISettingsService } from './ISettingsService';
import { IGroupService } from './IGroupService';
import { ICategoryService } from './ICategoryService';

export interface IDataProvider {
  // Service instances
  expenses: IExpenseService;
  users: IUserService;
  settings: ISettingsService;
  groups: IGroupService;
  categories: ICategoryService;
  
  // Global provider methods
  initialize(): Promise<void>;
  cleanup(): Promise<void>;
  
  // Health check
  isHealthy(): Promise<boolean>;
  
  // Connection status (for future sync)
  getConnectionStatus(): Promise<'online' | 'offline' | 'connecting'>;
  
  // Data synchronization (for future sync)
  sync(): Promise<void>;
  getLastSyncTime(): Promise<Date | null>;
  
  // Database operations
  getDatabaseInfo(): Promise<{ name: string; version: number; tables: string[] }>;
  resetDatabase(): Promise<void>;
  exportDatabase(): Promise<any>;
  importDatabase(data: any): Promise<void>;
  
  // Error handling
  getLastError(): Promise<string | null>;
  clearErrors(): Promise<void>;
}
