import { supabase } from '@/constants/supabaseClient';
import { getUserId } from '@/services/api';
import { changeUsername } from '@/services/usersettings';
import { Filter } from 'bad-words';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SetUsername = ({ closeFunction }: { closeFunction: Dispatch<SetStateAction<boolean>> }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = async () => {
    const filter = new Filter();
    if (!username || username.length < 3 || username.length >= 15) {
      Alert.alert('Username must be at least 3 characters and less than 15.');
      return;
    }
    const regex = new RegExp("^[A-Za-z_.]+$"); // This works because no special escapes needed here

    if (!regex.test(username)) {
      Alert.alert('Username must only contain letters, underscores, and periods.');
      return;
    }
    if (filter.isProfane(username)) {
      Alert.alert("This username may violate community guidelines.")
      return;
    }
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        Alert.alert('No session detected.');
        supabase.auth.signOut()
        return;
      }
      const userId = data.user.id;
      await changeUsername(username.trim(), userId, supabase);
      closeFunction(false);
      getUserId();
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'This username is already taken. Please choose another.';
      Alert.alert(errorMessage);
      return;
    }

  };

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.6)', opacity: fadeAnim, justifyContent: 'center', alignItems: 'center', zIndex: 20 }]}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '90%', borderRadius: 20, overflow: 'hidden' }}>
        <LinearGradient
          colors={['#3897F2', '#14354E']}
          style={{
            justifyContent: 'flex-end',
            paddingBottom: 30,
            paddingTop: 30,
            paddingLeft: 20,
            paddingRight: 20,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="flex-row justify-center items-center gap-3">
            <Text style={styles.title}>Set Your Username</Text>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor="#F9F8F5aa"
            />
          </View>

          <View className="w-[100%] items-center justify-center">
            <TouchableOpacity
              style={{ width: '80%', alignItems: 'center', justifyContent: 'center' }}
              onPress={handleContinue}>
              <Text style={styles.buttonText}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  )
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: '#F9F8F5',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  inputWrapper: {
    backgroundColor: '#1A466B',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    height: 50,
    color: '#F9F8F5',
    fontSize: 18,
  },
  buttonText: {
    paddingVertical: 12,
    backgroundColor: '#F9F8F5',
    borderRadius: 16,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#14354E',
    width: '100%',
    textAlign: 'center',
  },
});

export default SetUsername;
