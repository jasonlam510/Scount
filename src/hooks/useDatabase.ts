import { useState, useEffect, useCallback } from 'react'
import { getDatabase, testDatabaseConnection } from '../database'
import { isWeb } from '../utils/platform'

/**
 * Hook for database connection and health checks
 */
export const useDatabase = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [database, setDatabase] = useState<any>(null)

  // Test database connection
  const testConnection = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const success = await testDatabaseConnection()
      setIsConnected(success)
      
      if (success) {
        const db = await getDatabase()
        setDatabase(db)
      } else {
        setError('Database connection failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown database error')
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initialize database connection on mount
  useEffect(() => {
    testConnection()
  }, [testConnection])

  // Get database instance
  const getDatabaseInstance = useCallback(async () => {
    if (!database) {
      const db = await getDatabase()
      setDatabase(db)
      return db
    }
    return database
  }, [database])

  // Get platform info
  const getPlatformInfo = useCallback(() => {
    return {
      isWeb,
      platform: isWeb ? 'web' : 'mobile'
    }
  }, [])

  return {
    // State
    isConnected,
    isLoading,
    error,
    database,
    
    // Actions
    testConnection,
    getDatabase: getDatabaseInstance,
    getPlatformInfo,
  }
} 