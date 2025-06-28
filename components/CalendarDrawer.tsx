import { numbers } from '@/constants/numbers';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface drawerProps {
  isPublic: boolean;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
}

interface CalendarDrawerProps {
  categories: drawerProps[];
  handleCategoryToggle: (categoryId: string, newValue: boolean) => void;
  setView: (view: 'day' | 'week' | 'month') => void;
}

const CalendarDrawer = ({
  categories,
  handleCategoryToggle,
  setView,
}: CalendarDrawerProps) => {
  const insets = useSafeAreaInsets();

  // Slide animation
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: numbers.primaryColor,
        transform: [{ translateX: slideAnim }],
      }}
    >
      {/* Logo at the top */}
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: insets.top,
          borderBottomWidth: 1,
          borderBottomColor: '#E4E4E4',
        }}
      >
        <Image
          source={require('../assets/tempestlogo.png')}
          style={{
            width: 120,
            height: 60,
            resizeMode: 'contain',
            marginBottom: -3,
          }}
        />
      </View>

      {/* Category List */}
      <FlatList
        data={categories}
        style={{ flex: 1, paddingTop: 10 }}
        keyExtractor={(item) => item.categoryId}
        ListHeaderComponent={() => (
          <>
            <Text className="text-2xl font-bold ml-4">Views</Text>
            {/* Month View */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 6,
                paddingBottom: 12,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#E4E4E4',
              }}
              onPress={() => setView('month')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="calendar-outline"
                size={22}
                color="#0E2433"
                style={{ marginRight: 12 }}
              />
              <Text className="text-xl font-semibold">Month View</Text>
            </TouchableOpacity>
            {/* Week View */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#E4E4E4',
              }}
              onPress={() => setView('week')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="calendar-number-outline"
                size={22}
                color="#0E2433"
                style={{ marginRight: 12 }}
              />
              <Text className="text-xl font-semibold">Week View</Text>
            </TouchableOpacity>
            {/* Day View */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 16,
              }}
              activeOpacity={0.7}
              onPress={() => setView('day')}
            >
              <Ionicons
                name="calendar-clear-outline"
                size={22}
                color="#0E2433"
                style={{ marginRight: 12 }}
              />
              <Text className="text-xl font-semibold">Day View</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold ml-4 mt-4">Categories</Text>
          </>
        )}
        renderItem={({ item, index }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: index === 0 ? 8 : 12,
              paddingBottom: 12,
              paddingHorizontal: 16,
              borderBottomWidth: index < categories.length - 1 ? 1 : 0,
              borderBottomColor: '#E4E4E4',
              position: 'relative',
            }}
          >
            {/* Checkbox */}
            <TouchableOpacity
              onPress={() =>
                handleCategoryToggle(item.categoryId, !item.isPublic)
              }
              style={{
                width: 22,
                height: 22,
                borderWidth: 2,
                borderColor: '#888',
                borderRadius: 4,
                marginRight: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.isPublic && (
                <Text style={{ color: '#888', fontWeight: 'bold' }}>✓</Text>
              )}
            </TouchableOpacity>
            {/* Category Name */}
            <Text
              className="text-xl font-semibold mr-2"
              style={{ color: '#0E2433', flex: 1 }}
              numberOfLines={2}
            >
              {item.categoryName}
            </Text>
            {/* Color Sliver */}
            <View
              style={{
                width: 6,
                height: '80%',
                borderRadius: 3,
                marginLeft: 8,
              }}
            />
          </View>
        )}
      />
    </Animated.View>
  );
};

export default CalendarDrawer;
