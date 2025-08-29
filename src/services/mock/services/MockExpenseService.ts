import { IExpenseService } from '../../interfaces/IExpenseService';
import { 
  Transaction, 
  CreateTransactionRequest, 
  UpdateTransactionRequest, 
  TransactionFilters
} from '../../types/transactions';
import { 
  TransactionPayer,
  CreateTransactionPayerRequest,
  UpdateTransactionPayerRequest
} from '../../types/transaction-payers';
import { 
  TransactionTag,
  CreateTransactionTagRequest,
  UpdateTransactionTagRequest
} from '../../types/transaction-tags';
import { 
  TransactionMedia,
  CreateTransactionMediaRequest,
  UpdateTransactionMediaRequest
} from '../../types/transaction-media';
import { 
  PaginationOptions,
  PaginatedResponse 
} from '../../types';
import { mockTransactions } from '../data/transactions';
import { mockTransactionPayers } from '../data/transaction-payers';
import { mockTransactionTags } from '../data/transaction-tags';
import { mockTransactionMedia } from '../data/transaction-media';

export class MockExpenseService implements IExpenseService {
  private transactions: Transaction[] = [...mockTransactions];
  private transactionPayers: TransactionPayer[] = [...mockTransactionPayers];
  private transactionTags: TransactionTag[] = [...mockTransactionTags];
  private transactionMedia: TransactionMedia[] = [...mockTransactionMedia];
  
  private listeners: ((transactions: Transaction[]) => void)[] = [];
  private changeListeners: ((change: any) => void)[] = [];

  constructor() {
    console.log(`MockExpenseService initialized with ${this.transactions.length} transactions`);
  }

  // Core transaction operations
  async getTransactions(filters?: TransactionFilters, pagination?: PaginationOptions): Promise<PaginatedResponse<Transaction>> {
    await this.simulateDelay();
    
    let filtered = this.transactions;
    
    // Apply filters
    if (filters?.group_id !== undefined) {
      filtered = filtered.filter(t => t.group_id === filters.group_id);
    }
    if (filters?.is_personal !== undefined) {
      filtered = filtered.filter(t => t.is_personal === filters.is_personal);
    }
    if (filters?.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    if (filters?.subcategory_id) {
      filtered = filtered.filter(t => t.subcategory_id === filters.subcategory_id);
    }
    if (filters?.dateRange) {
      filtered = filtered.filter(t => 
        t.date >= filters.dateRange!.startDate && t.date <= filters.dateRange!.endDate
      );
    }
    if (filters?.minAmount !== undefined) {
      filtered = filtered.filter(t => t.amount >= filters.minAmount!);
    }
    if (filters?.maxAmount !== undefined) {
      filtered = filtered.filter(t => t.amount <= filters.maxAmount!);
    }
    
    // Apply pagination
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 50;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);
    
    return {
      data: paginated,
      total: filtered.length,
      page,
      limit,
      hasMore: end < filtered.length
    };
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    await this.simulateDelay();
    return this.transactions.find(t => t.id === id) || null;
  }

  async createTransaction(transaction: CreateTransactionRequest): Promise<Transaction> {
    await this.simulateDelay();
    const newTransaction: Transaction = {
      id: this.generateId(),
      ...transaction,
      created_at: Date.now(),
      updated_at: Date.now()
    };
    
    this.transactions.push(newTransaction);
    this.notifyListeners();
    return newTransaction;
  }

  async updateTransaction(id: string, updates: UpdateTransactionRequest): Promise<Transaction> {
    await this.simulateDelay();
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Transaction not found');
    
    this.transactions[index] = { 
      ...this.transactions[index], 
      ...updates,
      updated_at: Date.now()
    };
    
    this.notifyListeners();
    return this.transactions[index];
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Transaction not found');
    
    // Remove from array (hard delete for mock)
    this.transactions.splice(index, 1);
    
    // Also remove related records
    this.transactionPayers = this.transactionPayers.filter(tp => tp.transaction_id !== id);
    this.transactionTags = this.transactionTags.filter(tt => tt.transaction_id !== id);
    this.transactionMedia = this.transactionMedia.filter(tm => tm.transaction_id !== id);
    
    this.notifyListeners();
  }

