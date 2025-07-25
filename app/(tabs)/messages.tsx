import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Message = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  isGroup: boolean;
};


import SimpleHeader from '@/components/CustomHeader';
import DraggablePlusButton from '@/components/todosEvents/draggableButton';
import { numbers } from '@/constants/numbers';
import { SB_STORAGE_CONFIG } from '@/services/api';
import { sendIndividualMessage } from '@/services/pushNotifications';
import { Ionicons } from '@expo/vector-icons'; // or another icon lib
import { useRouter } from 'expo-router';
import { TextInput } from 'react-native-gesture-handler';


/**
 * Status messages first (actives first) <- event message over status messaeg
 * 
 * Events (actives first)
 * 
 * Everyone else (actives first)
 */

type Group = {
  id: string;
  name: string;
  iconUri: string;
  status?: 'active' | 'event' | 'active+event' | 'none';
  bubbleText?: string;
  eventText?: string;
  isUser?: boolean;
};

const mockGroups: Group[] = [
  {
    id: 'user',
    name: 'You',
    iconUri: 'https://i.pravatar.cc/100?img=9',
    isUser: true,
    bubbleText: 'Busy 🛠️',
  },
  {
    id: 'g1',
    name: 'Friends',
    iconUri: 'https://i.pravatar.cc/100?img=1',
    status: 'active',
    bubbleText: 'Hanging out 👋',
  },
  {
    id: 'g2',
    name: 'Work',
    iconUri: 'https://i.pravatar.cc/100?img=2',
    status: 'event',
    bubbleText: 'Meeting @ 3PM',
  },
  {
    id: 'g3',
    name: 'Robotics',
    iconUri: 'https://i.pravatar.cc/100?img=3',
    status: 'none',
  },
];


const mockMessages: Message[] = [
  {
    id: '1',
    name: 'Jane Doe',
    lastMessage: 'Hey, are we still meeting tomorrow?',
    time: '3:45 PM',
    isGroup: false
  },
  {
    id: '2',
    name: 'Alex Johnson',
    lastMessage: 'Got it, thanks!',
    time: '1:12 PM',
    isGroup: false
  },
  {
    id: '3',
    name: 'Dev Team',
    lastMessage: 'Reminder: sprint planning today',
    time: '9:00 AM',
    isGroup: true
  },
];

export default function MessagesScreen() {
  const navigation = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const handleSearch = (text: string) => {
    setSearch(text);
    // Optionally: filter messages or group data here
  };

  const renderGroup = ({ item }: { item: Group }) => {
    const isActive = item.status === 'active' || item.status === 'active+event';
    const isInEvent = item.status === 'event' || item.status === 'active+event';
  
    const ringColor = isActive ? '#4CAF50' : '#ddd';
  
    return (
      <Pressable
        onPress={() => item.isUser ? console.log('Edit status') : console.log(`Group ${item.name} pressed`)}
        style={styles.groupItem}
      >
        <View style={styles.bubbleContainer}>
          {item.bubbleText && (
            <Text style={styles.bubbleText} numberOfLines={2}>{item.eventText ?? item.bubbleText}</Text>
          )}
        </View>
  
        <View style={[styles.groupIconWrapper, { borderColor: ringColor }]}>
          <Image source={{ uri: item.iconUri }} style={styles.groupIcon} />
          
          {isInEvent && (
            <Ionicons
              name="calendar"
              size={16}
              color="#4285F4"
              style={styles.statusIcon}
            />
          )}
  
          {item.isUser && (
            <Pressable
              style={styles.addStatusButton}
              onPress={() => console.log('Add status')}
            >
              <Ionicons name="add" size={14} color="#fff" />
            </Pressable>
          )}
        </View>
  
        <Text style={styles.groupName} numberOfLines={1}>
          {item.name}
        </Text>
      </Pressable>
    );
  };
  
    

  const renderMessage = ({ item }: { item: Message }) => (
      <TouchableOpacity
        onPress={() => console.log('Chat', { userId: item.id })}
        style={styles.messageItem}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          {item.isGroup ? (
            <>
              <Image
                source={{ uri: `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg` }}
                style={styles.avatarStackTop}
              />
              <Image
                source={{ uri: `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg` }}
                style={styles.avatarStackBottom}
              />
            </>
          ) : (
            <Image
              source={{ uri: `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg` }}
              style={styles.singleAvatar}
            />
          )}
        </View>
  
        <View style={styles.messageContent}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
        </View>
  
        <Text style={styles.time}>{item.time}</Text>
      </TouchableOpacity>
    );

  return (
    <View style={{...styles.container}}>

      <SimpleHeader/>
  


      <FlatList
        data={mockMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{  }}
        ListHeaderComponent={
          <>

    <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color='#CACFD2' style={styles.searchIcon} />
        <TextInput
      placeholder="Search"
      placeholderTextColor='#CACFD2'
      style={styles.searchInput}
      editable={false}
      showSoftInputOnFocus={false} // Android only
      onPress={() => navigation.navigate('/infoScreen/search')}
    />
    
      </View>

      <Divider />

      <Text className='ml-5 text-[25px] font-extrabold text-secondary mt-1'>Status</Text>

        <FlatList
        data={mockGroups}
        renderItem={renderGroup}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        style={styles.groupList}
        contentContainerStyle={{ marginHorizontal: 12, marginBottom: 8}}
      />

      <Divider />

      <Text className='ml-5 text-[25px] font-extrabold text-secondary my-1'>Messages</Text>
      
      </>
        }
      />
      <DraggablePlusButton onPress={async () => {console.log("will eventually be able to create groups"); await sendIndividualMessage(); }}/>
    </View>
  );
}

const Divider = () => (
  <View style={{ height: 1, backgroundColor: numbers.divider, marginBottom: 8 }} />
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: numbers.primaryColor,
  },
  groupList: {
    marginBottom: 0,
  },
  avatarContainer: {
    flexDirection: 'row',
    marginBottom: 4,
    height: 24,
    width: 36,
    position: 'relative',
  },
  
  singleAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  
  avatarStackTop: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    position: 'absolute',
    left: 0,
    zIndex: 2,
  },
  
  avatarStackBottom: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: numbers.primaryColor
  },
  messageContent: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },
  lastMessage: {
    color: '#666',
    fontSize: 14,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },

  groupItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 70,
    paddingVertical: 6
    //height: 100, // Optional: ensures enough height for alignment to show
  },
  
  
  bubbleContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    //minHeight: 20, // optional: reserve some space to prevent jumping
    marginBottom: 4,
  },
  
  bubbleText: {
    fontSize: 10,
    color: '#555',
    textAlign: 'center',
    maxWidth: 60,
  },
  
  groupIconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  
  groupName: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
    textAlign: 'center',
  },
  
  statusIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  
  addStatusButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: numbers.secondaryColor,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    paddingVertical: 8,
    marginVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight:600,
    color: numbers.primaryColor,
  },
  
});
