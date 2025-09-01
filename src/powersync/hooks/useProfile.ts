import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { powerSync } from '../SystemProvider.tsx';
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

        // Query the user's profile from PowerSync
        const result = await powerSync.getAll(`
          SELECT * FROM profiles
          WHERE id = ?
          LIMIT 1
        `, [currentUserUuid]);

        if (!isCancelled) {
          if (result.length > 0) {
            const profileData = result[0];
            const userProfile: Profile = {
              id: profileData.id as string,
              name: profileData.name as string,
              nickname: profileData.nickname as string,
              email: profileData.email as string,
              avatar: profileData.avatar as string,
              created_at: profileData.created_at as string,
            };

            setProfile(userProfile);
            console.log(`✅ Loaded profile for user ${currentUserUuid}`);
          } else {
            setProfile(null);
            console.log(`⚠️ No profile found for user ${currentUserUuid}`);
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
      
      const result = await powerSync.getAll(`
        SELECT * FROM profiles
        WHERE id = ?
        LIMIT 1
      `, [currentUserUuid]);
      
      if (result.length > 0) {
        const profileData = result[0];
        const userProfile: Profile = {
          id: profileData.id as string,
          name: profileData.name as string,
          nickname: profileData.nickname as string,
          email: profileData.email as string,
          avatar: profileData.avatar as string,
          created_at: profileData.created_at as string,
        };
        
        setProfile(userProfile);
        console.log(`🔄 Refreshed profile for user ${currentUserUuid}`);
      } else {
        setProfile(null);
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

        // Use PowerSync watch for real-time updates
        const watchQuery = powerSync.watch(`
          SELECT * FROM profiles
          WHERE id = ?
          LIMIT 1
        `, [currentUserUuid]);

        // Process real-time updates
        for await (const result of watchQuery) {
          if (isCancelled) break;

          const profiles = result.rows?._array || [];
          
          if (profiles.length > 0) {
            const profileData = profiles[0];
            const userProfile: Profile = {
              id: profileData.id as string,
              name: profileData.name as string,
              nickname: profileData.nickname as string,
              email: profileData.email as string,
              avatar: profileData.avatar as string,
              created_at: profileData.created_at as string,
            };

            setProfile(userProfile);
            console.log(`🔄 Real-time profile update [${Platform.OS}] for user ${currentUserUuid}`);
          } else {
            setProfile(null);
            console.log(`⚠️ Profile not found for user ${currentUserUuid}`);
          }
          
          setIsLoading(false);
        }
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
      
      const result = await powerSync.getAll(`
        SELECT * FROM profiles
        WHERE id = ?
        LIMIT 1
      `, [currentUserUuid]);
      
      if (result.length > 0) {
        const profileData = result[0];
        const userProfile: Profile = {
          id: profileData.id as string,
          name: profileData.name as string,
          nickname: profileData.nickname as string,
          email: profileData.email as string,
          avatar: profileData.avatar as string,
          created_at: profileData.created_at as string,
        };
        
        setProfile(userProfile);
      } else {
        setProfile(null);
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
