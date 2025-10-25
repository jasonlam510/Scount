import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomTabNavigator, AppNavigator } from '@/components/navigation';
import { LoadingScreen } from '@/components';
import { useInitializeStores } from '@/hooks/useInitializeStores';
import { connectDatabase } from '@/powersync';
import { AuthProvider } from '@/contexts';
import { useTheme } from '@/hooks/useTheme';
import '@/i18n'; // Import i18n configuration

export default function App() {
  const [powerSyncReady, setPowerSyncReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const { colors } = useTheme();

  // Initialize Zustand stores on app start
  useInitializeStores();

  // Initialize PowerSync
  useEffect(() => {
    const initializePowerSync = async () => {
      try {
        console.log('🚀 Initializing PowerSync...');
        
        // Connect PowerSync using the new connectDatabase function
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
      <SafeAreaProvider>
        <LoadingScreen 
          messageKey="common.initializing"
          error={initError || undefined}
          showError={!!initError}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
