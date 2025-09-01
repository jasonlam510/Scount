import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { powerSync } from '../SystemProvider.tsx';
import { useUser } from '../../hooks/useUser';
import { Group } from '../../types/groups';

interface UseUserGroupsResult {
  groups: Group[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * PowerSync hook to fetch groups where the current user is a participant
 * Uses SQL JOIN query for efficient server-side filtering
 */
export const useUserGroups = (): UseUserGroupsResult => {
  const { currentUserUuid } = useUser();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentUserUuid) {
      setGroups([]);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchUserGroups = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use PowerSync to get user's groups
        // PowerSync handles the joining via sync rules, so we can query groups directly
        const result = await powerSync.getAll(`
          SELECT * FROM groups
          ORDER BY created_at DESC
        `);

        if (!isCancelled) {
          const userGroups = result.map((row: any) => ({
            id: row.id as string,
            title: row.title as string,
            icon: row.icon as string,
            currency: row.currency as string,
            created_at: row.created_at as string,
          }));

          setGroups(userGroups);
          console.log(`✅ Loaded ${userGroups.length} groups for user ${currentUserUuid}`);
        }
      } catch (err) {
        console.error('❌ Error fetching user groups:', err);
        if (!isCancelled) {
          setError(err as Error);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchUserGroups();

    // Cleanup function
    return () => {
      isCancelled = true;
    };
  }, [currentUserUuid]);

  return {
    groups,
    isLoading,
    error,
  };
};

/**
 * Alternative hook using PowerSync's watch functionality for real-time updates
 * This version will automatically update when data changes
 */
export const useUserGroupsRealtime = (): UseUserGroupsResult => {
  const { currentUserUuid } = useUser();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentUserUuid) {
      setGroups([]);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const watchUserGroups = async () => {
      try {
        setError(null);

        // Use PowerSync watch for real-time updates
        // PowerSync handles filtering via sync rules, so we can watch groups directly
        const watchQuery = powerSync.watch(`
          SELECT * FROM groups
          ORDER BY created_at DESC
        `);

        // Process real-time updates
        for await (const result of watchQuery) {
          if (isCancelled) break;

          const userGroups = (result.rows?._array || []).map((row: any) => ({
            id: row.id as string,
            title: row.title as string,
            icon: row.icon as string,
            currency: row.currency as string,
            created_at: row.created_at as string,
          }));

          setGroups(userGroups);
          setIsLoading(false);
          
          console.log(`🔄 Real-time update [${Platform.OS}]: ${userGroups.length} groups for user ${currentUserUuid}`);
        }
      } catch (err) {
        console.error('❌ Error watching user groups:', err);
        if (!isCancelled) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    };

    watchUserGroups();

    // Cleanup function
    return () => {
      isCancelled = true;
    };
  }, [currentUserUuid]);

  return {
    groups,
    isLoading,
    error,
  };
};
