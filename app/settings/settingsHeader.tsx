import { numbers } from '@/constants/numbers'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SettingsHeader = ({headerName}: {headerName: string}) => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

  return (
    <View style={{ height: numbers.headerHeight + insets.top, backgroundColor: numbers.primaryColor }}>
      <View
        style={{
          height: numbers.headerHeight,
          marginTop: insets.top,
        }}
        className="absolute w-full flex flex-row items-center bg-primary border-b border-divider px-4 z-50"
      >
        {/* Back Arrow */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={numbers.secondaryColor} />
        </TouchableOpacity>

        {/* Centered Title */}
        <Text className="text-lg font-semibold text-black ml-4">{headerName}</Text>
      </View>
    </View>
  )
}

export default SettingsHeader
