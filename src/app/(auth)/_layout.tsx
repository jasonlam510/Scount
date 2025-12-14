import React from 'react';
import { Stack , Redirect } from 'expo-router';
import { useAuthContext } from '@/contexts';

export default function AuthLayout() {
  const { isLoggedIn } = useAuthContext();

  // If user is logged in, redirect to tabs
  if (isLoggedIn) {
    return <Redirect href="/personal" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="check-email" />
    </Stack>
  );
}
