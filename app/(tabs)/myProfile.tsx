import { PostPreview, RenderRow } from '@/components/profileComponents/renderRow';
import ProfileHeader from '@/components/ProfileHeader';
import EditProfileModal from '@/components/settings/editProfile';
import { supabase } from '@/constants/supabaseClient';
import { getUserId, SB_STORAGE_CONFIG } from '@/services/api';
import { getTaggedPostsFrom, getUserProfileSummary } from '@/services/posts';
import { changeBio, changeUsername, changeVisibleCTs, getAllCategories } from '@/services/usersettings';
import { Category, ProfileSummary } from '@/services/utils';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import ProfileContentHeader from '../profileContent/header';

const screenWidth = Dimensions.get('window').width;
const imageSize = screenWidth / 3;

interface TabsProps {
  activeTab: 'posts' | 'tagged';
  setActiveTab: (tab: 'posts' | 'tagged') => void;
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
      className={`flex-1 py-2 items-center ${activeTab === 'tagged' ? 'border-b-2 border-black' : ''}`}
      onPress={() => setActiveTab('tagged')}
    >
      <Ionicons name="bookmark-outline" size={20} />
    </TouchableOpacity>
  </View>
);

export default function MyProfile() {
  const [user, setUser] = useState<ProfileSummary | null>(null);
  const [postRows, setPostRows] = useState<PostPreview[]>([]);
  const [taggedPosts, setTaggedPosts] = useState<{ id: string, imageLink: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'tagged'>('posts');
  const [profilePicture, setImageUrl] = useState<string | null>(null);
  const isFocused = useIsFocused();
  const [myId, setMyId] = useState<string | null>(null);
  const [openEditProfile, setOpenEditProfile] = useState<boolean>(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [visibleRowCount, setVisibleRowCount] = useState(5);
  const dummyRow: PostPreview = {
    categoryName: 'dummy', posts: Array.from({ length: 2 }, (_, i) => ({
      id: `${i + 1}`,
      imageLink: `${SB_STORAGE_CONFIG.BASE_URL}post${(i % 3) + 1}.jpg`,
    }))
  }
  const dummyTagged = { id: '-1', imageLink: '-1' };

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const myId = await getUserId();
        const userDetails: ProfileSummary = await getUserProfileSummary(myId[0], supabase);
        setUser(userDetails);
        setMyId(myId[0])
        
        const dummyPosts = Array.from({ length: 30 }, (_, i) => ({
          id: `${i + 1}`,
          imageLink: `${SB_STORAGE_CONFIG.BASE_URL}post${(i % 3) + 1}.jpg`,
        }));

        const grouped = [];
        for (let i = 0; i < dummyPosts.length; i += 5) {
          grouped.push({ categoryName: 'Header name', posts: dummyPosts.slice(i, i + 5) });
        }

        setPostRows(grouped);

        setAllCategories(await getAllCategories(myId[0] as string ,supabase));
        console.log("fetched categories",allCategories)
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

      const cacheKey = `profilePicture:${myId}`;
      const defaultPicUrl = `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg`;
      const profilePicUrl = `${SB_STORAGE_CONFIG.BASE_URL}${myId}.jpg`;

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

        const taggedPosts = await getTaggedPostsFrom(myId || '', supabase);
        setTaggedPosts(taggedPosts);
        console.log('tagged posts', taggedPosts)
      } catch {
        setImageUrl(defaultPicUrl);
      }
    };



    fetchProfilePicture();
  }, [user]);

  useEffect(() => {
    const fetchTagged = async () => {
      try {
        if (taggedPosts.length === 0) {
          const newTaggedPosts = await getTaggedPostsFrom(myId || '', supabase);
          setTaggedPosts(newTaggedPosts);
        }
        console.log('tagged posts', taggedPosts)
      } catch {
        console.warn('error updating tagged posts')
      }
    }

    fetchTagged();
  }, [activeTab])

  if (!user) return <Text className="text-center mt-10">Loading...</Text>;

  

const handleShowMoreRows = () => {
  setVisibleRowCount(prev => prev + 5);
};


