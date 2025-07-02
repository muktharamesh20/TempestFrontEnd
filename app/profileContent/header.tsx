import { supabase } from '@/constants/supabaseClient';
import { SB_STORAGE_CONFIG } from '@/services/api';
import { createFollowerRequest, rejectOrRevokeFollowerRequest, toggleCloseFrined } from '@/services/users';
import { ProfileSummary } from '@/services/utils';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface headerProps {
  profilePicture: string | null;
  user: ProfileSummary;
  setUser: React.Dispatch<React.SetStateAction<ProfileSummary | null>>;
  id: string;
  myId: string;
}

const ProfileContentHeader = ({ profilePicture, user, setUser, id, myId }: headerProps) => {

  return (
    <View>
      {/* Profile Section */}
      <View className="bg-primary pb-4">
        {/* Profile Info */}
        <View className="flex-row px-4 items-center pt-4">
          <Image
            source={{
              uri: profilePicture ?? `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg`,
            }}
            className="w-[80px] h-[80px] rounded-full border"
            resizeMode="cover"
          />
          <View className="flex-1 flex-row justify-around">
            <View className="items-center">
              <Text className="text-lg font-semibold">{user.numposts}</Text>
              <Text className="text-sm text-secondary">Posts</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-semibold">{user.numfollowers}</Text>
              <Text className="text-sm text-secondary">Followers</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-semibold">{user.numfollowing}</Text>
              <Text className="text-sm text-secondary">Following</Text>
            </View>
          </View>
        </View>

        {/* Name + Bio */}
        <View className="px-4 pt-2">
          <Text className="font-semibold text-sm">{user.username}</Text>
          {user.bio &&
            <Text className="text-sm text-black">{user.bio}</Text>}
        </View>

        {/* Edit Profile */}


        <View className="flex-row px-5 mt-3 gap-2 flex-1">
          {user.isownprofile ? (
            <TouchableOpacity className="flex-1 border rounded-lg py-1 items-center">
              <Text className="text-sm font-medium">Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <>
              {!user.youfollowing && !user.yourequestedfollow && (
                <TouchableOpacity className="flex-1 border rounded-lg py-1 items-center" onPress={() => {
                  createFollowerRequest(id as string, supabase);
                  if (user.isprivate) {
                    setUser({ ...user, yourequestedfollow: true });
                  } else {
                    setUser({ ...user, youfollowing: true, numfollowers: user.numfollowers + 1 });
                  }
                }}>
                  <Text className="text-sm font-medium">Follow</Text>
                </TouchableOpacity>
              )}
              {!user.youfollowing && user.yourequestedfollow && (
                <TouchableOpacity className="flex-[2] border rounded-lg py-1 items-center" onPress={() => {
                  rejectOrRevokeFollowerRequest(myId || '', id as string, supabase);
                  setUser({ ...user, yourequestedfollow: false });
                }}>
                  <Text className="text-sm font-medium">Requested to follow</Text>
                </TouchableOpacity>
              )}
              {!user.theyclosefriend && user.theyfollowing && (
                <TouchableOpacity className="flex-1 border rounded-lg py-1 items-center" onPress={() => {
                  if (myId) {
                    toggleCloseFrined(myId, id as string, true, supabase)
                    setUser({ ...user, theyclosefriend: true });
                  }
                }}>
                  <Text className="text-sm font-medium">Add Close Friend</Text>
                </TouchableOpacity>
              )}
              {user.youclosefriend && (
                <TouchableOpacity className="flex-1 border rounded-lg py-1 items-center">
                  <Text className="text-sm font-medium">View Calendar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity className="flex-1 border rounded-lg py-1 items-center">
                <Text className="text-sm font-medium">Message</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

      </View>

    </View>
  )
}

export default ProfileContentHeader