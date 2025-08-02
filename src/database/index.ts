import { Database } from '@nozbe/watermelondb'
import { createAdapter } from './adapters'
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

// Database instance (will be initialized asynchronously)
let database: Database | null = null

/**
 * Initialize the database with platform-specific adapter
 */
export const initializeDatabase = (): Database => {
  if (database) {
    return database
  }

  // Create the appropriate adapter based on platform
  const adapter = createAdapter()

  // Create the Watermelon database
  database = new Database({
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

  return database
}

/**
 * Get the database instance (initialize if needed)
 */
export const getDatabase = (): Database => {
  return initializeDatabase()
}

// Test database initialization
export const testDatabaseConnection = async () => {
  try {
    console.log('🔍 Testing database connection...')
    
    const db = getDatabase()
    
    // Test if we can access the database
    const collections = db.collections
    console.log('✅ Database collections available:', Object.keys(collections))
    
    // Test if we can query a table (even if empty)
    const usersCount = await db.collections.get('users').query().fetchCount()
    console.log('✅ Users table accessible, count:', usersCount)
    
    // Test if we can create a test record
    await db.write(async () => {
      const testUser = await db.collections.get('users').create((user: any) => {
        user.name = 'Test User'
        user.email = 'test@example.com'
      })
      console.log('✅ Test user created with ID:', testUser.id)
      
      // Clean up - delete the test user
      await testUser.destroyPermanently()
      console.log('✅ Test user cleaned up')
    })
    
    console.log('🎉 Database connection test successful!')
    return true
  } catch (error) {
    console.error('❌ Database connection test failed:', error)
    return false
  }
}

export default database 