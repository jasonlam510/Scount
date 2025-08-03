import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly, children } from '@nozbe/watermelondb/decorators'

export default class Group extends Model {
  static table = 'groups'
  
  static associations = {
    participants: { type: 'has_many' as const, foreignKey: 'group_id' },
    transactions: { type: 'has_many' as const, foreignKey: 'group_id' },
  }

  @text('title') title!: string
  @text('icon') icon?: string
  @text('currency') currency!: string
  @field('is_archived') isArchived!: boolean
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number

  // Relationships
  @children('participants') participants!: any
  @children('transactions') transactions!: any
} 