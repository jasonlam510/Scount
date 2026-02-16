import React from "react";
import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, useI18n } from "@/hooks";
import { useAuthContext } from "@/contexts";
import { useInitializeStores } from "@/hooks/useInitializeStores";

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
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="group"
        options={{
          tabBarLabel: t("navigation.group"),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "calculator" : "calculator-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="personal"
        options={{
          tabBarLabel: t("navigation.personal"),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "wallet" : "wallet-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: t("navigation.profile"),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
