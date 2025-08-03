import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly, children } from '@nozbe/watermelondb/decorators'

export default class User extends Model {
  static table = 'users'
  
  static associations = {
    participants: { type: 'has_many' as const, foreignKey: 'user_id' },
    transaction_payers: { type: 'has_many' as const, foreignKey: 'user_id' },
  }

  @text('uuid') uuid!: string
  @text('name') name!: string
  @text('nickname') nickname?: string
  @text('email') email?: string
  @text('avatar') avatar?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number

  // Relationships
  @children('participants') participants!: any
  @children('transaction_payers') transactionPayers!: any
} 