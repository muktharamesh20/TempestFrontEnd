import React from 'react'
import { Text, View } from 'react-native'

const FollowingOrGlobal = () => {
  return (
    <View className= "flex flex-row justify-center items-center gap-4">
      <Text className='border border-black bg-white h-[20]'>Following</Text>
      <Text className='border border-black bg-white h-[20]'>Global</Text>
    </View>
  )
}

export default FollowingOrGlobal