  // Transaction payers
  async getTransactionPayers(transactionId: string): Promise<TransactionPayer[]> {
    await this.simulateDelay();
    return this.transactionPayers.filter(tp => tp.transaction_id === transactionId);
  }

  async getTransactionPayerById(id: string): Promise<TransactionPayer | null> {
    await this.simulateDelay();
    return this.transactionPayers.find(tp => tp.id === id) || null;
  }

  async createTransactionPayer(payer: CreateTransactionPayerRequest): Promise<TransactionPayer> {
    await this.simulateDelay();
    const newPayer: TransactionPayer = {
      id: this.generateId(),
      ...payer,
      created_at: Date.now(),
      updated_at: Date.now()
    };
    
    this.transactionPayers.push(newPayer);
    this.notifyListeners();
    return newPayer;
  }

  async updateTransactionPayer(id: string, updates: UpdateTransactionPayerRequest): Promise<TransactionPayer> {
    await this.simulateDelay();
    const index = this.transactionPayers.findIndex(tp => tp.id === id);
    if (index === -1) throw new Error('Transaction payer not found');
    
    this.transactionPayers[index] = { 
      ...this.transactionPayers[index], 
      ...updates,
      updated_at: Date.now()
    };
    
    this.notifyListeners();
    return this.transactionPayers[index];
  }

  async deleteTransactionPayer(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.transactionPayers.findIndex(tp => tp.id === id);
    if (index === -1) throw new Error('Transaction payer not found');
    
    this.transactionPayers.splice(index, 1);
    this.notifyListeners();
  }

  // Transaction tags
  async getTransactionTags(transactionId: string): Promise<TransactionTag[]> {
    await this.simulateDelay();
    return this.transactionTags.filter(tt => tt.transaction_id === transactionId);
  }

  async getTransactionTagById(id: string): Promise<TransactionTag | null> {
    await this.simulateDelay();
    return this.transactionTags.find(tt => tt.id === id) || null;
  }

  async createTransactionTag(tag: CreateTransactionTagRequest): Promise<TransactionTag> {
    await this.simulateDelay();
    const newTag: TransactionTag = {
      id: this.generateId(),
      ...tag,
      created_at: Date.now(),
      updated_at: Date.now()
    };
    
    this.transactionTags.push(newTag);
    this.notifyListeners();
    return newTag;
  }

  async updateTransactionTag(id: string, updates: UpdateTransactionTagRequest): Promise<TransactionTag> {
    await this.simulateDelay();
    const index = this.transactionTags.findIndex(tt => tt.id === id);
    if (index === -1) throw new Error('Transaction tag not found');
    
    this.transactionTags[index] = { 
      ...this.transactionTags[index], 
      ...updates,
      updated_at: Date.now()
    };
    
    this.notifyListeners();
    return this.transactionTags[index];
  }

  async deleteTransactionTag(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.transactionTags.findIndex(tt => tt.id === id);
    if (index === -1) throw new Error('Transaction tag not found');
    
    this.transactionTags.splice(index, 1);
    this.notifyListeners();
  }

  // Transaction media
  async getTransactionMedia(transactionId: string): Promise<TransactionMedia[]> {
    await this.simulateDelay();
    return this.transactionMedia.filter(tm => tm.transaction_id === transactionId);
  }

  async getTransactionMediaById(id: string): Promise<TransactionMedia | null> {
    await this.simulateDelay();
    return this.transactionMedia.find(tm => tm.id === id) || null;
  }

  async createTransactionMedia(media: CreateTransactionMediaRequest): Promise<TransactionMedia> {
    await this.simulateDelay();
    const newMedia: TransactionMedia = {
      id: this.generateId(),
      ...media,
      created_at: Date.now(),
      updated_at: Date.now()
    };
    
    this.transactionMedia.push(newMedia);
    this.notifyListeners();
    return newMedia;
  }

