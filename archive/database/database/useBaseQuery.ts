import { useState, useEffect, useCallback, useRef } from 'react'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { Query, Model } from '@nozbe/watermelondb'

export interface QueryState<T> {
  data: T[]
  isLoading: boolean
  error: string | null
  isRefetching: boolean
}

export interface QueryOptions {
  enabled?: boolean
  retryCount?: number
  retryDelay?: number
  onSuccess?: (data: any[]) => void
  onError?: (error: string) => void
}

/**
 * Base hook for database queries with standard error handling and loading states
 */
export const useBaseQuery = <T extends Model>(
  queryFn: (database: any) => Query<T> | null,
  options: QueryOptions = {}
) => {
  const database = useDatabase()
  const {
    enabled = true,
    retryCount = 3,
    retryDelay = 1000,
    onSuccess,
    onError
  } = options

  // Use refs to avoid dependency issues with callbacks
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)
  const queryFnRef = useRef(queryFn)
  
  // Update refs when callbacks change
  useEffect(() => {
    onSuccessRef.current = onSuccess
    onErrorRef.current = onError
    queryFnRef.current = queryFn
  }, [onSuccess, onError, queryFn])

  const [state, setState] = useState<QueryState<T>>({
    data: [],
    isLoading: true,
    error: null,
    isRefetching: false
  })

  const retryCountRef = useRef(0)
  const subscriptionRef = useRef<any>(null)
  const hasCalledOnSuccessRef = useRef(false)

  const resetState = useCallback(() => {
    setState({
      data: [],
      isLoading: true,
      error: null,
      isRefetching: false
    })
    retryCountRef.current = 0
    hasCalledOnSuccessRef.current = false
  }, [])

  const handleError = useCallback((error: Error) => {
    const errorMessage = error.message || 'Database query failed'
    
    if (retryCountRef.current < retryCount) {
      retryCountRef.current++
      console.warn(`Query failed, retrying (${retryCountRef.current}/${retryCount}):`, errorMessage)
      
      setTimeout(() => {
        setState(prev => ({ ...prev, isRefetching: true }))
        // Retry logic will be handled by the effect
      }, retryDelay)
    } else {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isRefetching: false,
        error: errorMessage
      }))
      onErrorRef.current?.(errorMessage)
    }
  }, [retryCount, retryDelay])

  const executeQuery = useCallback(() => {
    if (!enabled || !database) {
      setState(prev => ({ ...prev, isLoading: false }))
      return
    }

    try {
      resetState()
      
      const query = queryFnRef.current(database)
      if (!query) {
        setState(prev => ({ ...prev, isLoading: false }))
        return
      }

      // Clean up previous subscription
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }

      // Subscribe to query changes
      subscriptionRef.current = query.observe().subscribe({
        next: (data) => {
          setState({
            data: data as T[],
            isLoading: false,
            error: null,
            isRefetching: false
          })
          retryCountRef.current = 0
          
          // Only call onSuccess once when data is first loaded
          if (!hasCalledOnSuccessRef.current && onSuccessRef.current) {
            hasCalledOnSuccessRef.current = true
            onSuccessRef.current(data as T[])
          }
        },
        error: handleError
      })

    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Unknown error'))
    }
  }, [database, enabled, resetState, handleError])

  // Execute query when dependencies change
  useEffect(() => {
    executeQuery()

    // Cleanup subscription on unmount
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [executeQuery])

  const refetch = useCallback(() => {
    retryCountRef.current = 0
    executeQuery()
  }, [executeQuery])

  return {
    ...state,
    refetch,
    database
  }
} 