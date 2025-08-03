import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly, relation, children } from '@nozbe/watermelondb/decorators'

export default class Transaction extends Model {
  static table = 'transactions'
  
  static associations = {
    groups: { type: 'belongs_to' as const, key: 'group_id' },
    subcategories: { type: 'belongs_to' as const, key: 'subcategory_id' },
    transaction_payers: { type: 'has_many' as const, foreignKey: 'transaction_id' },
    transaction_tags: { type: 'has_many' as const, foreignKey: 'transaction_id' },
    transaction_media: { type: 'has_many' as const, foreignKey: 'transaction_id' },
  }

  @field('is_personal') isPersonal!: boolean
  @text('title') title!: string
  @field('amount') amount!: number
  @text('currency') currency!: string
  @text('type') type!: string
  @date('date') date!: number
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number

  // Relationships
  @relation('groups', 'group_id') group?: any
  @relation('subcategories', 'subcategory_id') subcategory?: any
  @children('transaction_payers') transactionPayers!: any
  @children('transaction_tags') transactionTags!: any
  @children('transaction_media') transactionMedia!: any
} 