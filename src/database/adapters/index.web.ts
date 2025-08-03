import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import schema from '../schema'

/**
 * LokiJS adapter configuration for web platform
 */
export const createAdapter = () => {
  console.log('🌐 Using LokiJS adapter for web platform')
  console.log('📋 Schema being used:', schema)
  console.log('📊 Schema version:', schema.version)
  console.log('📚 Schema tables:', schema.tables.length)
  
  return new LokiJSAdapter({
    schema,
    // Use IndexedDB for persistence
    useIncrementalIndexedDB: true,
    // Don't use web workers for now (simpler setup)
    useWebWorker: false,
    // Database name
    dbName: 'scountDB',
    // Optional, but recommended event handlers
    onQuotaExceededError: (error) => {
      console.error('❌ Browser ran out of disk space:', error)
      // Offer the user to reload the app or log out
    },
    onSetUpError: (error) => {
      console.error('❌ LokiJS database setup failed:', error)
      // Database failed to load -- offer the user to reload the app or log out
    },
    extraIncrementalIDBOptions: {
      onDidOverwrite: () => {
        console.warn('⚠️ Database was overwritten by another tab')
        // Called when this adapter is forced to overwrite contents of IndexedDB.
        // This happens if there's another open tab of the same app that's making changes.
        // Try to synchronize the app now, and if user is offline, alert them that if they close this
        // tab, some data may be lost
      },
      onversionchange: () => {
        console.warn('⚠️ Database version changed, reloading page')
        // database was deleted in another browser tab (user logged out), so we must make sure we delete
        // it in this tab as well - usually best to just refresh the page
        window.location.reload()
      },
    }
  })
} 