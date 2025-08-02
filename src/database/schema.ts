import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const schema = appSchema({
  version: 1,
  tables: [
    // Users table
    tableSchema({
      name: 'users',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'nickname', type: 'string', isOptional: true },
        { name: 'email', type: 'string', isOptional: true },
        { name: 'avatar', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),

    // Groups table
    tableSchema({
      name: 'groups',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'icon', type: 'string', isOptional: true },
        { name: 'currency', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),

    // Participants table (Group Membership)
    tableSchema({
      name: 'participants',
      columns: [
        { name: 'group_id', type: 'string', isIndexed: true },
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'is_active', type: 'boolean' },
        { name: 'display_name', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),

    // Categories table
    tableSchema({
      name: 'categories',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'type', type: 'string' }, // 'expense', 'income', 'transfer'
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),

    // Subcategories table
    tableSchema({
      name: 'subcategories',
      columns: [
        { name: 'category_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'type', type: 'string' }, // 'expense', 'income', 'transfer'
        { name: 'icon', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),

    // Tags table
    tableSchema({
      name: 'tags',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),

    // Transactions table
    tableSchema({
      name: 'transactions',
      columns: [
        { name: 'group_id', type: 'string', isIndexed: true, isOptional: true },
        { name: 'is_personal', type: 'boolean', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'amount', type: 'number' },
        { name: 'currency', type: 'string' },
        { name: 'date', type: 'number', isIndexed: true },
        { name: 'subcategory_id', type: 'string', isIndexed: true, isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),

    // Transaction Payers table
    tableSchema({
      name: 'transaction_payers',
      columns: [
        { name: 'transaction_id', type: 'string', isIndexed: true },
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'amount', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),

    // Transaction Tags table (Junction table)
    tableSchema({
      name: 'transaction_tags',
      columns: [
        { name: 'transaction_id', type: 'string', isIndexed: true },
        { name: 'tag_id', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),

    // Transaction Media table
    tableSchema({
      name: 'transaction_media',
      columns: [
        { name: 'transaction_id', type: 'string', isIndexed: true },
        { name: 'uri', type: 'string' },
        { name: 'type', type: 'string' }, // 'image', 'receipt'
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
  ]
})

export default schema 