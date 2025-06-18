import React from 'react';
import { ScrollView, View } from 'react-native';
import StoryCard, { StoryCardDetails } from './StoryCard';

interface StoryCaroselProps {
    storyCards: StoryCardDetails[];
    }

const StoryCarosel = ({storyCards}: StoryCaroselProps) => {
  return (
    <ScrollView className = "pl-2 mt-3 mb-2 flex-1 w-full h-full border-b pb-3 border-divider "
      horizontal={true}
      showsHorizontalScrollIndicator={false}>
      <View className="flex-row justify-center items-center gap-2 mr-2">
            {storyCards.map((cardDetails) => <StoryCard {...cardDetails} />)}
      </View>
    </ScrollView>
  )
}

export default StoryCarosel