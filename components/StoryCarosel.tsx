import React from 'react';
import { ScrollView, View } from 'react-native';
import StoryCard, { StoryCardDetails } from './StoryCard';

interface StoryCaroselProps {
  storyCards: StoryCardDetails[];
}

const StoryCarosel = ({ storyCards }: StoryCaroselProps) => {
  storyCards = storyCards.sort((a, b) => Number(a.accomplished) - Number(b.accomplished));
  return (
    <ScrollView
      className="pl-2 pt-3 mb-0 flex-1 w-full h-full border-b pb-3 border-divider"
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <View className="flex-row justify-center items-center gap-2 mr-2">
        {
          storyCards.map((cardDetails) => (
            <StoryCard key={cardDetails.taskID || cardDetails.personID} {...cardDetails} />
          ))}
      </View>
    </ScrollView>
  );
};

// export default React.memo(StoryCarosel, (prevProps, nextProps) => {
//   // shallow comparison of storyCards reference
//   return true;
// });

export default StoryCarosel;
