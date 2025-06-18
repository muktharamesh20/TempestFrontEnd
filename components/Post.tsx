import { icons } from '@/constants/icons';
import { SB_STORAGE_CONFIG } from '@/services/api';
import { default as React, useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';

export interface postDetails {
    postId: string;
    personID: string;
    postName: string;
    myPost: boolean;
}

const PostCard = ({personID, postId, postName, myPost}: postDetails) => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
      const profilePicUrl = `${SB_STORAGE_CONFIG.BASE_URL}${personID}.jpg`;
      const defaultPicUrl = `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg`;
  
      // Check if the profile picture exists
      Image.prefetch(profilePicUrl)
        .then(() => setImageUrl(profilePicUrl)) // If it exists, use it
        .catch(() => setImageUrl(defaultPicUrl)); // Otherwise, use the default
    }, [personID]);

    return (
    <View className = "flex flex-col gap-0">
        {/* Post Card Header */}
        <View className='flex flex-row h-[51px] justify-between items-center pl-[12px] pr-4 w-full bg-primary'>
            <View className='flex flex-row gap-2 items-center'>
                <Image source={{ uri: imageUrl }} className='w-[45px] h-[45px] border rounded-full' 
                        resizeMode='cover' />

                <View className='flex flex-col'>
                    <Text className='text-lg font-semibold text-black'>{postName}</Text>
                    <Text className='text-sm text-secondary'>Post ID: {postId}</Text>
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


        {/* Interactions (likes, comments, etc.) */}

    </View>

  )
}

export default PostCard