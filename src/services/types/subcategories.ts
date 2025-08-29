// Subcategory-related types
export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  type: 'expense' | 'income' | 'transfer';
  icon?: string;
  created_at: number;
  updated_at: number;
}

export interface CreateSubcategoryRequest {
  category_id: string;
  name: string;
  type: 'expense' | 'income' | 'transfer';
  icon?: string;
}

export interface UpdateSubcategoryRequest extends Partial<CreateSubcategoryRequest> {
  id: string;
}

