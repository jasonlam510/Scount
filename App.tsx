import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator } from 'react-native';
import { BottomTabNavigator, AppNavigator } from './src/components/navigation';
import { useInitializeStores } from './src/hooks/useInitializeStores';
import { connectDatabase } from './src/powersync';
import { AuthProvider } from './src/contexts';
import { useTheme } from './src/hooks/useTheme';
import './src/i18n'; // Import i18n configuration

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
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: colors.background 
        }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ 
            marginTop: 16, 
            fontSize: 16, 
            color: colors.textSecondary 
          }}>
            Initializing PowerSync...
          </Text>
          {initError && (
            <Text style={{ 
              marginTop: 8, 
              fontSize: 14, 
              color: colors.danger, 
              textAlign: 'center', 
              paddingHorizontal: 20 
            }}>
              Error: {initError}
            </Text>
          )}
        </View>
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
