import CommentsModal from "@/components/CommentsModal";
import SimpleHeader from "@/components/CustomHeader";
import FollowingOrGlobal from "@/components/FollowingOrGlobal";
import LikesModal from "@/components/LikesModal";
import PostCard, { postDetails } from "@/components/Post";
import { StoryCardDetails } from "@/components/StoryCard";
import StoryCarosel from "@/components/StoryCarosel";
import { supabase } from "@/constants/supabaseClient";
import { getUserId } from "@/services/api";
import { addCommentToPost, getAllComments, getAllLikes, getFeedNew } from "@/services/posts";
import useFetch from "@/services/useFetch";
import { Comment, generateUUID } from "@/services/utils";
import { useIsFocused } from "@react-navigation/native";
import { Filter } from 'bad-words';
import { addDays } from "date-fns";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function Home() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const userId = getUserId().then((value) => value[0]);
  const username = getUserId().then((value) => value[1]);
  const filter = new Filter();

  //modal stuff
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPostId, setModalPostId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'likes' | 'comments'>('likes');
  const [commentData, setCommentData] = useState<Comment[]>([]);
  const [likesData, setLikeData] = useState<Like[]>([])

  const openModal = (postId: string, type: 'likes' | 'comments') => {
    setModalPostId(postId);
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const dealWithSentComment = async (text: string, parentId: Comment | undefined) => {
      if(filter.isProfane(text)){
        Alert.alert("This message may violate community guidelines.")
      } else {
      const newComment = {
        id: generateUUID(),
        author: await username,
        authorId: await userId,
        content: text,
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        parentId: parentId?.id,
        timeCreated: new Date(Date.now())}
        
        console.log(newComment)
        if(modalPostId){
          addCommentToPost(modalPostId, newComment, supabase);
        }
        setCommentData([...commentData, newComment])
      }
  }

  const updateLikesCommentsData = async () => {
    if (modalPostId) {
      console.log("modalPostId was not null")
      const [newLikeData, newCommentData] = [await getAllLikes(modalPostId, supabase), await getAllComments(modalPostId, supabase)];
      console.log(newLikeData, newCommentData)
      setLikeData(newLikeData);
      setCommentData(newCommentData);
    } else {
      console.log("modalPostId was null")
    }
  }
  useEffect(() => {
    console.log("updating data")
    updateLikesCommentsData();
  }, [modalPostId])

  const dummyPost: postDetails = {postId: "dummy", taskOrEventName: "Dummy Post", personID: "0", myPost: true, username:'dummyUser', thoughts: "This is a dummy post for testing purposes.", hashtags: ['test', 'dummy'], timeCreated: new Date("2023-10-01T12:00:00Z"), likes: 0, comments: 0, alreadyLiked: false, alreadySaved: false};

  const postData2: postDetails[] = [
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

  const {
    data: postData,
    loading, 
    error,
    refetch,
    reset
  } = useFetch(() => getFeedNew(supabase))

  let posts = postData?.posts ?? [];

  useEffect(()=> {
    if (postData?.posts) {
      posts = postData.posts
    }
    console.log(posts)
  }, [loading])

  //change where the posts are coming from
  const [globalToggle, setGlobalToggle] = useState(false);

  return (

      <View className="flex flex-col flex-1 gap-0 bg-primary h-full w-full">
        <SimpleHeader />
        {isFocused && <StatusBar style="dark" />}
        <FlatList
        className="flex-1"
          data={[dummyPost, ...posts]} 
          keyExtractor={(item) => item.postId} 
          renderItem={({ item, index }) => index ? <PostCard post={item} onOpenModal={openModal} /> : <FollowingOrGlobal />}
          ListHeaderComponent={
            <View className="h-[190px]">
              <StoryCarosel storyCards={[storyCardDetails1, storyCardDetails2, storyCardDetails3]} />
            </View>
          }
          stickyHeaderIndices={[1]} // Make the "following/global" sticky
          showsVerticalScrollIndicator={false}
          scrollToOverflowEnabled={false}
        />
        {modalVisible && modalType == "comments" &&

        <CommentsModal
        visible={modalVisible}
        comments={commentData}
        onClose={closeModal}
        onPostComment={dealWithSentComment}
      />
      }

      {modalVisible && modalType == "likes" &&
        

        <LikesModal visible={modalVisible} likes={likesData} onClose={closeModal}/>
      }
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


  const exampleCommentData: Comment[] = [
    {
      id: "1",
      author: "Alice Johnson",
      authorId: '1',
      content: "This is such a cool feature! This is such a cool feature! This is such a cool feature! This is such a cool feature! This is such a cool feature! This is such a cool feature! This is such a cool feature! This is such a cool feature! This is such a cool feature!",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      timeCreated: new Date(Date.now())
    },
    {
      id: "2",
      authorId: '1',
      author: "Bob Smith",
      content: "I agree with Alice. Super smooth UI.",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      timeCreated: addDays(Date.now(),-2)
    },
    {
      id: "3",
      authorId: '1',
      author: "Charlie Tran",
      content: "How do I enable this on my profile?",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      timeCreated: addDays(Date.now(),-3)
    },
    {
      id: "4",
      authorId: '1',
      author: "Diana Lee",
      content: "Just go to settings > features and toggle it on.",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      parentId: "3", // reply to Charlie
      timeCreated: addDays(Date.now(),-5)
    },
    {
      id: "5",
      authorId: '1',
      author: "Emily Chen",
      content: "This comment thread is great!",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      timeCreated: addDays(Date.now(),-4)
    },
    {
      id: "6",
      authorId: '1',
      author: "Bob Smith",
      content: "Thanks Diana! That worked perfectly.",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      parentId: "3", // not allowed as reply to a reply, so ignore this one
      timeCreated: addDays(Date.now(),-2)
    },
  ];


  interface Like {
    id: string;
    username: string;
    avatar: string;
  }



export const exampleLikes: Like[] = [
  {
    id: '1',
    username: 'alice_wonder',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '2',
    username: 'bob_the_builder',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '3',
    username: 'charlie.day',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: '4',
    username: 'diana.prince',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  {
    id: '5',
    username: 'eve_techie',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
  },
  {
    id: '6',
    username: 'franklin99',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
  },
  {
    id: '7',
    username: 'grace_notes',
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
  },
  {
    id: '8',
    username: 'hank_the_tank',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
  },
  {
    id: '9',
    username: 'ivy_gardens',
    avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
  },
  {
    id: '10',
    username: 'johnny_code',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
  },
  {
    id: '153',
    username: 'eve_techie',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
  },
  {
    id: '163',
    username: 'franklin99',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
  },
  {
    id: '173',
    username: 'grace_notes',
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
  },
  {
    id: '183',
    username: 'hank_the_tank',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
  },
  {
    id: '193',
    username: 'ivy_gardens',
    avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
  },
  {
    id: '110',
    username: 'johnny_code',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
  },
  {
    id: '15',
    username: 'eve_techie',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
  },
  {
    id: '16',
    username: 'franklin99',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
  },
  {
    id: '17',
    username: 'grace_notes',
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
  },
  {
    id: '18',
    username: 'hank_the_tank',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
  },
  {
    id: '19',
    username: 'ivy_gardens',
    avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
  },
  {
    id: '1110',
    username: 'johnny_code',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
  },
];
