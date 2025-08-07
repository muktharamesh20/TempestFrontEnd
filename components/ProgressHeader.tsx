import { numbers } from '@/constants/numbers';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  frequencey: string;
}

const ProgressHeader = ({ title, frequencey }: HeaderProps) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={{ height: 80 + insets.top, backgroundColor: numbers.primaryColor }}>
      <View
        style={{ marginTop: insets.top }}
        className="h-[80px] px-6 bg-primary border-b border-divider flex-row items-center justify-between z-50"
      >
        {/* Right: Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={30} color={numbers.secondaryColor} />
        </TouchableOpacity>

        {/* Center: Title + Frequency */}
        <View className="flex flex-col items-center justify-center">
          <Text className="text-black text-3xl font-bold leading-tight">{title}</Text>
          <Text className="text-secondary text-lg mt-[-2px]">{frequencey}</Text>
        </View>


        {/* Bell icon on the right */}
        {/* <Ionicons name="three-dots" size={24} color={numbers.secondaryColor} /> */}
        <Entypo name="dots-three-horizontal" size={24} color={numbers.primaryColor} />


      </View>
    </View>
  );
};

export default ProgressHeader;
