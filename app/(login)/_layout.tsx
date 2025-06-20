import { Stack } from 'expo-router';
import React from 'react';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(login)/login" />
      <Stack.Screen name="(login)/index" />
      <Stack.Screen name="(login)" />
    </Stack>
  );
}