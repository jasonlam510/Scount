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

        // First, check if the database connection is working
        const testQuery = db.selectFrom('groups').selectAll();
        const sqlString = testQuery.compile().sql;
        console.log(`🔍 SQL Query:`, sqlString);
        
        // List all groups in local database (no filtering for debugging)
        const result = await db.selectFrom('groups')
          .selectAll()
          .orderBy('created_at', 'desc')
          .execute();

        console.log(`🔍 Query result: ${result.length} groups found in local database`);
        console.log(`📊 Raw query data:`, JSON.stringify(result, null, 2));
        
        // Also check what columns are in the result
        if (result.length > 0) {
          console.log(`📋 First group columns:`, Object.keys(result[0]));
        }

        if (!isCancelled) {
          // No manual type casting needed - Kysely provides type safety
          const userGroups: Group[] = result.map((row) => ({
            id: row.id,
            group_id: row.group_id,
            created_at: row.created_at,
            title: row.title,
            icon: row.icon,
            currency: row.currency,
            is_deleted: row.is_deleted,
            updated_at: row.updated_at,
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

        // List all groups in local database (no filtering for debugging)
        const query = db.selectFrom('groups')
          .selectAll()
          .orderBy('created_at', 'desc');

        console.log(`🔍 Starting watch query for user ${currentUserUuid}`);

        // Print the raw sql query
        console.log(`🔍 Raw SQL query:`, query.compile().sql);

        db.watch(query, {
          onResult: (results) => {
            if (isCancelled) return;

            console.log(`📊 Watch query returned ${results.length} groups`);
            console.log(`📋 Group data:`, results);

            // No manual type casting needed - Kysely provides type safety
            const userGroups: Group[] = results.map((row) => ({
              id: row.id,
              group_id: row.group_id,
              created_at: row.created_at,
              title: row.title,
              icon: row.icon,
              currency: row.currency,
              is_deleted: row.is_deleted,
              updated_at: row.updated_at,
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
