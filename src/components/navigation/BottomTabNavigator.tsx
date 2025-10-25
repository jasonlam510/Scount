import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useI18n } from '@/hooks';

import GroupScreen from '@/screens/Group/GroupScreen';
import PersonalScreen from '@/screens/Personal/PersonalScreen';
import ProfileScreen from '@/screens/Profile/ProfileScreen';

export type BottomTabParamList = {
  Group: undefined;
  Personal: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Group') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          } else if (route.name === 'Personal') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Profile') {
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
      <Tab.Screen 
        name="Group" 
        component={GroupScreen}
        options={{ tabBarLabel: t('navigation.group') }}
      />
      <Tab.Screen 
        name="Personal" 
        component={PersonalScreen}
        options={{ tabBarLabel: t('navigation.personal') }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: t('navigation.profile') }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator; 