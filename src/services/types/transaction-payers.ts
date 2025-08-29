// Transaction Payer-related types
export interface TransactionPayer {
  id: string;
  transaction_id: string;
  user_id: string;
  amount: number;
  created_at: number;
  updated_at: number;
}

export interface CreateTransactionPayerRequest {
  transaction_id: string;
  user_id: string;
  amount: number;
}

export interface UpdateTransactionPayerRequest extends Partial<CreateTransactionPayerRequest> {
  id: string;
}
