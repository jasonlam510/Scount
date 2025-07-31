import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

import GroupScreen from '../screens/Group/GroupScreen';
import PersonalScreen from '../screens/Personal/PersonalScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

export type BottomTabParamList = {
  Group: undefined;
  Personal: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabs: React.FC = () => {
  const { colors } = useTheme();

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
      />
      <Tab.Screen 
        name="Personal" 
        component={PersonalScreen}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs; 