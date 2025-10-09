import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ActivityIndicator } from 'react-native';
import BottomTabNavigator from './BottomTabNavigator';
import { useAuthContext } from '../../contexts';
import { useTheme } from '../../hooks/useTheme';
import LoginScreen from '../../screens/Auth/LoginScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isLoading, isLoggedIn } = useAuthContext();
  const { colors } = useTheme();

  // Show loading screen while auth is initializing
  if (isLoading) {
    return (
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
          Loading...
        </Text>
      </View>
    );
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
