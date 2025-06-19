import SimpleHeader from "@/components/CustomHeader";
import FollowingOrGlobal from "@/components/FollowingOrGlobal";
import PostCard, { postDetails } from "@/components/Post";
import { StoryCardDetails } from "@/components/StoryCard";
import StoryCarosel from "@/components/StoryCarosel";
import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const dummyPost: postDetails = {postId: "dummy", taskOrEventName: "Dummy Post", personID: "0", myPost: true, username:'dummyUser', thoughts: "This is a dummy post for testing purposes.", hashtags: ['test', 'dummy'], timeCreated: new Date("2023-10-01T12:00:00Z"), likes: 0, comments: 0, alreadyLiked: false, alreadySaved: false};

  const postData: postDetails[] = [
    {postId: "1", taskOrEventName: "Post 1", personID: "1", myPost: true, username:'umamageswari', thoughts: "This is a dummy post for testing purposes.", hashtags: ['test', 'dummy'], timeCreated: new Date(Date.now()), likes: 10, comments: 5, alreadyLiked: true, alreadySaved: false},
    {postId: "2", taskOrEventName: "Post 2", personID: "2", myPost: false, username:'little kiddo', thoughts: "more thoughtsssss and thoughts and testing how many lines we should add and more and more and more and more and more and more and more and more and more and more and more and more and more and more and moremore thoughtsssss and thoughts and testing how many lines we should add and more and more and more and more and more and more and more and more and more and more and more and more and more and more and more", hashtags: ['example', 'dummy'], timeCreated: new Date("2025-06-18T6:00:00Z"), likes: 20, comments: 10, alreadyLiked: false, alreadySaved: true},
    {postId: "3", taskOrEventName: "Post 3", personID: "3", myPost: true, username:'rhea', thoughts: "This is a sample post to demonstrate the functionality.", hashtags: [], timeCreated: new Date("2013-10-03T12:00:00Z"), likes: 15, comments: 8, alreadyLiked: true, alreadySaved: false},
    {postId: "4", taskOrEventName: "Post 4", personID: "4", myPost: false, username:'rhea', thoughts: "This is a sample post to demonstrate the functionality.", hashtags: [], timeCreated: new Date("2023-10-04T12:00:00Z"), likes: 5, comments: 2, alreadyLiked: false, alreadySaved: false},
    {postId: "5", taskOrEventName: "Post 5", personID: "5", myPost: true, username:'umamageswari', thoughts: '', timeCreated: new Date("2023-10-05T12:00:00Z"), likes: 8, comments: 3, alreadyLiked: false, alreadySaved: false},
    {postId: "6", taskOrEventName: "Post 6", personID: "6", myPost: false, username:'little kiddo', thoughts: '', timeCreated: new Date("2023-10-06T12:00:00Z"), likes: 12, comments: 6, alreadyLiked: false, alreadySaved: false},
    {postId: "7", taskOrEventName: "Post 7", personID: "7", myPost: true, username:'rhea', thoughts: '', timeCreated: new Date("2023-10-07T12:00:00Z"), likes: 18, comments: 9, alreadyLiked: false, alreadySaved: false},
    {postId: "8", taskOrEventName: "Post 8", personID: "8", myPost: false, username:'rhea', thoughts: '', timeCreated: new Date("2023-10-08T12:00:00Z"), likes: 25, comments: 12, alreadyLiked: false, alreadySaved: false},
    {postId: "9", taskOrEventName: "Post 9", personID: "9", myPost: true, username:'umamageswari', thoughts: '', timeCreated: new Date("2023-10-09T12:00:00Z"), likes: 30, comments: 15, alreadyLiked: false, alreadySaved: false},
    {postId: "10", taskOrEventName: "Post 10", personID: "10", myPost: false, username:'little kiddo', thoughts: 'more thoughts',timeCreated: new Date("2023-10-10T12:00:00Z"), likes: 40, comments: 20, alreadyLiked: false, alreadySaved: false},
    {postId: "11", taskOrEventName: "Post 11", personID: "11", myPost: true, username:'rhea', thoughts: 'more thoughts', timeCreated: new Date("2023-10-11T12:00:00Z"), likes: 50, comments: 25, alreadyLiked: false, alreadySaved: false},
    {postId: "12", taskOrEventName: "Post 12", personID: "12", myPost: false, username:'rhea', thoughts: 'more thoughtsssss and thoughts and testing how many lines we should add and more and more and more and more and more and more and more and more and more and more and more and more and more and more and more', timeCreated: new Date("2023-10-12T12:00:00Z"), likes: 60, comments: 30, alreadyLiked: false, alreadySaved: false},
    {postId: "13", taskOrEventName: "Post 13", personID: "13", myPost: true, username:'umamageswari', thoughts: 'more thoughts', timeCreated: new Date("2023-10-13T12:00:00Z"), likes: 70, comments: 35, alreadyLiked: false, alreadySaved: false},
    {postId: "14", taskOrEventName: "Post 14", personID: "14", myPost: false, username:'little kiddo', thoughts: '', timeCreated: new Date("2023-10-14T12:00:00Z"), likes: 80, comments: 40, alreadyLiked: false, alreadySaved: false},
    {postId: "15", taskOrEventName: "Post 15", personID: "15", myPost: true, username:'rhea', thoughts: '', timeCreated: new Date("2023-10-15T12:00:00Z"), likes: 90, comments: 45, alreadyLiked: false, alreadySaved: false},
    {postId: "16", taskOrEventName: "Post 16", personID: "16", myPost: false, username:'rhea', thoughts: '', timeCreated: new Date("2023-10-16T12:00:00Z"), likes: 100, comments: 50, alreadyLiked: false, alreadySaved: false},
    {postId: "17", taskOrEventName: "Post 17", personID: "17", myPost: true, username:'umamageswari', thoughts: '', timeCreated : new Date("2023-10-17T12:00:00Z"), likes: 110, comments: 55, alreadyLiked: false, alreadySaved: false},
  ];

  return (

      <View className="flex flex-col flex-1 gap-0 bg-primary h-full w-full">
        <SimpleHeader />
        {isFocused && <StatusBar style="dark" />}
        <FlatList
        className="flex-1"
          data={[dummyPost, ...postData]} // Example data array
          keyExtractor={(item) => item.postId} // Use the keyExtractor to set the key
          renderItem={({ item, index }) => index ? <PostCard {...item} /> : <FollowingOrGlobal />}
          ListHeaderComponent={
            <View className="h-[190px]">
              <StoryCarosel storyCards={[storyCardDetails1, storyCardDetails2, storyCardDetails3]} />
            </View>
          }
          stickyHeaderIndices={[1]} // Make the header sticky
          showsVerticalScrollIndicator={false}
          scrollToOverflowEnabled={false}
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
    dueDay: new Date("2025-06-19T00:00:00Z"),
    accomplished: false,
  }

const storyCardDetails2: StoryCardDetails = { 
    personID: "2", 
    eventID: "g",
    username: "umamageswari", 
    groupName: "Gym ofc 🏋️", 
    taskName: "little rhea kid gym day", 
    mytask: true, 
    backlog: false, 
    dueDay: new Date("2025-06-17T00:00:00Z"), 
    accomplished: true,
  }

  const storyCardDetails3: StoryCardDetails = { 
    personID: "2", 
    taskID: "g",
    username: "umamageswari", 
    groupName: "Gym ofc 🏋️", 
    taskName: "little rhea kid gym day", 
    mytask: false, 
    backlog: true,
    accomplished: false,
  }