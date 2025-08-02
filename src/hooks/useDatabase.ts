import { useState, useEffect, useCallback } from 'react'
import { getDatabase, isDatabaseWorking } from '../database'
import { isWeb } from '../utils/platform'

/**
 * Hook for database connection and health checks
 */
export const useDatabase = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [database, setDatabase] = useState<any>(null)
  const [healthStatus, setHealthStatus] = useState<any>(null)

  // Check database health
  const checkHealth = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const health = await isDatabaseWorking()
      setHealthStatus(health)
      setIsConnected(health.working)
      
      if (health.working) {
        const db = getDatabase()
        setDatabase(db)
      } else {
        setError(health.error || 'Database health check failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown database error')
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initialize database connection on mount - this will trigger the health check
  useEffect(() => {
    console.log('🔍 useDatabase hook initialized - triggering database access')
    
    // This will trigger database initialization and health check
    const db = getDatabase()
    setDatabase(db)
    
    // Also run health check for detailed status
    checkHealth()
  }, [checkHealth])

  // Get database instance
  const getDatabaseInstance = useCallback(() => {
    if (!database) {
      const db = getDatabase()
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
    healthStatus,
    
    // Actions
    checkHealth,
    getDatabase: getDatabaseInstance,
    getPlatformInfo,
  }
} 