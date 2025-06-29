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
};


import { numbers } from '@/constants/numbers';
import { Ionicons } from '@expo/vector-icons'; // or another icon lib
import { useRouter } from 'expo-router';
import { TextInput } from 'react-native-gesture-handler';

type Group = {
  id: string;
  name: string;
  iconUri: string;
  status?: 'active' | 'event' | 'none';
  bubbleText?: string;
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
  },
  {
    id: '2',
    name: 'Alex Johnson',
    lastMessage: 'Got it, thanks!',
    time: '1:12 PM',
  },
  {
    id: '3',
    name: 'Dev Team',
    lastMessage: 'Reminder: sprint planning today',
    time: '9:00 AM',
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
    const getBorderColor = () => {
      if (item.status === 'active') return '#4CAF50'; // green
      if (item.status === 'event') return '#2196F3'; // blue
      return '#ddd';
    };
  
    const iconMap = {
      active: 'checkmark-circle',
      event: 'calendar',
      none: null,
    };
  
    const iconColor = item.status === 'active' ? '#4CAF50' : '#2196F3';
  
    return (
      <Pressable
        onPress={() => item.isUser ? console.log('Edit status') : console.log(`Group ${item.name} pressed`)}
        style={styles.groupItem}
      >
        <View style={styles.bubbleContainer}>
          {item.bubbleText && (
            <Text style={styles.bubbleText} numberOfLines={2}>{item.bubbleText}</Text>
          )}
        </View>
  
        <View style={[styles.groupIconWrapper, { borderColor: getBorderColor() }]}>
          <Image source={{ uri: item.iconUri }} style={styles.groupIcon} />
          {item.status && item.status !== 'none' && (
            <Ionicons
              name={iconMap[item.status] as any}
              size={16}
              color={iconColor}
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
      <View style={styles.messageContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{...styles.container, paddingTop:insets.top}}>

  


      <FlatList
        data={mockMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{  }}
        ListHeaderComponent={
          <>

<View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
      placeholder="Search"
      placeholderTextColor="#888"
      style={styles.searchInput}
      editable={false}
      showSoftInputOnFocus={false} // Android only
      onPress={() => navigation.navigate('/infoScreen/search')}
    />
    
      </View>
          <FlatList
        data={mockGroups}
        renderItem={renderGroup}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        style={styles.groupList}
        contentContainerStyle={{ marginHorizontal: 12}}
      />

      </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: numbers.primaryColor,
  },
  groupList: {
    marginBottom: 0,
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
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  
});
