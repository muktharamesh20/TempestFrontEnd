import { icons } from '@/constants/icons';
import { numbers } from '@/constants/numbers';
import { calendarProps } from '@/services/utils';
import { Ionicons } from '@expo/vector-icons';
import { addDays, endOfWeek, format, isValid, startOfWeek } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CalendarDrawer from './CalendarDrawer'; // Adjust the import path as needed
import { TaskCardDetails } from './TaskCard';
import TaskCardCarosel from './TaskCardCarosel';
import MultiWeekCalendar from './todosEvents/multiWeekCalendarView';


const createWeekDaysArray = (day: Date) => {
  const today = startOfWeek(new Date(), { weekStartsOn: 0 });
  const start = day < today ? day : addDays(today, -7);
  const end = day < today ? addDays(today, 7) : day;

  const sundays = [];
  let current = startOfWeek(start, { weekStartsOn: 0 });

  while (current <= end) {
    sundays.push(current);
    current = addDays(current, 7);
  }

  return sundays;
};

const WeekCalendar = ({ events, setView, viewingDate, setViewingDateFunc, categories, handleCategoryToggle, hourHeight, setHourHeight, groups, handleGroupToggle, people, handlePersonToggle, onEventPress }: calendarProps) => {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const screenWidth = Dimensions.get('window').width;

  let initialDay = (viewingDate && isValid(viewingDate)) ? viewingDate : new Date();
  if (!isValid(initialDay)) {
    console.warn("Invalid 'day' value passed to CalendarHeader. Falling back to current date.");
    initialDay = new Date();
  }

  const startSunday = startOfWeek(initialDay, { weekStartsOn: 0 });
  const [data, setData] = useState(createWeekDaysArray(startSunday));
  const [sunday, setSunday] = useState(startSunday);
  const [month, setMonth] = useState(format(startSunday, 'MMMM yyyy'));
  const [focusedDay, setFocusedDay] = useState(initialDay);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMonth(format(endOfWeek(sunday), 'MMMM yyyy'));
  }, [sunday]);

  // Set parent-focused date ONCE on mount (to avoid updating during render)
  useEffect(() => {
    setFocusedDay(initialDay);
  }, []); // only run on first mount

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToOffset({
      offset: index * screenWidth,
      animated: false,
    });
  };



  const extendDataToIncludeDate = (targetDate: Date) => {
    let newData = [...data];
    const targetSunday = startOfWeek(targetDate, { weekStartsOn: 0 });

    while (targetSunday < newData[0]) {
      const prevSunday = addDays(newData[0], -7);
      newData = [prevSunday, ...newData];
    }

    while (targetSunday > newData[newData.length - 1]) {
      const nextSunday = addDays(newData[newData.length - 1], 7);
      newData = [...newData, nextSunday];
    }

    setData(newData);
    return newData;
  };

  const scrollToDate = (date: Date) => {
    let newData = data;
    const targetSunday = startOfWeek(date, { weekStartsOn: 0 });

    // If targetSunday not in data, extend data (regular extend)
    if (!data.some(d => format(d, 'yyyy-MM-dd') === format(targetSunday, 'yyyy-MM-dd'))) {
      newData = extendDataToIncludeDate(date);
    }

    let targetIndex = newData.findIndex(d => format(d, 'yyyy-MM-dd') === format(targetSunday, 'yyyy-MM-dd'));

    if (targetIndex === -1) {
      console.warn("Date not found even after extending data.");
      return;
    }

    // Preload adjacent pages if targetIndex is near the start or end
    const lastIndex = newData.length - 1;

    // If target is at second-to-last or last page, extend forwards
    if (targetIndex >= lastIndex - 1) {
      // Extend forwards by adding one or two more Sundays
      let extended = false;
      while (newData.length < targetIndex + 3) { // preload at least 2 more pages forward
        const nextSunday = addDays(newData[newData.length - 1], 7);
        newData = [...newData, nextSunday];
        extended = true;
      }
      if (extended) {
        setData(newData);
      }
    }

    // If target is at first or second page, extend backwards
    if (targetIndex <= 1) {
      let extended = false;
      while (targetIndex <= 1) {
        const prevSunday = addDays(newData[0], -7);
        newData = [prevSunday, ...newData];
        targetIndex++; // shift target index right since we added at front
        extended = true;
      }
      if (extended) {
        setData(newData);
      }
    }

    scrollToIndex(targetIndex);
    setFocusedDay(date);
    setSunday(newData[targetIndex]);
    setViewingDateFunc(date);
  };



  const getIndexOfDate = (date: Date) => {
    const targetIndex = data.findIndex((d) => format(d, 'yyyy-MM-dd') === format(startOfWeek(date), 'yyyy-MM-dd'));
    return targetIndex !== -1 ? targetIndex : 1;
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);

    if (newIndex === 0) {
      const prevSunday = addDays(data[0], -7);
      const newData = [prevSunday, ...data];
      setData(newData);
      setSunday(newData[1]);
      setTimeout(() => scrollToIndex(1), 0);
    } else if (newIndex === data.length - 1) {
      const nextSunday = addDays(data[data.length - 1], 7);
      const newData = [...data, nextSunday];
      setData(newData);
      setSunday(newData[newIndex]);
    } else {
      setSunday(data[newIndex]);
    }

    setViewingDateFunc(data[newIndex]);
    setFocusedDay(data[newIndex])
  };

  const today = new Date();
  const todayDate = format(today, 'd');

  const handleTogglePublic = () => {
    console.log('Toggle public clicked');
  };

  return (
    <View style={{ flex: 1, backgroundColor: numbers.primaryColor }}>
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
          <TouchableOpacity onPress={() => { setMenuOpen(true) }} className="p-2">
            <Ionicons name="menu-outline" size={35} color="#ffffff" />
          </TouchableOpacity>

          {/* Centered Month Text */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text className="text-3xl font-semibold text-white">{month}</Text>
          </View>

          {/* Calendar Icon with Today's Date */}
          <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center', marginRight: 4 }}>
            <TouchableOpacity onPress={() => { scrollToDate(today); setViewingDateFunc(today) }} className="justify-center items-center">
              <Image source={icons.calendar} style={{ tintColor: '#ffffff', width: 24, height: 24 }} />
              <Text
                style={{
                  position: 'absolute',
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: 'white',
                  marginTop: 6,
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
          initialScrollIndex={getIndexOfDate(initialDay)}
          getItemLayout={(_, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          keyExtractor={(item) => item.toISOString()}
          onMomentumScrollEnd={handleScrollEnd}
          renderItem={({ item }) => {
            const weekdays: Date[] = Array.from({ length: 7 }, (_, i) => addDays(item, i));

            return (
              <View
                style={{
                  width: screenWidth,
                  height: numbers.calendarHeaderHeight - 5,
                  marginTop: insets.top + numbers.headerHeight - 5,
                }}
                className="flex flex-row justify-around items-start px-[3px]"
              >
                <Text className="text-2xl font-semibold text-white  w-[30px]">
                  {/*a little blank space to display times*/}
                </Text>

                {weekdays.map((date, index) => {
                  const isFocused =
                    isValid(date) &&
                    isValid(focusedDay) &&
                    format(date, 'yyyy-MM-dd') === format(focusedDay, 'yyyy-MM-dd');

                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        if (!isValid(date)) return;
                        setFocusedDay(date);
                        setViewingDateFunc(date);
                        console.log('pressed!', date);
                        setView('day');
                      }}
                      className={`flex items-center justify-center w-[50px] gap-[5px] py-5 rounded ${'bg-transparent'
                        }`}
                    >
                      <Text className="text-lg font-semibold text-white">
                        {isValid(date) ? format(date, 'EEE') : '--'}
                      </Text>
                      <Text className="text-sm text-white">
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

      {/* Main Content Area */}
      <ScrollView style={{ flex: 1, backgroundColor: numbers.primaryColor }}>
        <TaskCardCarosel taskCards={[storyCardDetails1, storyCardDetails2, storyCardDetails3]} />

        <MultiWeekCalendar
          currFocusedDay={viewingDate}
          changeViewingDate={(date) => { setViewingDateFunc(date); scrollToDate(date) }}
          events={events}
          onEventPress={(event) => { console.log('Tapped event', event); onEventPress(event) }}
          hourHeight={hourHeight}
          setHourHeight={setHourHeight}
        />

      </ScrollView>

      {/* Overlay and Drawer */}
      {menuOpen && (
        <>
          {/* Dark overlay */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setMenuOpen(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 99,
            }}
          />

          {/* Drawer */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 260, // Adjust width as needed
              height: '100%',
              zIndex: 100,
              elevation: 10,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 10,
            }}
          >
            <CalendarDrawer
              categories={categories}
              handleCategoryToggle={handleCategoryToggle}
              groups={groups}
              handleGroupToggle={handleGroupToggle}
              people={people}
              handlePersonToggle={handlePersonToggle}
              setView={setView}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default WeekCalendar;



const storyCardDetails1: TaskCardDetails = {
  personID: "1",
  taskID: "h",
  groupName: "Gym ofc 🏋️",
  taskName: "little rhea kid gym day",
  mytask: true,
  backlog: false,
  dueDay: new Date("2025-06-19T00:00:00Z"),
  accomplished: false,
}

const storyCardDetails2: TaskCardDetails = {
  personID: "2",
  eventID: "g",
  username: "umamageswari",
  groupName: "Gym ofc 🏋️",
  taskName: "little rhea kid gym day",
  mytask: true,
  backlog: false,
  dueDay: new Date("2025-06-17T00:00:00Z"),
  accomplished: true,
}

const storyCardDetails3: TaskCardDetails = {
  personID: "2",
  taskID: "g",
  username: "umamageswari",
  groupName: "Gym ofc 🏋️",
  taskName: "little rhea kid gym day",
  mytask: false,
  backlog: true,
  accomplished: false,
}


