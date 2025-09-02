import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator } from 'react-native';
import { BottomTabNavigator } from './src/components/navigation';
import { useInitializeStores } from './src/hooks/useInitializeStores';
import { connectDatabase } from './src/powersync';
import './src/i18n'; // Import i18n configuration

const Stack = createStackNavigator();

export default function App() {
  const [powerSyncReady, setPowerSyncReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

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
        setInitError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    initializePowerSync();
  }, []);

  // Show loading screen while PowerSync initializes
  if (!powerSyncReady) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
            Initializing PowerSync...
          </Text>
          {initError && (
            <Text style={{ marginTop: 8, fontSize: 14, color: '#ff3b30', textAlign: 'center', paddingHorizontal: 20 }}>
              Error: {initError}
            </Text>
          )}
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Main screens with bottom tabs */}
          <Stack.Screen 
            name="MainTabs" 
            component={BottomTabNavigator}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
