import SimpleHeader from '@/components/CustomHeader';
import StoryCard from '@/components/StoryCard';
import { numbers } from '@/constants/numbers';
import React from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';

const saved = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className = "flex flex-col gap-0 bg-primary h-full w-full">
        <SimpleHeader/>

        <FlatList
          data={[{ key: '1' }]} // Example data array
          contentContainerStyle={{paddingTop: numbers.headerHeight}}
          renderItem={() => (
            <View className="flex-1 justify-center items-center">
              <Text className="text-5xl text-accent font-bold">Welcome!</Text>
              <StoryCard personID="1" taskID="h" groupName="Gym ofc 🏋️" taskName="little rhea kid gym day" mytask={true} backlog={false} dueDay={new Date("2025-06-19T00:00:00Z")} />
            </View>
          )}
        />


      </View>
    </SafeAreaView>
  );
}

export default saved