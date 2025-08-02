import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly, relation } from '@nozbe/watermelondb/decorators'

export default class TransactionMedia extends Model {
  static table = 'transaction_media'
  
  static associations = {
    transactions: { type: 'belongs_to' as const, key: 'transaction_id' },
  }

  @text('uri') uri!: string
  @text('type') type!: string // 'image', 'receipt'
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number

  // Relationships
  @relation('transactions', 'transaction_id') transaction!: any
} 