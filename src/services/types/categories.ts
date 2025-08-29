// Category-related types
export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income' | 'transfer';
  created_at: number;
  updated_at: number;
}

export interface CreateCategoryRequest {
  name: string;
  type: 'expense' | 'income' | 'transfer';
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string;
}

