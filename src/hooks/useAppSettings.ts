import { useAppSettingsStore } from '@/zustand';

export const useAppSettings = () => {
  const {
    language,
    setLanguage,
    notificationsEnabled,
    setNotificationsEnabled,
    resetToDefaults,
  } = useAppSettingsStore();

  return {
    // Language settings
    language,
    setLanguage,
    
    // Notification settings
    notificationsEnabled,
    setNotificationsEnabled,
    
    // Actions
    resetToDefaults,
  };
};
