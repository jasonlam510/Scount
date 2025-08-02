import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useDatabase } from './src/hooks';
import { PreferencesProvider } from './src/contexts/PreferencesContext';
import { BottomTabNavigator } from './src/components/navigation';
import './src/i18n'; // Import i18n configuration

const Stack = createStackNavigator();

// Database initializer component
const DatabaseInitializer: React.FC = () => {
  // This will trigger database initialization and health check
  useDatabase();
  return null;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <ThemeProvider>
            <NavigationContainer>
              {/* Initialize database on app startup */}
              <DatabaseInitializer />
              
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
    </SafeAreaProvider>
  );
}
