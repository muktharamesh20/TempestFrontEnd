import { Stack } from 'expo-router';
import React from 'react';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="settings/settings" />
      <Stack.Screen name="settings/settingsHeader" />
      <Stack.Screen name="settings/saved" />
      <Stack.Screen name="settings/liked" />
      <Stack.Screen name="settings/archived" />
      <Stack.Screen name="settings/recentlyViewed" />
      <Stack.Screen name="settings/manageCategories" />
      <Stack.Screen name="settings/viewCategories" />
      <Stack.Screen name="settings/notificationSettings" />
      <Stack.Screen name="settings/accountPrivacy" />
      <Stack.Screen name="settings/accountCenter" />
      <Stack.Screen name="settings/help" />
      <Stack.Screen name="settings/closeFriends" />
      <Stack.Screen name="settings/blockedUsers" />
      <Stack.Screen name="settings/deleteAccount" />
    </Stack>
  );
}