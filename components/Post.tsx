import { icons } from '@/constants/icons';
import { SB_STORAGE_CONFIG } from '@/services/api';
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
}

const PostCard = ({username, personID, postId, taskOrEventName: postName, myPost, thoughts, hashtags, timeCreated}: postDetails) => {
    const [imageUrl, setImageUrl] = useState('');
    const [showFullText, setShowFullText] = useState(true); // State to toggle full text
    const [isTextTruncated, setIsTextTruncated] = useState(false); // State to check if text is truncated

    useEffect(() => {
      const profilePicUrl = `${SB_STORAGE_CONFIG.BASE_URL}${personID}.jpg`;
      const defaultPicUrl = `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg`;
  
      // Check if the profile picture exists
      Image.prefetch(profilePicUrl)
        .then(() => setImageUrl(profilePicUrl)) // If it exists, use it
        .catch(() => setImageUrl(defaultPicUrl)); // Otherwise, use the default
    }, [personID]);

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

    return (
    <View className = "flex flex-col gap-0">
        {/* Post Card Header */}
        <View className='flex flex-row h-[60px] justify-between items-center pl-[12px] pr-4 w-full bg-primary'>
            <View className='flex flex-row gap-2 items-center'>
                <Image source={{ uri: imageUrl }} className='w-[45px] h-[45px] border rounded-full justify-center' 
                        resizeMode='cover' />

                <View className='flex flex-col justify-center mb-[2px] ml-[1px]'>
                    <Text className='text-lg font-semibold text-black'>{postName}</Text>
                    <Text className='text-sm text-secondary mt-[-3px]'>{username}</Text>
                </View>
            </View>

            {myPost &&
                <Image source = {icons.threeDots} className='w-[24px] h-[24px] self-center'/>
            }

            {!myPost &&
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
                    <View className="flex flex-row items-center gap-1">
                        <Ionicons name="heart-outline" size={25} color="gray" />
                        <Text className="text-sm text-secondary">0</Text>
                    </View>

                    {/* Comment Icon for Comments */}
                    <View className="flex flex-row items-center gap-1">
                        <Ionicons name="chatbubble-outline" size={25} color="gray" />
                        <Text className="text-sm text-secondary">0</Text>
                    </View>
                </View>

                {/* Right Section: Saved Icon */}
                <View>
                    <Ionicons name="bookmark-outline" size={25} color="gray" />
                </View>
            </View>

            {/* Post Content */}
            {thoughts && thoughts.trim().length > 0 && (
            <View className="flex flex-row items-start justify-start gap-2 px-4">
                <Text
                    className="font-regular flex-1"
                    numberOfLines={showFullText ? undefined : 3} // Limit to 3 lines unless expanded
                    onTextLayout={(e) => {
                        const { lines } = e.nativeEvent;
                        if (!isTextTruncated && lines.length > 3) {
                            console.log({postId})
                            setIsTextTruncated(true); // Set truncated state if more than 3 lines
                            setShowFullText(false); // Initially show only 3 lines
                        }
                    }}>
                    <Text className="font-bold text-secondary">{username} </Text>
                    {thoughts}
                </Text>
            </View>)}

            {/* "More" Button */}
            
            {thoughts.length > 0 && isTextTruncated && (
                <TouchableOpacity onPress={() => setShowFullText(!showFullText)}>
                    <Text className="flex flex-row justify-end text-xs text-blue-700 px-4">
                        {showFullText ? "Show less" : "More"}
                    </Text>
                </TouchableOpacity>
            )}

            {hashtags && hashtags.length > 0 && (
                <View className="flex flex-row gap-2 px-4">
                    {hashtags.map((hashtag, index) => (
                        <Text key={index} className="text-xs text-blue-700">#{hashtag}</Text>
                    ))}
                </View>
            )}

            <Text className='text-sm text-secondary mt-[-3px] capitalize px-4 pt-1'>{getRelativeTime(timeCreated)}</Text>

            <Text className="text-xs text-secondary px-4 pb-2">View all comments</Text>
        </View>

    </View>

  )
}

export default PostCard