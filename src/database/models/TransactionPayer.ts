import { Model } from '@nozbe/watermelondb'
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators'

export default class TransactionPayer extends Model {
  static table = 'transaction_payers'
  
  static associations = {
    transactions: { type: 'belongs_to' as const, key: 'transaction_id' },
    users: { type: 'belongs_to' as const, key: 'user_id' },
  }

  @field('amount') amount!: number
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number

  // Relationships
  @relation('transactions', 'transaction_id') transaction!: any
  @relation('users', 'user_id') user!: any
} 