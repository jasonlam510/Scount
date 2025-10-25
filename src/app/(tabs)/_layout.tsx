import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useI18n } from '@/hooks';
import { useAuthContext } from '@/contexts';
import { useInitializeStores } from '@/hooks/useInitializeStores';
import { Redirect } from 'expo-router';

export default function TabsLayout() {
  const { isLoggedIn } = useAuthContext();
  const { colors } = useTheme();
  const { t } = useI18n();

  // Initialize stores when tabs are loaded
  useInitializeStores();

  // If user is not logged in, redirect to auth
  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'group') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          } else if (route.name === 'personal') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen 
        name="group" 
        options={{ tabBarLabel: t('navigation.group') }}
      />
      <Tabs.Screen 
        name="personal" 
        options={{ tabBarLabel: t('navigation.personal') }}
      />
      <Tabs.Screen 
        name="profile" 
        options={{ tabBarLabel: t('navigation.profile') }}
      />
    </Tabs>
  );
}
