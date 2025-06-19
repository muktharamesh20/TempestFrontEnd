import { icons } from '@/constants/icons';
import { numbers } from '@/constants/numbers';
import { Ionicons } from '@expo/vector-icons';
import { addDays, format, isValid, startOfWeek } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface calendarProps {
  day?: Date;
}

const createWeekDaysArray = (sunday: Date) => {
  return [addDays(sunday, -7), sunday, addDays(sunday, 7)];
};

const CalendarHeader = ({ day }: calendarProps) => {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const screenWidth = Dimensions.get('window').width;

  let initialDay = (day && isValid(day)) ? day : new Date();
  if (!isValid(initialDay)) { 
    console.warn("Invalid 'day' value passed to CalendarHeader. Falling back to current date.");
    initialDay = new Date();
  }

  const startSunday = startOfWeek(initialDay, { weekStartsOn: 0 });
  const [data, setData] = useState(createWeekDaysArray(startSunday));
  const [sunday, setSunday] = useState(startSunday);
  const [month, setMonth] = useState(format(startSunday, 'MMMM yyyy'));
  const [focusedDay, setFocusedDay] = useState<Date>(initialDay);
  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    setMonth(format(sunday, 'MMMM yyyy'));
  }, [sunday]);

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToOffset({
      offset: index * screenWidth,
      animated: false,
    });
  };

  const scrollToDate = (date: Date) => {
    const targetIndex = data.findIndex((d) => format(d, 'yyyy-MM-dd') === format(startOfWeek(date), 'yyyy-MM-dd'));
    if (targetIndex !== -1) {
      scrollToIndex(targetIndex);
      setFocusedDay(date);
      setCurrentIndex(targetIndex);
    } else {
      console.warn("Date not found in the current week data.");
    }
  }

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);

    if (newIndex === 0) {
      // Scrolled backward
      const prevSunday = addDays(data[0], -7);
      const newData = [prevSunday, ...data];
      setData(newData);
      setSunday(newData[1]); // New "center" week
      setCurrentIndex(1);
      setTimeout(() => scrollToIndex(1), 0); // Prevent jump
    } else if (newIndex === data.length - 1) {
      // Scrolled forward
      const nextSunday = addDays(data[data.length - 1], 7);
      const newData = [...data, nextSunday];
      setData(newData);
      setSunday(newData[newIndex]);
      setCurrentIndex(newIndex);
    } else {
      // Centered
      setSunday(data[newIndex]);
      setCurrentIndex(newIndex);
    }
  };

  const today = new Date();
  const todayDate = format(today, 'd'); // Get today's date as a number (e.g., "5" for the 5th)

  return (
    <View
      style={{
        height: numbers.headerHeight + insets.top + numbers.calendarHeaderHeight,
        backgroundColor: numbers.secondaryColor,
      }}
    >
      {/* Month Header */}
      <View
        style={{
          height: numbers.headerHeight,
          marginTop: insets.top,
        }}
        className="absolute w-full flex flex-row items-center bg-secondary px-4 z-50"
      >
        {/* Menu Button */}
        <TouchableOpacity
          onPress={() => {
            // Handle menu button press (e.g., open drawer)
          }}
          className="p-2"
        >
          <Ionicons name="menu-outline" size={35} color="#ffffff" />
        </TouchableOpacity>

        {/* Centered Month Text */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text className="text-3xl font-semibold text-white">{month}</Text>
        </View>

        {/* Calendar Icon with Today's Date */}
        <View
          style={{
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 4,
          }}
        >

        <TouchableOpacity onPress = {() => scrollToDate(today)} className='justify-center items-center'>
          <Image
            source={icons.calendar}
            style={{ tintColor: '#ffffff', width: 24, height: 24 }}
          />
          {/* Overlay Today's Date */}
            <Text
              style={{
                position: 'absolute',
                fontSize: 12,
                fontWeight: 'bold',
                color: 'white',
                marginTop: 6
              }}
            >
              {todayDate}
            </Text>
          </TouchableOpacity>

          
        </View>
      </View>

      {/* Week Scrollable List */}
      <FlatList
        data={data}
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={1}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        keyExtractor={(item) => item.toISOString()}
        onMomentumScrollEnd={handleScrollEnd}
        renderItem={({ item }) => {
          const weekdays = Array.from({ length: 7 }, (_, i) => addDays(item, i));

          return (
            <View
              style={{
                width: screenWidth,
                height: numbers.calendarHeaderHeight - 5,
                marginTop: insets.top + numbers.headerHeight - 5,
              }}
              className="flex flex-row justify-center items-start gap-[3px] px-4"
            >
              {weekdays.map((date, index) => {
                const isFocused =
                  isValid(date) &&
                  isValid(focusedDay) &&
                  format(date, 'yyyy-MM-dd') === format(focusedDay, 'yyyy-MM-dd');

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => isValid(date) && setFocusedDay(date)}
                    className={`flex items-center justify-center w-[50px] gap-[5px] py-5 rounded ${
                      isFocused ? 'bg-accent' : 'bg-transparent'
                    }`}
                  >
                    <Text className={`text-lg font-semibold text-white`}>
                      {isValid(date) ? format(date, 'EEE') : '--'}
                    </Text>
                    <Text className={`text-sm text-white`}>
                      {isValid(date) ? format(date, 'd') : '--'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        }}
      />
    </View>
  );
};

export default CalendarHeader;
