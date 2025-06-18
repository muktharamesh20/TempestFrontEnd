import { numbers } from '@/constants/numbers';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo for the bell icon
import React from 'react';
import { Image, View } from 'react-native';

const SimpleHeader = () => {
  return (
    <View
      style={{ height: numbers.headerHeight }}
      className="absolute mt-0 w-full flex flex-row justify-between items-center bg-primary border-b border-divider px-4 z-50"
    >
      {/* Logo on the left */}
      <Image source={require('../assets/tempestlogo.png')} className="w-[120px]" resizeMode="contain" />

      {/* Bell icon on the right */}
      <Ionicons name="notifications-outline" size={24} color="black" />
    </View>
  );
};

export default SimpleHeader;
