import { useEffect } from "react";
import { useAppSettingsStore } from "@/zustand/appSettingsStore";
import { useCurrencyDomainStore } from "@/zustand/currencyDomainStore";
import { useCurrencyHistoryStore } from "@/zustand/currencyHistoryStore";
import { useUserStore } from "@/zustand/userStore";

export const useInitializeStores = () => {
  const loadAppSettings = useAppSettingsStore((state) => state.loadFromStorage);
  const bootstrapCurrencyDomain = useCurrencyDomainStore(
    (state) => state.bootstrap,
  );
  const loadCurrencyHistory = useCurrencyHistoryStore(
    (state) => state.loadFromStorage,
  );
  const loadUserData = useUserStore((state) => state.loadFromStorage);

  useEffect(() => {
    // Load all stored data when the app starts
    const initializeStores = async () => {
      try {
        await Promise.all([
          loadAppSettings(),
          loadUserData(),
          loadCurrencyHistory(),
          bootstrapCurrencyDomain(),
        ]);
        console.log("✅ Stores initialized successfully");
      } catch (error) {
        console.error("❌ Failed to initialize stores:", error);
      }
    };

    initializeStores();
  }, [
    bootstrapCurrencyDomain,
    loadAppSettings,
    loadCurrencyHistory,
    loadUserData,
  ]);
};
