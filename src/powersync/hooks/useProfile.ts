import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { db } from '../SystemProvider.tsx';
import { useUser } from '../../hooks/useUser';
import { Profile } from '../../types/profiles';

interface UseProfileResult {
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * PowerSync hook to fetch the current user's profile data
 * Uses the user's UUID to query their profile from the profiles table
 */
export const useProfile = (): UseProfileResult => {
  const { currentUserUuid } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentUserUuid) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Query the user's profile using Kysely (type-safe)
        const result = await db.selectFrom('profiles')
          .selectAll()
          .where('id', '=', currentUserUuid)
          .limit(1)
          .execute();

        if (!isCancelled) {
          if (result.length > 0) {
            const profileData = result[0];
            // No manual type casting needed - Kysely provides type safety
            const userProfile: Profile = {
              id: profileData.id,
              name: profileData.name,
              avatar: profileData.avatar || '',
              created_at: profileData.created_at,
            };

            setProfile(userProfile);
            console.log(`✅ Loaded profile for user ${currentUserUuid}`);
          } else {
            // No profile found - create one automatically
            console.log(`⚠️ No profile found for user ${currentUserUuid}, creating new profile...`);
            
            try {
              const newProfile = {
                id: currentUserUuid,
                name: 'New User',
                avatar: '',
                created_at: new Date().toISOString(),
              };

              // Insert new profile using PowerSync
              await db.insertInto('profiles')
                .values(newProfile)
                .execute();

              setProfile(newProfile);
              console.log(`✅ Created new profile for user ${currentUserUuid}`);
            } catch (createError) {
              console.error('❌ Error creating profile:::"::', createError);
              setError(createError as Error);
              setProfile(null);
            }
          }
        }
      } catch (err) {
        console.error('❌ Error fetching user profile:', err);
        if (!isCancelled) {
          setError(err as Error);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    // Cleanup function
    return () => {
      isCancelled = true;
    };
  }, [currentUserUuid]);

  // Manual refresh function
  const refresh = async () => {
    if (!currentUserUuid) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await db.selectFrom('profiles')
        .selectAll()
        .where('id', '=', currentUserUuid)
        .limit(1)
        .execute();
      
      if (result.length > 0) {
        const profileData = result[0];
        const userProfile: Profile = {
          id: profileData.id,
          name: profileData.name,
          avatar: profileData.avatar || '',
          created_at: profileData.created_at,
        };
        
        setProfile(userProfile);
        console.log(`🔄 Refreshed profile for user ${currentUserUuid}`);
      } else {
        // No profile found - create one automatically
        console.log(`⚠️ No profile found during refresh for user ${currentUserUuid}, creating new profile...`);
        
        try {
          const newProfile = {
            id: currentUserUuid,
            name: 'New User',
            avatar: '',
            created_at: new Date().toISOString(),
          };

          // Insert new profile using PowerSync
          await db.insertInto('profiles')
            .values(newProfile)
            .execute();

          setProfile(newProfile);
          console.log(`✅ Created new profile during refresh for user ${currentUserUuid}`);
        } catch (createError) {
          console.error('❌ Error creating profile during refresh:', createError);
          setError(createError as Error);
          setProfile(null);
        }
      }
    } catch (err) {
      console.error('❌ Error refreshing profile:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    refresh,
  };
};

/**
 * Real-time version using PowerSync's watch functionality
 * Automatically updates when profile data changes
 */
export const useProfileRealtime = (): UseProfileResult => {
  const { currentUserUuid } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentUserUuid) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const watchProfile = async () => {
      try {
        setError(null);

        // Use Kysely watch for real-time updates (type-safe)
        const query = db.selectFrom('profiles')
          .selectAll()
          .where('id', '=', currentUserUuid)
          .limit(1);

        db.watch(query, {
          onResult: async (results) => {
            if (isCancelled) return;

            if (results.length > 0) {
              const profileData = results[0];
              const userProfile: Profile = {
                id: profileData.id,
                name: profileData.name,
                avatar: profileData.avatar || '',
                created_at: profileData.created_at,
              };

              setProfile(userProfile);
              console.log(`🔄 Real-time profile update [${Platform.OS}] for user ${currentUserUuid}`);
            } else {
              // No profile found - create one automatically
              console.log(`⚠️ No profile found in realtime for user ${currentUserUuid}, creating new profile...`);
              
              try {
                const newProfile = {
                  id: currentUserUuid,
                  name: 'New User',
                  avatar: '',
                  created_at: new Date().toISOString(),
                };

                // Insert new profile using PowerSync
                await db.insertInto('profiles')
                  .values(newProfile)
                  .execute();

                setProfile(newProfile);
                console.log(`✅ Created new profile in realtime for user ${currentUserUuid}`);
              } catch (createError) {
                console.error('❌ Error creating profile in realtime:', createError);
                setError(createError as Error);
                setProfile(null);
              }
            }
            
            setIsLoading(false);
          }
        });
      } catch (err) {
        console.error('❌ Error watching user profile:', err);
        if (!isCancelled) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    };

    watchProfile();

    // Cleanup function
    return () => {
      isCancelled = true;
    };
  }, [currentUserUuid]);

  // Manual refresh function for consistency
  const refresh = async () => {
    if (!currentUserUuid) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await db.selectFrom('profiles')
        .selectAll()
        .where('id', '=', currentUserUuid)
        .limit(1)
        .execute();
      
      if (result.length > 0) {
        const profileData = result[0];
        const userProfile: Profile = {
          id: profileData.id,
          name: profileData.name,
          avatar: profileData.avatar || '',
          created_at: profileData.created_at,
        };
        
        setProfile(userProfile);
        console.log(`🔄 Refreshed profile (realtime) for user ${currentUserUuid}`);
      } else {
        // No profile found - create one automatically
        console.log(`⚠️ No profile found during realtime refresh for user ${currentUserUuid}, creating new profile...`);
        
        try {
          const newProfile = {
            id: currentUserUuid,
            name: 'New User',
            avatar: '',
            created_at: new Date().toISOString(),
          };

          // Insert new profile using PowerSync
          await db.insertInto('profiles')
            .values(newProfile)
            .execute();

          setProfile(newProfile);
          console.log(`✅ Created new profile during realtime refresh for user ${currentUserUuid}`);
        } catch (createError) {
          console.error('❌ Error creating profile during realtime refresh:', createError);
          setError(createError as Error);
          setProfile(null);
        }
      }
    } catch (err) {
      console.error('❌ Error refreshing profile:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    refresh,
  };
};
