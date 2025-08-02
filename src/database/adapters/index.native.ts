import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import schema from '../schema'

/**
 * SQLite adapter configuration for mobile platforms (iOS/Android)
 */
export const createAdapter = () => {
  console.log('📱 Using SQLite adapter for mobile platform')
  
  return new SQLiteAdapter({
    schema,
    // database name. is used by SQLite as the database file name
    dbName: 'scountDB',
    // Enable JSI for better performance on iOS
    jsi: true,
    // Optional, but you should implement this method in a production app.
    onSetUpError: error => {
      console.error('❌ SQLite database setup failed:', error)
    }
  })
} 