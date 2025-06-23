import { icons } from '@/constants/icons';
import { supabase } from '@/constants/supabaseClient';
import { SB_STORAGE_CONFIG } from '@/services/api';
import { likePost, savePost, unlikePost, unSavePost } from '@/services/posts';
import { Ionicons } from '@expo/vector-icons'; // Import icons from Expo Vector Icons
import { formatDistanceToNow } from 'date-fns';
import { default as React, useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export interface postDetails {
    postId: string;
    personID: string;
    username: string;
    thoughts: string;
    taskOrEventName: string;
    myPost: boolean;
    taskID?: string;
    eventID?: string;
    hashtags?: string[];
    timeCreated: Date;
    likes: number; // New prop for likes
    comments: number; // New prop for comments
    alreadyLiked: boolean;
    alreadySaved: boolean;
    
}

export interface postCardProps {
    post: postDetails;
    onOpenModal: (postId: string, type: 'likes' | 'comments')=>void;
}

const PostCard = ({post, onOpenModal}: postCardProps ) => {
    const [imageUrl, setImageUrl] = useState('');
    const [showFullText, setShowFullText] = useState(true); // State to toggle full text
    const [isTextTruncated, setIsTextTruncated] = useState(false); // State to check if text is truncated
    const [isLiked, setIsLiked] = useState(post.alreadyLiked); // State for the heart icon
    const [isSaved, setIsSaved] = useState(post.alreadySaved); // State for the bookmark icon
    const [likeCount, setLikeCount] = useState(post.likes); // State for the number of likes

    useEffect(() => {
      const profilePicUrl = `${SB_STORAGE_CONFIG.BASE_URL}${post.personID}.jpg`;
      const defaultPicUrl = `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg`;
  
      // Check if the profile picture exists
      Image.prefetch(profilePicUrl)
        .then(() => setImageUrl(profilePicUrl)) // If it exists, use it
        .catch(() => setImageUrl(defaultPicUrl)); // Otherwise, use the default
    }, [post.personID]);

    // Function to format the timeCreated
    const getRelativeTime = (date: Date) => {
        const now = new Date();
    
        // If the post was created this week, show the day of the week (e.g., "Thursday")
        // if (isThisWeek(date)) {
        //   return format(date, 'EEEE'); // Returns the day of the week (e.g., "Thursday")
        // }
    
        // Otherwise, show a relative time (e.g., "1 year ago", "10 hours ago")
        return formatDistanceToNow(date, { addSuffix: true });
    };

    const handleLikePress = () => {
        if (isLiked) {
          setLikeCount(likeCount - 1); // Decrease like count if unliked
          unlikePost(post.postId, supabase);
        } else {
          setLikeCount(likeCount + 1); // Increase like count if liked
          likePost(post.postId, supabase);
        }
        setIsLiked(!isLiked); // Toggle like state
    };

    const handleSavedPress = () => {
        if(isSaved){
            unSavePost(post.postId, supabase)
        } else {
            savePost(post.postId, supabase)
        }
        setIsSaved(!isSaved); // Toggle save state
    }

    return (
    <View className = "flex flex-col gap-0">
        {/* Post Card Header */}
        <View className='flex flex-row h-[60px] justify-between items-center pl-[12px] pr-4 w-full bg-primary'>
            <View className='flex flex-row gap-2 items-center'>
                <Image source={{ uri: imageUrl }} className='w-[45px] h-[45px] border rounded-full justify-center' 
                        resizeMode='cover' />

                <View className='flex flex-col justify-center mb-[2px] ml-[1px]'>
                    <Text className='text-lg font-semibold text-black'>{post.taskOrEventName}</Text>
                    <Text className='text-sm text-secondary mt-[-3px]'>{post.username}</Text>
                </View>
            </View>

            {post.myPost &&
                <Image source = {icons.threeDots} className='w-[24px] h-[24px] self-center'/>
            }

            {!post.myPost &&
                <Text className = "p-1 border border-black rounded-md text-lg mr-[-4]">Inspired By</Text>
            }
        </View>

        {/* Post Card Content */}
        <View className="bg-black w-[100%] aspect-3/4"></View>

        {/* Interactions (likes, comments, saved) */}
        <View className="bg-primary flex flex-col">
            <View className="flex flex-row justify-between items-center px-4 py-2">
                {/* Left Section: Like and Comment Icons */}
                <View className="flex flex-row items-center gap-4">
                    {/* Heart Icon for Likes */}
                    {/* <TouchableOpacity onPress={handleLikePress}>
                        <View className="flex flex-row items-center gap-1">
                            <Ionicons
                                name={isLiked ? 'heart' : 'heart-outline'} // Toggle between filled and outline
                                size={25}
                                color={isLiked ? 'red' : 'gray'} // Change color when liked
                            />
                            <Text className="text-sm text-secondary">{likeCount}</Text>
                        </View>
                    </TouchableOpacity> */}

                    <TouchableOpacity onPress={handleLikePress}>
                    <View className="flex flex-row items-center gap-1">
                        <Ionicons
                        name={isLiked ? 'heart' : 'heart-outline'}
                        size={25}
                        color={isLiked ? 'red' : 'gray'}
                        />
                        <TouchableOpacity onPress={() => onOpenModal?.(post.postId, 'likes')}>
                        <Text className="text-sm text-secondary">{likeCount}</Text>
                        </TouchableOpacity>
                    </View>
                    </TouchableOpacity>

                    {/* Comment Icon for Comments */}
                    {/* <View className="flex flex-row items-center gap-1">
                        <Ionicons name="chatbubble-outline" size={25} color="gray" />
                        <Text className="text-sm text-secondary">{comments}</Text>
                    </View> */}
                    <TouchableOpacity onPress={() => onOpenModal?.(post.postId, 'comments')}>
                    <View className="flex flex-row items-center gap-1">
                    
                        <Ionicons name="chatbubble-outline" size={25} color="gray" />
                        
                            <Text className="text-sm text-secondary">{post.comments}</Text>
                       
                    </View>
                    </TouchableOpacity>
                </View>

                {/* Right Section: Saved Icon */}
                <TouchableOpacity onPress={handleSavedPress}>
                    <Ionicons
                        name={isSaved ? 'bookmark' : 'bookmark-outline'} // Toggle between filled and outline
                        size={25}
                        color={isSaved ? 'blue' : 'gray'} // Change color when saved
                    />
                </TouchableOpacity>
            </View>

            {/* Post Content */}
            {post.thoughts && post.thoughts.trim().length > 0 && (
            <View className="flex flex-row items-start justify-start gap-2 px-4">
                <Text
                    className="font-regular flex-1 text-sm"
                    numberOfLines={showFullText ? undefined : 3} // Limit to 3 lines unless expanded
                    onTextLayout={(e) => {
                        const { lines } = e.nativeEvent;
                        if (!isTextTruncated && lines.length > 3) {
                            //console.log({post.postId})
                            setIsTextTruncated(true); // Set truncated state if more than 3 lines
                            setShowFullText(false); // Initially show only 3 lines
                        }
                    }}>
                    <Text className="font-bold text-secondary">{post.username} </Text>
                    {post.thoughts}
                </Text>
            </View>)}

            {/* "More" Button */}
            
            {post.thoughts.length > 0 && isTextTruncated && (
                <TouchableOpacity onPress={() => setShowFullText(!showFullText)}>
                    <Text className="flex flex-row justify-end text-xs text-blue-700 px-4">
                        {showFullText ? "Show less" : "More"}
                    </Text>
                </TouchableOpacity>
            )}

            {post.hashtags && post.hashtags.length > 0 && (
                <View className="flex flex-row gap-2 px-4">
                    {post.hashtags.map((hashtag, index) => (
                        <Text key={index} className="text-xs text-blue-700">#{hashtag}</Text>
                    ))}
                </View>
            )}

            <Text className='text-sm text-secondary mt-[-3px] capitalize px-4 pt-1'>{getRelativeTime(post.timeCreated)}</Text>

            <Text className="text-xs text-secondary px-4 pb-2">View all comments</Text>
        </View>

    </View>

  )
}

export default PostCard