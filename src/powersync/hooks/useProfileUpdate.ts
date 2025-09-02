import { useState } from 'react';
import { Platform } from 'react-native';
import { db } from '../SystemProvider.tsx';
import { useUser } from '../../hooks/useUser';
import { Profile } from '../../types/profiles';

interface UseProfileUpdateResult {
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  isUpdating: boolean;
  error: Error | null;
  clearError: () => void;
}

/**
 * Hook for updating user profile data using Kysely
 * Provides type-safe database operations for profile updates
 */
export const useProfileUpdate = (): UseProfileUpdateResult => {
  const { currentUserUuid } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clearError = () => setError(null);

  const updateProfile = async (updates: Partial<Profile>): Promise<void> => {
    if (!currentUserUuid) {
      throw new Error('No user ID available');
    }

    // Clear any previous errors
    setError(null);
    setIsUpdating(true);

    try {
      console.log(`🔄 Updating profile [${Platform.OS}] for user ${currentUserUuid}:`, updates);

      // Filter out undefined values and id (shouldn't be updated)
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([key, value]) => 
          value !== undefined && key !== 'id'
        )
      );

      if (Object.keys(cleanUpdates).length === 0) {
        console.log('⚠️ No valid updates provided');
        return;
      }

      // Use Kysely to update the profile (type-safe)
      const result = await db.updateTable('profiles')
        .set(cleanUpdates)
        .where('id', '=', currentUserUuid)
        .execute();

      console.log(`✅ Profile updated successfully [${Platform.OS}]:`, result);

      // Note: Real-time updates will be handled automatically by useProfileRealtime
      // PowerSync will sync changes to Supabase and other devices
      
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      const errorMessage = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(errorMessage);
      throw errorMessage; // Re-throw so component can handle it
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateProfile,
    isUpdating,
    error,
    clearError,
  };
};

/**
 * Convenience hook for updating specific profile fields
 * Provides specialized methods for common update operations
 */
export const useProfileFieldUpdate = () => {
  const { updateProfile, isUpdating, error, clearError } = useProfileUpdate();

  const updateName = async (name: string): Promise<void> => {
    await updateProfile({ name: name.trim() });
  };

  const updateNickname = async (nickname: string): Promise<void> => {
    await updateProfile({ nickname: nickname.trim() });
  };

  const updateAvatar = async (avatar: string): Promise<void> => {
    await updateProfile({ avatar });
  };

  return {
    updateName,
    updateNickname,
    updateAvatar,
    isUpdating,
    error,
    clearError,
  };
};
