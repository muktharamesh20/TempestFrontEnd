import React from 'react'
import { Text, View } from 'react-native'

const FollowingOrGlobal = () => {
  return (
    <View className= "flex flex-row justify-center items-center gap-5 h-[44px] border-b pb-1 border-divider bg-primary">
      <Text className='text-3xl font-semibold text-gray-500'>Following</Text>
      <Text className='text-3xl font-semibold'>Global</Text>
    </View>
  )
}

export default FollowingOrGlobal