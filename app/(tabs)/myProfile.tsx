import ProfileHeader from '@/components/ProfileHeader';
import { getUserId, SB_STORAGE_CONFIG } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

interface PostPreview {
  postId: string;
  imageUrl: string;
  likes: number;
  comments: number;
}

interface UserProfile {
  username: string;
  bio: string;
  personID: string;
}

const screenWidth = Dimensions.get('window').width;
const imageSize = screenWidth / 3;

interface TabsProps {
  activeTab: 'posts' | 'saved';
  setActiveTab: (tab: 'posts' | 'saved') => void;
}

const Tabs = ({ activeTab, setActiveTab }: TabsProps) => (
  <View className="flex-row justify-around border-t border-gray-300 bg-primary">
    <TouchableOpacity
      className={`flex-1 py-2 items-center ${activeTab === 'posts' ? 'border-b-2 border-black' : ''}`}
      onPress={() => setActiveTab('posts')}
    >
      <Ionicons name="grid-outline" size={20} />
    </TouchableOpacity>
    <TouchableOpacity
      className={`flex-1 py-2 items-center ${activeTab === 'saved' ? 'border-b-2 border-black' : ''}`}
      onPress={() => setActiveTab('saved')}
    >
      <Ionicons name="bookmark-outline" size={20} />
    </TouchableOpacity>
  </View>
);

export default function MyProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [postRows, setPostRows] = useState<PostPreview[][]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [profilePicture, setImageUrl] = useState<string | null>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const userDetails = await getUserId();
        const newUser: UserProfile = {
          username: userDetails[1],
          bio: 'Building cool stuff. MIT ’28.',
          personID: userDetails[0],
        };
        setUser(newUser);

        const dummyPosts = Array.from({ length: 30 }, (_, i) => ({
          postId: `${i + 1}`,
          imageUrl: `${SB_STORAGE_CONFIG.BASE_URL}post${(i % 3) + 1}.jpg`,
          likes: 100 + i,
          comments: 10 + i,
        }));

        const grouped = [];
        for (let i = 0; i < dummyPosts.length; i += 5) {
          grouped.push(dummyPosts.slice(i, i + 5));
        }

        setPostRows(grouped);
      } catch (error) {
        console.error('Error fetching user or posts:', error);
      }
    };

    if (isFocused) {
      fetchUserAndPosts();
    }
  }, [isFocused]);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!user) return;

      const cacheKey = `profilePicture:${user.personID}`;
      const defaultPicUrl = `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg`;
      const profilePicUrl = `${SB_STORAGE_CONFIG.BASE_URL}${user.personID}.jpg`;

      try {
        // Check cache
        const cachedUrl = await AsyncStorage.getItem(cacheKey);
        if (cachedUrl) {
          setImageUrl(cachedUrl);
          return;
        }

        // Prefetch and store in cache
        await Image.prefetch(profilePicUrl);
        setImageUrl(profilePicUrl);
        await AsyncStorage.setItem(cacheKey, profilePicUrl);
      } catch {
        setImageUrl(defaultPicUrl);
      }
    };

    fetchProfilePicture();
  }, [user]);

  if (!user) return <Text className="text-center mt-10">Loading...</Text>;

  const renderRow = ({ item: row }: { item: PostPreview[] }) => (
    <View>
      {/* Row Header */}
      <View className="flex-row justify-between px-3 py-2 border-t border-gray-300 bg-primary">
        <Text className="font-semibold text-sm">Header name</Text>
        <Text className="text-blue-600 text-sm">See more</Text>
      </View>

      {/* Horizontal Posts */}
      <FlatList
        horizontal
        data={row}
        keyExtractor={(item) => item.postId}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 0 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="border border-white mr-[1 bg-black"
            onPress={() => console.log('Open post', item.postId)}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: imageSize, height: imageSize }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-primary">
      <ProfileHeader />
      {isFocused && <StatusBar style="dark" />}

      <FlatList
        data={postRows}
        keyExtractor={(_, index) => `row-${index}`}
        renderItem={({ item, index }) =>
          index === 0 ? (
            <>
              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </>
          ) : (
            renderRow({ item })
          )
        }
        stickyHeaderIndices={[1]}
        ListHeaderComponent={
          <>
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
                    <Text className="text-lg font-semibold">{postRows.flat().length}</Text>
                    <Text className="text-sm text-secondary">Posts</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-lg font-semibold">245</Text>
                    <Text className="text-sm text-secondary">Followers</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-lg font-semibold">180</Text>
                    <Text className="text-sm text-secondary">Following</Text>
                  </View>
                </View>
              </View>

              {/* Name + Bio */}
              <View className="px-4 pt-2">
                <Text className="font-semibold text-sm">{user.username}</Text>
                <Text className="text-sm text-black">{user.bio}</Text>
              </View>

              {/* Edit Profile */}
              <View className="flex-row px-4 mt-3">
                <TouchableOpacity className="flex-1 border rounded-lg py-1 items-center">
                  <Text className="text-sm font-medium">Edit Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
        ListHeaderComponentStyle={{ zIndex: 1 }}
        ListFooterComponent={<View className="h-12" />}
      />
    </View>
  );
}
