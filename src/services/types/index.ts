// Export all type definitions
export * from './users';
export * from './groups';
export * from './participants';
export * from './categories';
export * from './subcategories';
export * from './tags';
export * from './transactions';
export * from './transaction-payers';
export * from './transaction-tags';
export * from './transaction-media';
export * from './app';

// Common types used across services
export interface BaseEntity {
  id: string;
  created_at: number;
  updated_at: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Generic database types
export interface DatabaseConfig {
  name: string;
  version: number;
  tables: string[];
}

export interface QueryOptions {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}
