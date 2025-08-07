import { numbers } from '@/constants/numbers';
import { supabase } from '@/constants/supabaseClient';
import { SB_STORAGE_CONFIG } from '@/services/api';
import { Category } from '@/services/utils';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Filter } from 'bad-words';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Modal from 'react-native-modal';

interface EditProfileModalProps {
  visible: boolean;
  currentAvatar: string | null;
  setCurrAvatar: (uri: string | null) => void;
  currentUsername: string;
  currentBio: string;
  currentId: string;
  categories: Category[];
  onClose: () => void;
  onSave: (updated: {
    username: string;
    bio: string;
    selectedCategories: Category[];
  }) => void;
}

const CategoryPill = ({
  label,
  selected,
  onPress,
  addOrEdit
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  addOrEdit?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.pill,
      { backgroundColor: selected ? numbers.secondaryColor : addOrEdit ?  numbers.primaryColor : '#eee' , 
        borderWidth: addOrEdit ? 0.5 : 1,
      },
    ]}
  >
    <Text
      style={{
        color: selected ? numbers.primaryColor : '#333',
        fontWeight: '600',
        fontSize: 13,
        textAlignVertical: 'center', // optional — Android only
      }}
    >
      {label}
    </Text>

  </TouchableOpacity>
);


const EditProfileModal = ({
  visible,
  currentAvatar,
  setCurrAvatar,
  currentId,
  currentUsername,
  currentBio,
  categories,
  onClose,
  onSave,
}: EditProfileModalProps) => {
  const [username, setUsername] = useState(currentUsername);
  const [bio, setBio] = useState(currentBio);
  const [uploading, setUploading] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [fullCategories, setFullCategories] = useState<Category[]>([]);
  const [avImage, setAvImage] = useState(currentAvatar);

  useEffect(() => {
    setAllCategories(categories.map((value) => value.name));
    setFullCategories(categories.map((value) => value))
  }, [categories])

  const toggleCategory = (category: string, categoryId: string) => {
    setFullCategories(
      fullCategories.map(value =>
        value.id === categoryId
          ? { ...value, visible: !value.visible }
          : value
      )
    );
  };





  const uploadAvatar = async () => {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const image = result.assets[0];

      // Resize and compress image to 300x300 and ~100KB
      const manipulated = await ImageManipulator.manipulateAsync(
        image.uri,
        [{ resize: { width: 300, height: 300 } }],
        {
          compress: 0.7, // adjust if size is still too large
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      // Ensure file is under 100KB
      const fileInfo = await FileSystem.getInfoAsync(manipulated.uri);
      if (fileInfo.exists && typeof fileInfo.size === 'number' && fileInfo.size > 100 * 1024) {
        Alert.alert('Image too large', 'Please choose a smaller image.');
        return;
      }

      // Convert to array buffer
      const response = await fetch(manipulated.uri);
      const arrayBuffer = await response.arrayBuffer();

      const fileName = `${currentId}.jpg`;

      await supabase.storage.from('profile-images').remove([fileName]);

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Cache bust
      //setAvImage(`${currentAvatar}?t=${Date.now()}`);
      setAvImage(`${SB_STORAGE_CONFIG.BASE_URL}${currentId}.jpg?t=${Date.now()}`)
      const cacheKey = `profilePicture:${currentId}`;
      const defaultPicUrl = `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg`;
      const profilePicUrl = `${SB_STORAGE_CONFIG.BASE_URL}${currentId}.jpg?t=${Date.now()}`;

      // Prefetch and store in cache
      try {
        // Prefetch and store in cache
        await Image.prefetch(profilePicUrl);
        setCurrAvatar(profilePicUrl);
        await AsyncStorage.setItem(cacheKey, profilePicUrl);
      } catch {
        setCurrAvatar(defaultPicUrl);
      }

    } catch (error: any) {
      Alert.alert('Avatar upload failed', error.message);
    } finally {
      setUploading(false);
    }
  };




  const handleSave = () => {
    const filter = new Filter();
    const isValidUsername = (username: string): boolean => {
      return /^[a-z0-9A-Z_.]+$/.test(username);
    };
    if (!username.trim()) {
      Alert.alert('Username is required');
      return;
    } else if (!isValidUsername(username.trim())) {
      Alert.alert('Username is invalid.  Make sure you only use letters, numbers, underscores, and periods.')
      return;
    } else if (filter.isProfane(username)) {
      Alert.alert("This username may violate community guidelines.")
      return;
    }

    onSave({ username, bio, selectedCategories: fullCategories });
    onClose();
  };

  return (
    <Modal isVisible={visible} onBackdropPress={onClose} style={styles.modal}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.header}>
          <View style={{ width: 24 }} />
          <Text style={styles.title}>Edit Profile</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => uploadAvatar()} style={styles.avatarWrapper}>
          {avImage ? (
            <Image source={{ uri: avImage }} style={styles.avatar} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="camera" size={32} color="#aaa" />
            </View>
          )}
          <Text style={styles.uploadText}>{uploading ? 'Uploading...' : 'Change Avatar'}</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor="#888"
        />

        <TextInput
          style={[styles.input, { height: 80 }]}
          value={bio}
          onChangeText={setBio}
          placeholder="Bio"
          placeholderTextColor="#888"
          multiline
        />

        {
          <View className="flex-row items-center justify-between">
            <Text style={styles.sectionTitle}>Show on profile:</Text>
            {/* <Pressable>
              <Text style={{ color: numbers.secondaryColor, fontSize: 14 }}>Edit Categories</Text>
            </Pressable> */}
          </View>
        }
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={fullCategories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryPill
              label={item.name}
              selected={item.visible}
              onPress={() => toggleCategory(item.name, item.id)}
            />
          )}
          contentContainerStyle={{ gap: 8 }}
          ListFooterComponent={
            <>
              <CategoryPill
                label="Add/Edit Categories"
                selected={false}
                addOrEdit = {true}
                onPress={() => console.log('will redirect to creating categories')}
                />
            </>
          }
        />



        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditProfileModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: numbers.primaryColor,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: numbers.secondaryColor,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    color: '#888',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: numbers.secondaryColor,
    backgroundColor: numbers.primaryColor,
  },

  saveButton: {
    backgroundColor: numbers.secondaryColor,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',    // center text horizontally
    justifyContent: 'center', // center text vertically
    marginTop: 35,
    height: 50,
    marginBottom: 50,
  },
  saveText: {
    color: numbers.primaryColor,
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: numbers.secondaryColor,
    marginBottom: 4,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4, // keep this small
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center', // <-- centers text horizontally
    height: 28, // set explicit height to control vertical alignment
  },
});
