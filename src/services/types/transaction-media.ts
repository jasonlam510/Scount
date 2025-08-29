// Transaction Media-related types
export interface TransactionMedia {
  id: string;
  transaction_id: string;
  url: string;
  type: 'image' | 'receipt';
  created_at: number;
  updated_at: number;
}

export interface CreateTransactionMediaRequest {
  transaction_id: string;
  url: string;
  type: 'image' | 'receipt';
}

export interface UpdateTransactionMediaRequest extends Partial<CreateTransactionMediaRequest> {
  id: string;
}

