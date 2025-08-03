import { useState, useEffect } from 'react'
import { getCurrentUserUuid } from './usePreference'
import { getDatabase } from '../database'
import { User } from '../database/models'

export interface UserData {
  id: string
  name: string
  nickname?: string
  email?: string
  avatar?: string
}

export const useUser = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get current user UUID from preferences
        const currentUserUuid = await getCurrentUserUuid()
        
        if (!currentUserUuid) {
          setUserData(null)
          setIsLoading(false)
          console.log('No current user UUID found!')
          return
        }
        console.log('Current user UUID found:', currentUserUuid)

        // Fetch user data from database
        const database = getDatabase()
        if (!database) {
          throw new Error('Database not initialized')
        }

        // Query user by email
        const users = await database.read(async () => {
          return await database.collections.get('users').query().fetch() as User[]
        })

        // Find user by UUID
        const user = users.find(u => u.uuid === currentUserUuid)
        
        if (user) {
          setUserData({
            id: user.id,
            name: user.name,
            nickname: user.nickname || undefined,
            email: user.email || undefined,
            avatar: user.avatar || undefined
          })
          console.log('✅ User data fetched from database:', user.name)
        } else {
          console.warn('⚠️ User not found in database for UUID:', currentUserUuid)
          setUserData(null)
          setError('User not found in database')
        }

      } catch (err) {
        console.error('Error fetching user data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch user data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const refetch = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const currentUserUuid = await getCurrentUserUuid()
      
      if (!currentUserUuid) {
        setUserData(null)
        setIsLoading(false)
        return
      }

      const database = getDatabase()
      if (!database) {
        throw new Error('Database not initialized')
      }

      const users = await database.read(async () => {
        return await database.collections.get('users').query().fetch() as User[]
      })

      const user = users.find(u => u.uuid === currentUserUuid)
      
      if (user) {
        setUserData({
          id: user.id,
          name: user.name,
          nickname: user.nickname || undefined,
          email: user.email || undefined,
          avatar: user.avatar || undefined
        })
      } else {
        setUserData(null)
        setError('User not found in database')
      }

    } catch (err) {
      console.error('Error refetching user data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch user data')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    userData,
    isLoading,
    error,
    refetch
  }
} 