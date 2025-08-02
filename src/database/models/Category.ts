import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly, children } from '@nozbe/watermelondb/decorators'

export default class Category extends Model {
  static table = 'categories'
  
  static associations = {
    subcategories: { type: 'has_many' as const, foreignKey: 'category_id' },
  }

  @text('name') name!: string
  @text('type') type!: string // 'expense', 'income', 'transfer'
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number

  // Relationships
  @children('subcategories') subcategories!: any
} 