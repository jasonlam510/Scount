import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts';
import { LoadingScreen } from '@/components';
import '@/i18n'; // Import i18n configuration

// Separate component for PowerSync initialization
function PowerSyncInitializer({ children }: { children: React.ReactNode }) {
  const [powerSyncReady, setPowerSyncReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initializePowerSync = async () => {
      try {
        console.log('🚀 Initializing PowerSync...');
        
        // Import dynamically to avoid circular dependencies
        const { connectDatabase } = await import('@/powersync');
        await connectDatabase();
        
        setPowerSyncReady(true);
        console.log('✅ PowerSync initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize PowerSync:', error);
        console.error('Error details:', error);
        
        // Check if it's an authentication error (no user logged in)
        if (error instanceof Error && error.message.includes('Could not fetch Supabase credentials')) {
          console.log('⚠️ PowerSync requires authentication - will initialize after login');
          setPowerSyncReady(true); // Continue without PowerSync for now
        } else {
          setInitError(error instanceof Error ? error.message : 'Unknown error');
          // For other errors, continue without PowerSync
          console.log('⚠️ Continuing without PowerSync due to error...');
          setPowerSyncReady(true);
        }
      }
    };

    initializePowerSync();
  }, []);

  // Show loading screen while PowerSync initializes
  if (!powerSyncReady) {
    return (
      <LoadingScreen 
        messageKey="common.initializing"
        error={initError || undefined}
        showError={!!initError}
      />
    );
  }

  return <>{children}</>;
}

// Separate component for store initialization
function StoreInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initializeStores = async () => {
      try {
        const { useInitializeStores } = await import('@/hooks/useInitializeStores');
        // Note: This hook should be called in a component that's inside the provider tree
        console.log('📦 Stores will be initialized by individual components');
      } catch (error) {
        console.error('❌ Failed to initialize stores:', error);
      }
    };

    initializeStores();
  }, []);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StoreInitializer>
          <PowerSyncInitializer>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </PowerSyncInitializer>
        </StoreInitializer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
