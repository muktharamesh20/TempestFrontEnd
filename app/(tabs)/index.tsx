import SimpleHeader from "@/components/CustomHeader";
import PostCard, { postDetails } from "@/components/Post";
import { StoryCardDetails } from "@/components/StoryCard";
import StoryCarosel from "@/components/StoryCarosel";
import { numbers } from "@/constants/numbers";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const postData: postDetails[] = [
    {postId: "1", postName: "Post 1", personID: "1", myPost: true},
    {postId: "2", postName: "Post 2", personID: "2", myPost: false},
  ];

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex flex-col gap-0 bg-primary h-full w-full">
        <SimpleHeader />

        <FlatList
          data={postData} // Example data array
          contentContainerStyle={{ paddingTop: numbers.headerHeight }}
          keyExtractor={(item) => item.postId} // Use the keyExtractor to set the key
          renderItem={({ item }) => (
            <PostCard {...item}/>
          )}
          ListHeaderComponent={
            <View>
            <StoryCarosel storyCards={[storyCardDetails1, storyCardDetails2, storyCardDetails3]} />
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const storyCardDetails1: StoryCardDetails = { 
    personID: "1", 
    taskID: "h", 
    groupName: "Gym ofc 🏋️", 
    taskName: "little rhea kid gym day", 
    mytask: true, 
    backlog: false, 
    dueDay: new Date("2025-06-19T00:00:00Z") 
  }

const storyCardDetails2: StoryCardDetails = { 
    personID: "2", 
    eventID: "g",
    username: "umamageswari", 
    groupName: "Gym ofc 🏋️", 
    taskName: "little rhea kid gym day", 
    mytask: true, 
    backlog: false, 
    dueDay: new Date("2025-06-17T00:00:00Z") 
  }

  const storyCardDetails3: StoryCardDetails = { 
    personID: "2", 
    taskID: "g",
    username: "umamageswari", 
    groupName: "Gym ofc 🏋️", 
    taskName: "little rhea kid gym day", 
    mytask: false, 
    backlog: true
  }