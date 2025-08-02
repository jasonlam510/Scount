import { Model } from '@nozbe/watermelondb'
import { date, readonly, relation } from '@nozbe/watermelondb/decorators'

export default class TransactionTag extends Model {
  static table = 'transaction_tags'
  
  static associations = {
    transactions: { type: 'belongs_to' as const, key: 'transaction_id' },
    tags: { type: 'belongs_to' as const, key: 'tag_id' },
  }

  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number

  // Relationships
  @relation('transactions', 'transaction_id') transaction!: any
  @relation('tags', 'tag_id') tag!: any
} 