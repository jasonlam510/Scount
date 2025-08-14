import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider';
import { SettingsProvider } from './src/contexts/AppContext';
import { BottomTabNavigator } from './src/components/navigation';
import { getDatabase } from './src/database';
import './src/i18n'; // Import i18n configuration

const Stack = createStackNavigator();

export default function App() {
  // Initialize database
  const database = getDatabase();

  return (
    <SafeAreaProvider>
      <DatabaseProvider database={database}>
        <SettingsProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {/* Main screens with bottom tabs */}
              <Stack.Screen 
                name="MainTabs" 
                component={BottomTabNavigator}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SettingsProvider>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}
