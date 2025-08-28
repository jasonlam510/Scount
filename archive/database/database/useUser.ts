import { useMemo } from 'react'
import { Q, Query } from '@nozbe/watermelondb'
import { useBaseQuery } from './useBaseQuery'
import User from '../../database/models/User'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { useCallback, useState } from 'react'

export interface UserData {
  id: string
  name: string
  nickname?: string
  email?: string
  avatar?: string
  uuid: string
  createdAt: number
  updatedAt: number
}

export interface UserFilters {
  uuid?: string
  email?: string
  name?: string
}

/**
 * Hook for querying user data with industry-standard patterns
 */
export const useUser = (
  filters: UserFilters = {},
  options?: {
    enabled?: boolean
    onSuccess?: (data: UserData[]) => void
    onError?: (error: string) => void
  }
) => {
  const queryFn = useMemo(() => {
    return (database: any) => {
      try {
        if (!database) return null

        let query = database.collections.get('users').query()

        // Apply filters
        if (filters.uuid) {
          query = query.extend(Q.where('uuid', filters.uuid))
        }

        if (filters.email) {
          query = query.extend(Q.where('email', filters.email))
        }

        if (filters.name) {
          query = query.extend(Q.where('name', Q.like(`%${filters.name}%`)))
        }

        // Sort by name
        query = query.extend(Q.sortBy('name', Q.asc))

        return query
      } catch (error) {
        console.error('Error creating user query:', error)
        return null
      }
    }
  }, [filters])

  const { data: users, isLoading, error, refetch } = useBaseQuery<User>(
    queryFn as () => Query<User> | null,
    options
  )

  // Transform raw users to formatted data
  const formattedUsers = useMemo(() => {
    return users.map((user): UserData => {
      try {
        return {
          id: user.id,
          name: user.name,
          nickname: user.nickname,
          email: user.email,
          avatar: user.avatar,
          uuid: user.uuid,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      } catch (error) {
        console.error('Error formatting user:', error)
        return {
          id: user.id,
          name: 'Error formatting user',
          uuid: user.uuid,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    })
  }, [users])

  return {
    users: formattedUsers,
    isLoading,
    error,
    refetch
  }
}



/**
 * Hook for user mutations (create, update, delete)
 */
export const useUserMutations = (options?: {
  onSuccess?: (result: any) => void
  onError?: (error: string) => void
}) => {
  const database = useDatabase()
  const [state, setState] = useState<{
    isLoading: boolean
    error: string | null
    isSuccess: boolean
  }>({
    isLoading: false,
    error: null,
    isSuccess: false
  })

  const resetState = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      isSuccess: false
    })
  }, [])

  const handleError = useCallback((error: Error) => {
    const errorMessage = error.message || 'User operation failed'
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: errorMessage,
      isSuccess: false
    }))
    options?.onError?.(errorMessage)
  }, [options])

  const handleSuccess = useCallback((result: any) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: null,
      isSuccess: true
    }))
    options?.onSuccess?.(result)
  }, [options])

  // Create user
  const createUser = useCallback(async (data: {
    name: string
    nickname?: string
    email?: string
    avatar?: string
    uuid: string
  }) => {
    if (!database) {
      handleError(new Error('Database not available'))
      return null
    }

    setState(prev => ({ ...prev, isLoading: true, error: null, isSuccess: false }))

    try {
      await database.write(async () => {
        await database.collections
          .get('users')
          .create((record: any) => {
            record.name = data.name
            record.nickname = data.nickname
            record.email = data.email
            record.avatar = data.avatar
            record.uuid = data.uuid
          })
      })

      handleSuccess({ message: 'User created successfully' })
      return true
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to create user'))
      return null
    }
  }, [database, handleError, handleSuccess])

  // Update user
  const updateUser = useCallback(async (userId: string, data: Partial<{
    name: string
    nickname: string
    email: string
    avatar: string
  }>) => {
    if (!database) {
      handleError(new Error('Database not available'))
      return null
    }

    setState(prev => ({ ...prev, isLoading: true, error: null, isSuccess: false }))

    try {
      await database.write(async () => {
        const user = await database.collections
          .get('users')
          .find(userId)

        await user.update((record: any) => {
          if (data.name !== undefined) record.name = data.name
          if (data.nickname !== undefined) record.nickname = data.nickname
          if (data.email !== undefined) record.email = data.email
          if (data.avatar !== undefined) record.avatar = data.avatar
        })
      })

      handleSuccess({ message: 'User updated successfully' })
      return true
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to update user'))
      return null
    }
  }, [database, handleError, handleSuccess])

  // Delete user
  const deleteUser = useCallback(async (userId: string) => {
    if (!database) {
      handleError(new Error('Database not available'))
      return null
    }

    setState(prev => ({ ...prev, isLoading: true, error: null, isSuccess: false }))

    try {
      await database.write(async () => {
        const user = await database.collections
          .get('users')
          .find(userId)

        await user.destroyPermanently()
      })

      handleSuccess({ message: 'User deleted successfully' })
      return true
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to delete user'))
      return null
    }
  }, [database, handleError, handleSuccess])

  return {
    // State
    ...state,
    
    // Actions
    createUser,
    updateUser,
    deleteUser,
    resetState
  }
} 