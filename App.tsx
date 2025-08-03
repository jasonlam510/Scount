import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider';
import { ThemeProvider } from './src/hooks';
import { PreferencesProvider } from './src/contexts/PreferencesContext';
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
        <PreferencesProvider>
          <ThemeProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* Main screens with bottom tabs */}
                <Stack.Screen 
                  name="MainTabs" 
                  component={BottomTabNavigator}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </ThemeProvider>
        </PreferencesProvider>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}