const handleEndReached = async () => {
  // optional: prevent firing repeatedly
  if (visibleRowCount >= user.categories.length) return;

  setVisibleRowCount(prev => Math.min(prev + 5, user.categories.length));
};



  return (
    <View className="flex-1 bg-primary">
      <ProfileHeader/>
      {isFocused && <StatusBar style="dark" />}

      <EditProfileModal visible={openEditProfile} currentBio={user.bio || ''}  setCurrAvatar={setImageUrl}  currentAvatar={profilePicture} currentUsername={user.username || ''} onClose={() => setOpenEditProfile(false)}  onSave = {async ({username, bio, selectedCategories}) => {await changeBio(bio, myId, supabase); try {await changeVisibleCTs(selectedCategories, myId || '', supabase);} catch {Alert.alert('Error changing Viewership Tags')}; try{await changeUsername(username, myId || '', supabase)} catch{Alert.alert('Username already taken or invalid username')}}} categories={allCategories}  currentId={myId || ''}/>

      {activeTab === 'tagged' ?
        <FlatList
          data={[dummyTagged, [taggedPosts]]}
          keyExtractor={(_, index) => `row-${index}`}
          renderItem={({ item, index }) => {
            if (index === 0) {
              return (
                <>
                  <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                  {/* If there are no actual user posts, show "No posts yet" */}
                  {taggedPosts.length === 0 || (!user.isownprofile && user.isprivate && !user.youfollowing) ? (
                    <Text className="text-center text-gray-500 mt-4">{!user.isownprofile && user.isprivate && !user.youfollowing ? "Account is private" : "No tagged posts yet"}</Text>
                  ) : null}
                </>
              );
            } else if (!user.isownprofile && user.isprivate && !user.youfollowing) {
              return null;
            } else {
              return (
                <FlatList
                  data={taggedPosts}
                  keyExtractor={(item) => item.id}
                  numColumns={3}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="border border-white mr-[1 bg-black"
                      onPress={() => console.log('Open post', item.id)}
                    >
                      <Image
                        source={{ uri: item.imageLink }}
                        style={{ width: imageSize, height: imageSize }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )}
                  scrollEnabled={false}
                  contentContainerStyle={{ alignItems: 'center', paddingBottom: 12 }}
                />
              );
            }
          }}
          stickyHeaderIndices={[1]}
          ListHeaderComponent={
            <View>
              <ProfileContentHeader editProfile={() => {setOpenEditProfile(true); console.log('awww');}} profilePicture={profilePicture} user={user} setUser={setUser} id={myId as string} myId={myId || ''} />
            </View>
          }
          ListHeaderComponentStyle={{ zIndex: 1 }}
          ListFooterComponent={<View className="h-12" />}
        />
        //if not tagged tabƒ
        : <FlatList
        data={[dummyRow, ...user.categories.slice(0, visibleRowCount)]}
          keyExtractor={(_, index) => `row-${index}`}
          renderItem={({ item, index }) => {
            if (index === 0) {
              return (
                <>
                  <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                  {/* If there are no actual user posts, show "No posts yet" */}
                  {user.categories.length === 0 ||
                    user.categories.every(cat => cat.posts.length === 0) ? (
                    <Text className="text-center text-gray-500 mt-4">{!user.isownprofile && user.isprivate && !user.youfollowing ? "Account is private" : "No posts yet"}</Text>
                  ) : null}
                </>
              );
            } else if (!user.isownprofile && user.isprivate && !user.youfollowing) {
              return null
            }
            else {
              return RenderRow({ item, imageSize }) || null;
            }
          }}
          stickyHeaderIndices={[1]}
          ListHeaderComponent={
            <View>
              <ProfileContentHeader editProfile={() => {setOpenEditProfile(true); console.log('awww');}} profilePicture={profilePicture} user={user} setUser={setUser} id={myId as string} myId={myId || ''} />
            </View>}
          ListHeaderComponentStyle={{ zIndex: 1 }}
          ListFooterComponent={<View className="h-12" />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}

        />}
    </View>

  );
}
