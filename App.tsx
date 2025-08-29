import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomTabNavigator } from './src/components/navigation';
import { useInitializeStores } from './src/hooks/useInitializeStores';
import './src/i18n'; // Import i18n configuration

const Stack = createStackNavigator();

export default function App() {
  // Initialize Zustand stores on app start
  useInitializeStores();

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
