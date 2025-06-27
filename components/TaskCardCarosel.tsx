import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import TaskCard, { TaskCardDetails } from './TaskCard';

interface StoryCaroselProps {
  taskCards: TaskCardDetails[];
}

const TaskCardCarosel = ({ taskCards }: StoryCaroselProps) => {
  const sortedCards = taskCards.sort((a, b) => Number(a.accomplished) - Number(b.accomplished));

  if (sortedCards.length === 0) {
    return (
      //nothing rendered
      <View className="w-full h-[0px] flex items-center justify-center">
        <Text className="text-gray-400 text-base font-medium">No tasks</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="pl-2 pt-3 mb-0 flex-1 w-full h-full pb-3 "
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <View className="flex-row justify-center items-center gap-2 mr-2">
        {sortedCards.map((cardDetails) => (
          <TaskCard key={cardDetails.taskID} {...cardDetails} />
        ))}
      </View>
    </ScrollView>
  );
};

export default TaskCardCarosel;