  async updateTransactionMedia(id: string, updates: UpdateTransactionMediaRequest): Promise<TransactionMedia> {
    await this.simulateDelay();
    const index = this.transactionMedia.findIndex(tm => tm.id === id);
    if (index === -1) throw new Error('Transaction media not found');
    
    this.transactionMedia[index] = { 
      ...this.transactionMedia[index], 
      ...updates,
      updated_at: Date.now()
    };
    
    this.notifyListeners();
    return this.transactionMedia[index];
  }

  async deleteTransactionMedia(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.transactionMedia.findIndex(tm => tm.id === id);
    if (index === -1) throw new Error('Transaction media not found');
    
    this.transactionMedia.splice(index, 1);
    this.notifyListeners();
  }

  // Advanced queries
  async getTransactionsByDateRange(startDate: number, endDate: number, filters?: TransactionFilters): Promise<Transaction[]> {
    await this.simulateDelay();
    let filtered = this.transactions.filter(t => t.date >= startDate && t.date <= endDate);
    
    if (filters) {
      if (filters.group_id !== undefined) {
        filtered = filtered.filter(t => t.group_id === filters.group_id);
      }
      if (filters.is_personal !== undefined) {
        filtered = filtered.filter(t => t.is_personal === filters.is_personal);
      }
      if (filters.type) {
        filtered = filtered.filter(t => t.type === filters.type);
      }
    }
    
    return filtered;
  }

  async getTransactionsByCategory(categoryId: string, filters?: TransactionFilters): Promise<Transaction[]> {
    await this.simulateDelay();
    let filtered = this.transactions.filter(t => t.subcategory_id === categoryId);
    
    if (filters) {
      if (filters.group_id !== undefined) {
        filtered = filtered.filter(t => t.group_id === filters.group_id);
      }
      if (filters.is_personal !== undefined) {
        filtered = filtered.filter(t => t.is_personal === filters.is_personal);
      }
    }
    
    return filtered;
  }

  async getTransactionsByGroup(groupId: string, filters?: TransactionFilters): Promise<Transaction[]> {
    await this.simulateDelay();
    let filtered = this.transactions.filter(t => t.group_id === groupId);
    
    if (filters) {
      if (filters.type) {
        filtered = filtered.filter(t => t.type === filters.type);
      }
      if (filters.subcategory_id) {
        filtered = filtered.filter(t => t.subcategory_id === filters.subcategory_id);
      }
    }
    
    return filtered;
  }

  async getPersonalTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    await this.simulateDelay();
    let filtered = this.transactions.filter(t => t.is_personal);
    
    if (filters) {
      if (filters.type) {
        filtered = filtered.filter(t => t.type === filters.type);
      }
      if (filters.subcategory_id) {
        filtered = filtered.filter(t => t.subcategory_id === filters.subcategory_id);
      }
    }
    
