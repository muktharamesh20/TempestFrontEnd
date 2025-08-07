import { numbers } from '@/constants/numbers';
import { SB_STORAGE_CONFIG } from '@/services/api';
import { ModalPersonType } from '@/services/utils';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

interface personsModalProps {
  visible: boolean;
  people: ModalPersonType[];
  onClose: () => void;
  message: string;
}

const PersonsModal = ({ visible, people, onClose, message }: personsModalProps): React.JSX.Element => {
  const [search, setSearch] = useState('');
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchImageUrls = async () => {
      const urls: Record<string, string> = {};

      await Promise.all(
        people.map(async (person) => {
          const profilePicUrl = `${SB_STORAGE_CONFIG.BASE_URL}${person.id}.jpg`;
          const defaultPicUrl = `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg`;

          try {
            await Image.prefetch(profilePicUrl);
            urls[person.id] = profilePicUrl;
          } catch {
            urls[person.id] = defaultPicUrl;
          }
        })
      );

      setImageUrls(urls);
    };

    if (visible && people.length > 0) {
      fetchImageUrls();
    }
  }, [people, visible]);

  const filteredpeople = people.filter((person) =>
    person.username.toLowerCase().includes(search.toLowerCase())
  );

  const renderpersonItem = ({ item }: { item: ModalPersonType }) => {
    return (
      <Link href={`/profiles/${item.id}`} asChild>
        <Pressable onPress={onClose}>
          <View style={styles.personItem}>

            <Image source={{ uri: imageUrls[item.id] }} style={styles.avatar} />

            <View style={{ marginLeft: 12 }}>
              <Text style={styles.username}>{item.username}</Text>
            </View>
          </View>
        </Pressable>
      </Link>
    );
  };

  return (
    <Modal
      isVisible={visible}
      onSwipeComplete={onClose}
      onBackdropPress={onClose}
      style={styles.modal}
      propagateSwipe={true}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={'padding'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={{ width: 24 }} />
            <Text style={styles.title}>{message}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search users..."
            placeholderTextColor="#888"
            style={styles.searchInput}
          />

          {filteredpeople.length === 0 ? (
            <Text style={styles.emptyText}>None found.</Text>
          ) : (
            <FlatList
              data={filteredpeople}
              keyExtractor={(item) => item.id}
              renderItem={renderpersonItem}
              contentContainerStyle={{ marginBottom: 0 }}
              scrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default PersonsModal;

// Styles stay the same
const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: numbers.primaryColor,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: '90%',
    minHeight: '60%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: numbers.secondaryColor,
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 16,
    color: numbers.secondaryColor,
    backgroundColor: numbers.primaryColor,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    marginBottom: 20,
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: numbers.secondaryColor,
  },
});
