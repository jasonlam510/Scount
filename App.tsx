import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, ExpensesProvider } from './src/hooks';
import { BottomTabNavigator } from './src/components/navigation';
import './src/i18n'; // Import i18n configuration

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ExpensesProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {/* Main screens with bottom tabs */}
              <Stack.Screen 
                name="MainTabs" 
                component={BottomTabNavigator}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ExpensesProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
