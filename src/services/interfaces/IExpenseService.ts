import { 
  Transaction, 
  CreateTransactionRequest, 
  UpdateTransactionRequest, 
  TransactionFilters
} from '../types/transactions';
import { 
  TransactionPayer,
  CreateTransactionPayerRequest,
  UpdateTransactionPayerRequest
} from '../types/transaction-payers';
import { 
  TransactionTag,
  CreateTransactionTagRequest,
  UpdateTransactionTagRequest
} from '../types/transaction-tags';
import { 
  TransactionMedia,
  CreateTransactionMediaRequest,
  UpdateTransactionMediaRequest
} from '../types/transaction-media';
import { 
  PaginationOptions,
  PaginatedResponse 
} from '../types';

export interface IExpenseService {
  // Core transaction operations
  getTransactions(filters?: TransactionFilters, pagination?: PaginationOptions): Promise<PaginatedResponse<Transaction>>;
  getTransactionById(id: string): Promise<Transaction | null>;
  createTransaction(transaction: CreateTransactionRequest): Promise<Transaction>;
  updateTransaction(id: string, updates: UpdateTransactionRequest): Promise<Transaction>;
  deleteTransaction(id: string): Promise<void>;
  
  // Transaction payers
  getTransactionPayers(transactionId: string): Promise<TransactionPayer[]>;
  getTransactionPayerById(id: string): Promise<TransactionPayer | null>;
  createTransactionPayer(payer: CreateTransactionPayerRequest): Promise<TransactionPayer>;
  updateTransactionPayer(id: string, updates: UpdateTransactionPayerRequest): Promise<TransactionPayer>;
  deleteTransactionPayer(id: string): Promise<void>;
  
  // Transaction tags
  getTransactionTags(transactionId: string): Promise<TransactionTag[]>;
  getTransactionTagById(id: string): Promise<TransactionTag | null>;
  createTransactionTag(tag: CreateTransactionTagRequest): Promise<TransactionTag>;
  updateTransactionTag(id: string, updates: UpdateTransactionTagRequest): Promise<TransactionTag>;
  deleteTransactionTag(id: string): Promise<void>;
  
  // Transaction media
  getTransactionMedia(transactionId: string): Promise<TransactionMedia[]>;
  getTransactionMediaById(id: string): Promise<TransactionMedia | null>;
  createTransactionMedia(media: CreateTransactionMediaRequest): Promise<TransactionMedia>;
  updateTransactionMedia(id: string, updates: UpdateTransactionMediaRequest): Promise<TransactionMedia>;
  deleteTransactionMedia(id: string): Promise<void>;
  
  // Advanced queries
  getTransactionsByDateRange(startDate: number, endDate: number, filters?: TransactionFilters): Promise<Transaction[]>;
  getTransactionsByCategory(categoryId: string, filters?: TransactionFilters): Promise<Transaction[]>;
  getTransactionsByGroup(groupId: string, filters?: TransactionFilters): Promise<Transaction[]>;
  getPersonalTransactions(filters?: TransactionFilters): Promise<Transaction[]>;
  getTransactionsByUser(userId: string, filters?: TransactionFilters): Promise<Transaction[]>;
  
  // Aggregations
  getTotalAmount(filters?: TransactionFilters): Promise<number>;
  getTotalByCategory(filters?: TransactionFilters): Promise<{ [categoryId: string]: number }>;
  getTotalByGroup(filters?: TransactionFilters): Promise<{ [groupId: string]: number }>;
  getTotalByUser(filters?: TransactionFilters): Promise<{ [userId: string]: number }>;
  getTotalByDateRange(startDate: number, endDate: number, filters?: TransactionFilters): Promise<number>;
  
  // Real-time subscriptions (for future sync)
  subscribe(callback: (transactions: Transaction[]) => void): () => void;
  subscribeToChanges(callback: (change: any) => void): () => void;
  subscribeToTransactionChanges(transactionId: string, callback: (transaction: Transaction) => void): () => void;
}
