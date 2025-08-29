import { useAppSettingsStore } from '../zustand';
import { useUserStore } from '../zustand';

export const useUser = () => {
  const {
    // User state
    currentUserUuid,
    accessToken,
    refreshToken,
    userProfile,
    
    // Actions
    setCurrentUserUuid,
    setAccessToken,
    setRefreshToken,
    setUserProfile,
    updateUserProfile,
    login,
    logout,
    clearUserData,
  } = useUserStore();

  // Computed values
  const isAuthenticated = !!(accessToken && currentUserUuid);

  return {
    // User data
    currentUserUuid,
    accessToken,
    refreshToken,
    userProfile,
    isAuthenticated,
    
    // User management
    setCurrentUserUuid,
    setAccessToken,
    setRefreshToken,
    setUserProfile,
    updateUserProfile,
    
    // Authentication
    login,
    logout,
    clearUserData,
  };
};