    return filtered;
  }

  async getTransactionsByUser(userId: string, filters?: TransactionFilters): Promise<Transaction[]> {
    await this.simulateDelay();
    // Get transactions where user is a payer
    const userPayerIds = this.transactionPayers
      .filter(tp => tp.user_id === userId)
      .map(tp => tp.transaction_id);
    
    let filtered = this.transactions.filter(t => userPayerIds.includes(t.id));
    
    if (filters) {
      if (filters.group_id !== undefined) {
        filtered = filtered.filter(t => t.group_id === filters.group_id);
      }
      if (filters.type) {
        filtered = filtered.filter(t => t.type === filters.type);
      }
    }
    
    return filtered;
  }

  // Aggregations
  async getTotalAmount(filters?: TransactionFilters): Promise<number> {
    await this.simulateDelay();
    let filtered = this.transactions;
    
    if (filters) {
      if (filters.group_id !== undefined) {
        filtered = filtered.filter(t => t.group_id === filters.group_id);
      }
      if (filters.is_personal !== undefined) {
        filtered = filtered.filter(t => t.is_personal === filters.is_personal);
      }
      if (filters.type) {
        filtered = filtered.filter(t => t.type === filters.type);
      }
    }
    
    return filtered.reduce((sum, t) => sum + t.amount, 0);
  }

  async getTotalByCategory(filters?: TransactionFilters): Promise<{ [categoryId: string]: number }> {
    await this.simulateDelay();
    let filtered = this.transactions;
    
    if (filters) {
      if (filters.group_id !== undefined) {
        filtered = filtered.filter(t => t.group_id === filters.group_id);
      }
      if (filters.is_personal !== undefined) {
        filtered = filtered.filter(t => t.is_personal === filters.is_personal);
      }
    }
    
    const totals: { [categoryId: string]: number } = {};
    filtered.forEach(t => {
      if (t.subcategory_id) {
        totals[t.subcategory_id] = (totals[t.subcategory_id] || 0) + t.amount;
      }
    });
    
    return totals;
  }

  async getTotalByGroup(filters?: TransactionFilters): Promise<{ [groupId: string]: number }> {
    await this.simulateDelay();
    let filtered = this.transactions;
    
    if (filters) {
      if (filters.type) {
        filtered = filtered.filter(t => t.type === filters.type);
      }
      if (filters.subcategory_id) {
        filtered = filtered.filter(t => t.subcategory_id === filters.subcategory_id);
      }
    }
    
    const totals: { [groupId: string]: number } = {};
    filtered.forEach(t => {
      if (t.group_id) {
        totals[t.group_id] = (totals[t.group_id] || 0) + t.amount;
      }
    });
    
    return totals;
  }

  async getTotalByUser(filters?: TransactionFilters): Promise<{ [userId: string]: number }> {
    await this.simulateDelay();
    let filtered = this.transactions;
    
    if (filters) {
      if (filters.group_id !== undefined) {
        filtered = filtered.filter(t => t.group_id === filters.group_id);
      }
      if (filters.type) {
        filtered = filtered.filter(t => t.type === filters.type);
      }
    }
    
    const totals: { [userId: string]: number } = {};
    this.transactionPayers.forEach(tp => {
      const transaction = this.transactions.find(t => t.id === tp.transaction_id);
      if (transaction && filtered.includes(transaction)) {
        totals[tp.user_id] = (totals[tp.user_id] || 0) + tp.amount;
      }
    });
    
    return totals;
  }

  async getTotalByDateRange(startDate: number, endDate: number, filters?: TransactionFilters): Promise<number> {
    await this.simulateDelay();
    let filtered = this.transactions.filter(t => t.date >= startDate && t.date <= endDate);
    
    if (filters) {
      if (filters.group_id !== undefined) {
        filtered = filtered.filter(t => t.group_id === filters.group_id);
      }
      if (filters.is_personal !== undefined) {
        filtered = filtered.filter(t => t.is_personal === filters.is_personal);
      }
      if (filters.type) {
        filtered = filtered.filter(t => t.type === filters.type);
      }
    }
    
    return filtered.reduce((sum, t) => sum + t.amount, 0);
  }

  // Real-time subscriptions (for future sync)
  subscribe(callback: (transactions: Transaction[]) => void): () => void {
    this.listeners.push(callback);
    // Initial call
    callback([...this.transactions]);
    
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  subscribeToChanges(callback: (change: any) => void): () => void {
    this.changeListeners.push(callback);
    
    return () => {
      const index = this.changeListeners.indexOf(callback);
      if (index > -1) {
        this.changeListeners.splice(index, 1);
      }
    };
  }

  subscribeToTransactionChanges(transactionId: string, callback: (transaction: Transaction) => void): () => void {
    const changeCallback = (change: any) => {
      if (change.type === 'update' && change.id === transactionId) {
        const transaction = this.transactions.find(t => t.id === transactionId);
        if (transaction) {
          callback(transaction);
        }
      }
    };
    
    this.changeListeners.push(changeCallback);
    
    return () => {
      const index = this.changeListeners.indexOf(changeCallback);
      if (index > -1) {
        this.changeListeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback([...this.transactions]));
  }

  private generateId(): string {
    return `mock_expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async simulateDelay(ms: number = 100): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}
