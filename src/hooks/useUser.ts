import { useAppSettingsStore } from '../zustand';
import { useUserStore } from '../zustand';

export const useUser = () => {
  const {
    // User state
    currentUserUuid,
    accessToken,
    refreshToken,
    userEmail,
    
    // Actions
    setCurrentUserUuid,
    setAccessToken,
    setRefreshToken,
    setUserEmail,
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
    userEmail,
    isAuthenticated,
    
    // User management
    setCurrentUserUuid,
    setAccessToken,
    setRefreshToken,
    setUserEmail,
    
    // Authentication
    login,
    logout,
    clearUserData,
  };
};
