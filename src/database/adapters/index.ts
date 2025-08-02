import { isWeb } from '../../utils/platform'
import { createSQLiteAdapter } from './sqlite'
import { createLokiJSAdapter } from './lokijs'

/**
 * Create the appropriate database adapter based on platform
 */
export const createAdapter = async () => {
  if (isWeb) {
    console.log('🌐 Using LokiJS adapter for web platform')
    return await createLokiJSAdapter()
  } else {
    console.log('📱 Using SQLite adapter for mobile platform')
    return await createSQLiteAdapter()
  }
} 