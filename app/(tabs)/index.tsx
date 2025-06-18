import SimpleHeader from "@/components/CustomHeader";
import FollowingOrGlobal from "@/components/FollowingOrGlobal";
import PostCard, { postDetails } from "@/components/Post";
import { StoryCardDetails } from "@/components/StoryCard";
import StoryCarosel from "@/components/StoryCarosel";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets();

  const dummyPost: postDetails = {postId: "dummy", postName: "Dummy Post", personID: "0", myPost: true, username:'dummyUser'};

  const postData: postDetails[] = [
    {postId: "1", postName: "Post 1", personID: "1", myPost: true, username:'umamageswari'},
    {postId: "2", postName: "Post 2", personID: "2", myPost: false, username:'little kiddo'},
    {postId: "3", postName: "Post 3", personID: "3", myPost: true, username:'rhea'},
    {postId: "4", postName: "Post 4", personID: "4", myPost: false, username:'rhea'},
    {postId: "5", postName: "Post 5", personID: "5", myPost: true, username:'umamageswari'},
    {postId: "6", postName: "Post 6", personID: "6", myPost: false, username:'little kiddo'},
    {postId: "7", postName: "Post 7", personID: "7", myPost: true, username:'rhea'},
    {postId: "8", postName: "Post 8", personID: "8", myPost: false, username:'rhea'},
    {postId: "9", postName: "Post 9", personID: "9", myPost: true, username:'umamageswari'},
    {postId: "10", postName: "Post 10", personID: "10", myPost: false, username:'little kiddo'},
    {postId: "11", postName: "Post 11", personID: "11", myPost: true, username:'rhea'},
    {postId: "12", postName: "Post 12", personID: "12", myPost: false, username:'rhea'},
    {postId: "13", postName: "Post 13", personID: "13", myPost: true, username:'umamageswari'},
    {postId: "14", postName: "Post 14", personID: "14", myPost: false, username:'little kiddo'},
    {postId: "15", postName: "Post 15", personID: "15", myPost: true, username:'rhea'},
    {postId: "16", postName: "Post 16", personID: "16", myPost: false, username:'rhea'},
    {postId: "17", postName: "Post 17", personID: "17", myPost: true, username:'umamageswari'},
  ];

  return (

      <View className="flex flex-col flex-1 gap-0 bg-primary h-full w-full">
        <SimpleHeader />

        <FlatList
        className="flex-1"
          data={[dummyPost, ...postData]} // Example data array
          keyExtractor={(item) => item.postId} // Use the keyExtractor to set the key
          renderItem={({ item, index }) => index ? <PostCard {...item} /> : <FollowingOrGlobal />}
          ListHeaderComponent={
            <View>
              <StoryCarosel storyCards={[storyCardDetails1, storyCardDetails2, storyCardDetails3]} />
            </View>
          }
          stickyHeaderIndices={[1]} // Make the header sticky
        />
      </View>
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