import CommentsModal from "@/components/CommentsModal";
import SimpleHeader from "@/components/CustomHeader";
import FollowingOrGlobal from "@/components/FollowingOrGlobal";
import LikesModal from "@/components/LikesModal";
import PostCard from "@/components/Post";
import { StoryCardDetails } from "@/components/StoryCard";
import StoryCarosel from "@/components/StoryCarosel";
import { supabase } from "@/constants/supabaseClient";
import { getUserId } from "@/services/api";
import { addCommentToPost, blockPersonFromCommenting, deleteCommentFromPost, getAllComments, getAllLikes, getFeedNew } from "@/services/posts";
import useFetch from "@/services/useFetch";
import { Comment, dummyPost, generateUUID, Like, postDetails } from "@/services/utils";
import { useIsFocused } from "@react-navigation/native";
import { Filter } from 'bad-words';
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";


export default function Home() {
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
    if (filter.isProfane(text)) {
      Alert.alert("This message may violate community guidelines.")
    } else {
      const newComment = {
        id: generateUUID(),
        author: await username,
        authorId: await userId,
        content: text,
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        parentId: parentId?.id,
        timeCreated: new Date(Date.now())
      }

      console.log(newComment)
      if (modalPostId) {
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

  const {
    data: postData,
    loading,
    error,
    refetch,
    reset
  } = useFetch(() => getFeedNew(supabase))

  const [posts, setPosts] = useState<postDetails[]>(postData?.posts ?? []);

  useEffect(() => {
    if (postData?.posts) {
      setPosts([dummyPost, ...postData.posts])
    }
    console.log(posts)
  }, [loading])

  const handleDeletedComment = (comment_id: string) => {
    deleteCommentFromPost(comment_id, supabase);
    setCommentData(commentData.filter(((value) => (value.id !== comment_id))));
  }

  const handleBlockedPerson = (person_id: string) => {
    blockPersonFromCommenting(person_id, supabase);
  }

  return (

    <View className="flex flex-col flex-1 gap-0 bg-primary h-full w-full">
      <SimpleHeader />
      {isFocused && <StatusBar style="dark" />}
      <FlatList
        className="flex-1"
        data={posts}
        keyExtractor={(item) => item.postId}
        renderItem={({ item, index }) => index ? <PostCard post={item} onOpenModal={openModal} deleteFromFeed={() => setPosts(posts.filter((value) => value.postId !== item.postId))} /> : <FollowingOrGlobal />}
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
          postOwnerId={(posts.filter((value) => value.postId === modalPostId))[0]!.personID}
          onDeleteComment={handleDeletedComment}
          onBlockPersonFromCommenting={handleBlockedPerson}
        />
      }

      {modalVisible && modalType == "likes" &&


        <LikesModal visible={modalVisible} likes={likesData} onClose={closeModal} />
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
