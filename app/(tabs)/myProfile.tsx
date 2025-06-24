import ProfileHeader from '@/components/ProfileHeader';
import { SB_STORAGE_CONFIG } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
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
  firstName: string;
  lastName: string;
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
  <View className="flex-row justify-around border-t border-gray-300 bg-white">
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
  const isFocused = useIsFocused();

  useEffect(() => {
    setUser({
      username: 'muktha001',
      firstName: 'Muktha',
      lastName: 'Patel',
      bio: 'Building cool stuff. MIT ’28.',
      personID: 'uuid-of-user',
    });

    // Simulate grouped posts into rows of 5
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
  }, []);

  if (!user) return <Text>Loading...</Text>;

  const profilePic = `${SB_STORAGE_CONFIG.BASE_URL}${user.personID}.jpg`;

  const renderRow = ({ item: row }: { item: PostPreview[] }) => (
    <View>

      {/**Header name lets gooo */}
       <View className="flex-row justify justify-between px-3 py-2 border-t border-gray-300 bg-white">
          <Text> Header name </Text>
          <Text> See more </Text>
        </View>
    
    {/** the actual posts woahhh */}
    <FlatList
      horizontal
      data={row}
      keyExtractor={(item) => item.postId}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 8 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          className="border border-white mr-2"
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
        renderItem={({item, index}) => index ? renderRow({item}) : <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />}
        stickyHeaderIndices={[1]} // Tabs are the second child of ListHeaderComponent
        ListHeaderComponent={
          <>
            {/* Profile Section */}
            <View className="bg-white pb-4">
              {/* Profile Info */}
              <View className="flex-row px-4 items-center pt-4">
                <Image
                  source={{ uri: profilePic }}
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
                <Text className="font-semibold text-sm">
                  {user.firstName} {user.lastName}
                </Text>
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
