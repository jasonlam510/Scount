import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import { useAuthContext } from '../../contexts';
import { useTheme } from '../../hooks/useTheme';
import LoadingScreen from '../LoadingScreen';
import LoginScreen from '../../screens/Auth/LoginScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isLoading, isLoggedIn } = useAuthContext();
  const { colors } = useTheme();

  // Show loading screen while auth is initializing
  if (isLoading) {
    return <LoadingScreen messageKey="common.loading" />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          // User is authenticated - show main app
          <Stack.Screen 
            name="MainTabs" 
            component={BottomTabNavigator}
          />
        ) : (
          // User is not authenticated - show login screen
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
