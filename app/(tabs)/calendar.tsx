import CalendarHeader from '@/components/CalendarHeader';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';

const calendar = () => {
  const isFocused = useIsFocused();
  return (
    <View className="flex flex-col flex-1 gap-0 bg-primary h-full w-full">
      {isFocused && <StatusBar style="light" />}
      <CalendarHeader />
    </View>
  );
}

export default calendar