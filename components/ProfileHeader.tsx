import { numbers } from '@/constants/numbers';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo for the bell icon
import { Link } from 'expo-router';
import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProfileHeader = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ height: numbers.headerHeight + insets.top }}>
      <View
        style={{ height: numbers.headerHeight, marginTop: insets.top }}
        className="absolute w-full flex flex-row justify-between items-center bg-primary border-b border-divider px-4 z-50"
      >
        {/* Logo on the left */}
        <Image source={require('../assets/tempestlogo.png')} className="w-[120px]" resizeMode="contain" />

        {/* Bell icon on the right */}
        <View className='flex flex-row gap-5 mr-[2px]'>
        <Link href={'/settings/settings'} asChild>
          <Pressable>
            <Ionicons name='settings-outline' size={24}/>
          </Pressable>
        </Link>
        <Ionicons name="notifications-outline" size={24} color={numbers.secondaryColor} />
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;
