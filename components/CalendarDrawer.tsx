import { numbers } from '@/constants/numbers';
import { CalendarDrawerProps, calendarGroupProps, calendarPersonProps, drawerProps } from '@/services/utils';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CalendarDrawer = ({
  categories,
  handleCategoryToggle,
  setView,
  people,
  groups,
  handlePersonToggle,
  handleGroupToggle,
}: CalendarDrawerProps) => {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const sections = [
    {
      title: 'Views',
      data: ['Month View', 'Week View', 'Day View'],
    },
    {
      title: 'Categories',
      data: categories,
    },
    {
      title: 'Groups',
      data: groups,
    },
    {
      title: 'People',
      data: people,
    },
  ];

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: numbers.primaryColor,
        transform: [{ translateX: slideAnim }],
      }}
    >
      {/* Logo */}
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

      {/* SectionList */}
      <SectionList<
 string | drawerProps | calendarGroupProps | calendarPersonProps,
  { title: string; data: (string | drawerProps | calendarGroupProps | calendarPersonProps)[] }
>

        sections={sections}
        keyExtractor={(item, index) => {
          if (typeof item === 'string') return `view-${item}-${index}`;
          if ('categoryId' in item) return `category-${item.categoryId}`;
          if ('groupId' in item) return `group-${item.groupId}`;
          if ('personId' in item) return `person-${item.personId}`;
          return `unknown-${index}`;
        }}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-2xl font-bold ml-4 mt-4">{title}</Text>
        )}
        renderItem={({ item, section }) => {
          if (section.title === 'Views' && typeof item === 'string') {
            let iconName: any = 'calendar-outline';
            let viewType: any = 'month';
            if (item.includes('Week')) {
              iconName = 'calendar-number-outline';
              viewType = 'week';
            } else if (item.includes('Day')) {
              iconName = 'calendar-clear-outline';
              viewType = 'day';
            }

            return (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#E4E4E4',
                }}
                onPress={() => setView(viewType)}
              >
                <Ionicons
                  name={iconName}
                  size={22}
                  color="#0E2433"
                  style={{ marginRight: 12 }}
                />
                <Text className="text-xl font-semibold">{item}</Text>
              </TouchableOpacity>
            );
          }

          // Categories
          if (typeof item === "object" && 'categoryId' in item) {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#E4E4E4',
                }}
              >
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
                <Text
                  className="text-xl font-semibold"
                  style={{ flex: 1, color: '#0E2433' }}
                >
                  {item.categoryName}
                </Text>
                {/* Uncomment if you want to show category color bar*/}
                {/* <View
                  style={{
                    width: 6,
                    height: '80%',
                    borderRadius: 3,
                    backgroundColor: item.categoryColor,
                    marginLeft: 8,
                  }}
                /> */}
              </View>
            );
          }

          // Groups
          if (typeof item === "object" && 'groupId' in item) {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#E4E4E4',
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    handleGroupToggle(item.groupId, !item.isChecked)
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
                  {item.isChecked && (
                    <Text style={{ color: '#888', fontWeight: 'bold' }}>✓</Text>
                  )}
                </TouchableOpacity>
                <Text
                  className="text-xl font-semibold"
                  style={{ color: '#0E2433' }}
                >
                  {item.groupName}
                </Text>
              </View>
            );
          }

          // People
          if (typeof item === "object" && 'personId' in item) {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#E4E4E4',
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    handlePersonToggle(item.personId, !item.isChecked)
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
                  {item.isChecked && (
                    <Text style={{ color: '#888', fontWeight: 'bold' }}>✓</Text>
                  )}
                </TouchableOpacity>
                <Text
                  className="text-xl font-semibold"
                  style={{ color: '#0E2433' }}
                >
                  {item.personName}
                </Text>
              </View>
            );
          }

          return null;
        }}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </Animated.View>
  );
};

export default CalendarDrawer;
