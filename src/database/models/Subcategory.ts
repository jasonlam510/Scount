import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly, relation } from '@nozbe/watermelondb/decorators'

export default class Subcategory extends Model {
  static table = 'subcategories'
  
  static associations = {
    categories: { type: 'belongs_to' as const, key: 'category_id' },
  }

  @text('name') name!: string
  @text('type') type!: string // 'expense', 'income', 'transfer'
  @text('icon') icon?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number

  // Relationships
  @relation('categories', 'category_id') category!: any
} 