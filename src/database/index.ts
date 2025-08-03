import { Database } from '@nozbe/watermelondb'
import { createAdapter } from './adapters' // Metro will automatically resolve to index.web.ts or index.native.ts
import { isWeb, isIOS, isAndroid, getPlatform } from '../utils/platform'
import { seedDatabase } from './seeds'
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
 * Check database health and log results
 */
const checkDatabaseHealthOnStartup = async (db: Database) => {
  try {
    console.log('🚀 Database initialized - running health check...')
    
    // Show specific platform
    console.log(`📱 Platform: ${getPlatform()}`)
    
    // Add a small delay to ensure database is fully initialized
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const health = await isDatabaseWorking()
    
    if (health.working) {
      console.log('✅ Database health check passed')
      console.log(`📊 Tables: ${health.tables}`)
      console.log(`👥 Users: ${health.usersCount}`)
      console.log(`⏰ Checked at: ${health.timestamp}`)
      
      // Run seeding after health check passes
      await seedDatabase(db)
    } else {
      console.error('❌ Database health check failed')
      console.error(`🚨 Error: ${health.error}`)
      console.error(`⏰ Failed at: ${health.timestamp}`)
    }
  } catch (error) {
    console.error('💥 Database health check error:', error)
  }
}

/**
 * Initialize the database with platform-specific adapter
 */
export const initializeDatabase = (): Database => {
  if (database) {
    return database
  }

  console.log('🔧 Initializing database...')
  
  // Create the appropriate adapter based on platform
  const adapter = createAdapter()
  console.log('🔧 Adapter created:', adapter)

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

  // Run health check after database is created
  checkDatabaseHealthOnStartup(database)

  return database
}

/**
 * Get the database instance (initialize if needed)
 */
export const getDatabase = (): Database => {
  return initializeDatabase()
}

/**
 * Simple health check - checks if database is accessible without creating test data
 */
export const isDatabaseWorking = async () => {
  try {
    const db = getDatabase()
    
    // Check if we can access collections
    const collections = db.collections
    const tableCount = Object.keys(collections).length
    
    // Check if we can perform a simple query (without creating data)
    const usersCount = await db.collections.get('users').query().fetchCount()
    
    return {
      working: true,
      tables: tableCount,
      usersCount,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      working: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }
  }
}

export default database 