// Transaction-related types
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

