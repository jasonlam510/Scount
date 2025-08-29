export interface User {
  id: string;
  uuid: string;
  name: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  created_at: number;
  updated_at: number;
}

export interface Group {
  id: string;
  title: string;
  icon?: string;
  currency: string;
  is_archived: boolean;
  created_at: number;
  updated_at: number;
}

export interface Participant {
  id: string;
  group_id: string;
  user_id: string;
  is_active: boolean;
  display_name?: string;
  created_at: number;
  updated_at: number;
}

export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income' | 'transfer';
  created_at: number;
  updated_at: number;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  type: 'expense' | 'income' | 'transfer';
  icon?: string;
  created_at: number;
  updated_at: number;
}

export interface Tag {
  id: string;
  name: string;
  created_at: number;
  updated_at: number;
}

export interface Transaction {
  id: string;
  group_id?: string;
  is_personal: boolean;
  title: string;
  amount: number;
  currency: string;
  type: 'expense' | 'income' | 'transfer';
  date: number;
  subcategory_id?: string;
  created_at: number;
  updated_at: number;
}

export interface TransactionPayer {
  id: string;
  transaction_id: string;
  user_id: string;
  amount: number;
  created_at: number;
  updated_at: number;
}

export interface TransactionTag {
  id: string;
  transaction_id: string;
  tag_id: string;
  created_at: number;
  updated_at: number;
}

export interface TransactionMedia {
  id: string;
  transaction_id: string;
  url: string;
  type: 'image' | 'receipt';
  created_at: number;
  updated_at: number;
}

// Legacy interface for backward compatibility (can be removed later)
export interface Expense {
  id: string;
  description: string;
  payer: string;
  amount: number;
  currency: string;
  type: 'expense' | 'income';
  icon: string;
  date: string;
  category?: string;
  tags?: string[];
}

export interface CreateExpenseRequest {
  description: string;
  payer: string;
  amount: number;
  currency: string;
  type: 'expense' | 'income';
  icon: string;
  date: string;
  category?: string;
  tags?: string[];
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {
  id: string;
}

export interface ExpenseFilters {
  category?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  type?: 'expense' | 'income';
  payer?: string;
  minAmount?: number;
  maxAmount?: number;
}

// New interfaces for your current schema
export interface CreateTransactionRequest {
  group_id?: string;
  is_personal: boolean;
  title: string;
  amount: number;
  currency: string;
  type: 'expense' | 'income' | 'transfer';
  date: number;
  subcategory_id?: string;
  payers: Array<{
    user_id: string;
    amount: number;
  }>;
  tag_ids?: string[];
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {
  id: string;
}

export interface TransactionFilters {
  group_id?: string;
  is_personal?: boolean;
  type?: 'expense' | 'income' | 'transfer';
  subcategory_id?: string;
  dateRange?: {
    startDate: number;
    endDate: number;
  };
  minAmount?: number;
  maxAmount?: number;
  user_id?: string; // Filter by payer
}
