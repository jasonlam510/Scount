import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly, relation } from '@nozbe/watermelondb/decorators'

export default class Participant extends Model {
  static table = 'participants'
  
  static associations = {
    groups: { type: 'belongs_to' as const, key: 'group_id' },
    users: { type: 'belongs_to' as const, key: 'user_id' },
  }

  @field('is_active') isActive!: boolean
  @text('display_name') displayName?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number

  // Relationships
  @relation('groups', 'group_id') group!: any
  @relation('users', 'user_id') user!: any
} 