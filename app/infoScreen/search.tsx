import { numbers } from '@/constants/numbers';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
} from 'react-native';
import Animated, {
    Easing,
    FadeIn,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const SearchScreen = () => {
  const navigation = useRouter();

  // Shared value for horizontal slide (search bar)
  const slideX = useSharedValue(-50);

  // Shared opacity value for fade out on exit (whole screen)
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Slide in search bar on mount
    slideX.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  }, []);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  // Animated style for whole screen opacity
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Function to navigate back after animation
  const goBack = () => {
    navigation.back();
  };

  // On back press: slide out search bar AND fade out whole screen
  const handleBackPress = () => {
    // Animate slideX back to -100 (slide left)
    slideX.value = withTiming(-20, {
      duration: 100,
      easing: Easing.out(Easing.ease),
    });

    // Animate opacity to 0 (fade out)
    opacity.value = withTiming(
      0,
      {
        duration: 100,
        easing: Easing.out(Easing.ease),
      },
      (isFinished) => {
        if (isFinished) {
          runOnJS(goBack)();
        }
      }
    );
  };

  return (
    <Animated.View style={[styles.container, fadeStyle]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Top bar with slide animation */}
        <Animated.View style={[styles.topBar, slideStyle]}>
          <Pressable onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </Pressable>
          <TextInput
            autoFocus
            placeholder="Search"
            placeholderTextColor="#888"
            style={styles.input}
          />
        </Animated.View>

        {/* Rest of the page fades in */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.resultsContainer}>
          <Text style={styles.resultText}>Try searching for a message or group...</Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: numbers.primaryColor, paddingTop: 50 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  backButton: { marginRight: 8 },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    marginRight: 10,
    paddingVertical: 8,
    marginVertical: 12,
  },
  resultsContainer: {
    paddingHorizontal: 16,
  },
  resultText: {
    fontSize: 16,
    color: '#666',
  },
});

export default SearchScreen;
