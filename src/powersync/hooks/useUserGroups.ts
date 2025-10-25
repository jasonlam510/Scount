import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { db } from '@/powersync/SystemProvider.tsx';
import { useUser } from '@/hooks/useUser';
import { Group } from '@/types/groups';

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

        // Use Kysely to get user's groups (type-safe)
        // PowerSync handles the joining via sync rules, so we can query groups directly
        const result = await db.selectFrom('groups')
          .selectAll()
          .orderBy('created_at', 'desc')
          .execute();

        if (!isCancelled) {
          // No manual type casting needed - Kysely provides type safety
          const userGroups: Group[] = result.map((row) => ({
            id: row.id,
            title: row.title,
            icon: row.icon,
            currency: row.currency,
            created_at: row.created_at,
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

        // Use Kysely watch for real-time updates (type-safe)
        // PowerSync handles filtering via sync rules, so we can watch groups directly
        const query = db.selectFrom('groups')
          .selectAll()
          .orderBy('created_at', 'desc');

        db.watch(query, {
          onResult: (results) => {
            if (isCancelled) return;

            // No manual type casting needed - Kysely provides type safety
            const userGroups: Group[] = results.map((row) => ({
              id: row.id,
              title: row.title,
              icon: row.icon,
              currency: row.currency,
              created_at: row.created_at,
            }));

            setGroups(userGroups);
            setIsLoading(false);
            
            console.log(`🔄 Real-time update [${Platform.OS}]: ${userGroups.length} groups for user ${currentUserUuid}`);
          }
        });
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
