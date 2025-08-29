// Transaction Tag-related types (Junction table)
export interface TransactionTag {
  id: string;
  transaction_id: string;
  tag_id: string;
  created_at: number;
  updated_at: number;
}

export interface CreateTransactionTagRequest {
  transaction_id: string;
  tag_id: string;
}

export interface UpdateTransactionTagRequest extends Partial<CreateTransactionTagRequest> {
  id: string;
}

