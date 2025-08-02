import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import schema from './schema'
import {
  User,
  Group,
  Participant,
  Category,
  Subcategory,
  Tag,
  Transaction,
  TransactionPayer,
  TransactionTag,
  TransactionMedia,
} from './models'

// Create the adapter to the underlying database
const adapter = new SQLiteAdapter({
  schema,
  // database name. is used by SQLite as the database file name
  dbName: 'scountDB',
  // Optional, but you should implement this method in a production app.
  // See Setup guide for more details.
  onSetUpError: error => {
    console.error('Failed to set up the database:', error)
  }
})

// Create the Watermelon database
export const database = new Database({
  adapter,
  modelClasses: [
    User,
    Group,
    Participant,
    Category,
    Subcategory,
    Tag,
    Transaction,
    TransactionPayer,
    TransactionTag,
    TransactionMedia,
  ],
})

export default database 