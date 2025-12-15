import { useEffect } from "react";
import { useAppSettingsStore } from "@/zustand/appSettingsStore";
import { useUserStore } from "@/zustand/userStore";

export const useInitializeStores = () => {
  const loadAppSettings = useAppSettingsStore((state) => state.loadFromStorage);
  const loadUserData = useUserStore((state) => state.loadFromStorage);

  useEffect(() => {
    // Load all stored data when the app starts
    const initializeStores = async () => {
      try {
        await Promise.all([loadAppSettings(), loadUserData()]);
        console.log("✅ Stores initialized successfully");
      } catch (error) {
        console.error("❌ Failed to initialize stores:", error);
      }
    };

    initializeStores();
  }, [loadAppSettings, loadUserData]);
};
