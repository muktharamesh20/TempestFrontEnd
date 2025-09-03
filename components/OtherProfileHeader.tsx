import { images } from '@/constants/images';
import { numbers } from '@/constants/numbers';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface OtherProfileHeaderProps {
  username: string;
  threeDotsPressed: () => void;
}

const OtherProfileHeader: React.FC<OtherProfileHeaderProps> = ({ username, threeDotsPressed }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={{ height: numbers.headerHeight + insets.top }}>
      <View
        style={{ height: numbers.headerHeight, marginTop: insets.top }}
        className="absolute w-full flex flex-row justify-between items-center bg-primary border-b border-divider px-4 z-50"
      >
        {/* Back arrow */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={numbers.secondaryColor} />
        </TouchableOpacity>

        <View style={{gap:1}} className="flex flex-row items-center">
          {/* Username in the center */}
          <Text className="text-xl font-semibold text-secondary" numberOfLines={1}>
            {username}'s
          </Text>
          <Image source = {images.capsule} style={{width:100, height:30, borderRadius:15}}/>
        </View>

        {/* Placeholder for spacing on the right (same width as back arrow) */}
        <TouchableOpacity onPress={threeDotsPressed}>
          <Entypo name="dots-three-horizontal" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OtherProfileHeader;
