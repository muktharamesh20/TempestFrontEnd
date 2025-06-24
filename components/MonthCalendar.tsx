import { icons } from '@/constants/icons';
import { numbers } from '@/constants/numbers';
import { Ionicons } from '@expo/vector-icons';
import { addMonths, format, isValid, startOfYear } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CalendarDrawer, { drawerProps } from './CalendarDrawer'; // Adjust the import path as needed
import { TaskCardDetails } from './TaskCard';
import TaskCardCarosel from './TaskCardCarosel';
import CalendarMonthView from './todosEvents/calendarMonthView';

interface calendarProps {
  viewingDate: Date;
  setViewingDateFunc: (date: Date) => void;
  categories: drawerProps[];
  handleCategoryToggle: (categoryId: string, newValue: boolean) => void;
  setView: (view: 'day' | 'week' | 'month') => void;
}

const createMonthsArray = (day: Date) => {
  const today = startOfYear(new Date());
  const start = day < today ? day : addMonths(today, -6);
  const end = day < today ? addMonths(today, 6) : day;

  const startOfMonths = [];
  let current = startOfYear(start);

  while (current <= end) {
    startOfMonths.push(current);
    current = addMonths(current, 6);
  }

  return startOfMonths;
};

const monthDiff = (date1: Date, date2: Date) => {
  return (date1.getFullYear() - date2.getFullYear()) * 12 + (date1.getMonth() - date2.getMonth());
};

const MonthCalendar = ({ setView, viewingDate, setViewingDateFunc, categories, handleCategoryToggle }: calendarProps) => {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const screenWidth = Dimensions.get('window').width;

  let initialDay = (viewingDate && isValid(viewingDate)) ? viewingDate : new Date();
  if (!isValid(initialDay)) {
    console.warn("Invalid 'day' value passed to CalendarHeader. Falling back to current date.");
    initialDay = new Date();
  }

  const startMonth = startOfYear(initialDay);
  const [data, setData] = useState(createMonthsArray(startMonth));
  const [sunday, setSunday] = useState(startMonth);
  const [month, setMonth] = useState(format(startMonth, 'yyyy'));
  const [focusedDay, setFocusedDay] = useState(initialDay);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMonth(format(sunday, 'yyyy'));
  }, [sunday]);

  // Set parent-focused date ONCE on mount (to avoid updating during render)
  useEffect(() => {
    setFocusedDay(initialDay);
    setViewingDateFunc(initialDay);
  }, []); // only run on first mount

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToOffset({
      offset: index * screenWidth,
      animated: false,
    });
  };

  const scrollToDate = (date: Date) => {
    const targetIndex = data.findIndex((d) => format(d, 'yyyy-MM-dd') === format(startOfYear(date), 'yyyy-MM-dd'));
    if (targetIndex !== -1) {
      scrollToIndex(targetIndex);
      setFocusedDay(date);
      setViewingDateFunc(date);
    } else {
      console.warn("Date not found in the current week data.");
    }
  };

  const getIndexOfDate = (date: Date) => {
      const targetIndex = data.findIndex((d) => format(d, 'yyyy') === format(startOfYear(date), 'yyyy'));
      if (targetIndex !== -1 && monthDiff(date, startMonth) >= 0 && monthDiff(date, startMonth) < 6) {
          return targetIndex;
      }
      return 1;
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);

    if (newIndex === 0) {
      const prevMonth = addMonths(data[0], -6);
      const newData = [prevMonth, ...data];
      setData(newData);
      setSunday(newData[1]);
      setTimeout(() => scrollToIndex(1), 0);
    } else if (newIndex === data.length - 1) {
      const nextMonth = addMonths(data[data.length - 1], 6);
      const newData = [...data, nextMonth];
      setData(newData);
      setSunday(newData[newIndex]);
    } else {
      setSunday(data[newIndex]);
    }

    setViewingDateFunc(data[newIndex]);
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
          height: numbers.headerHeight + insets.top + numbers.calendarHeaderHeight -25,
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
          <TouchableOpacity onPress={() => {setMenuOpen(true)}} className="p-2">
            <Ionicons name="menu-outline" size={35} color="#ffffff" />
          </TouchableOpacity>

          {/* Centered Month Text */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text className="text-3xl font-semibold text-white">{month}</Text>
          </View>

          {/* Calendar Icon with Today's Date */}
          <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center', marginRight: 4 }}>
            <TouchableOpacity onPress={() => {scrollToDate(today); setViewingDateFunc(today)}} className="justify-center items-center">
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
            const weekdays = Array.from({ length: 6 }, (_, i) => addMonths(item, i));

            return (
              <View
                style={{
                  width: screenWidth,
                  height: numbers.calendarHeaderHeight - 5 - 16,
                  marginTop: insets.top + numbers.headerHeight - 5,
                }}
                className="flex flex-row justify-between items-start px-4"
              >
                {weekdays.map((date, index) => {
                  const isFocused =
                    isValid(date) &&
                    isValid(focusedDay) &&
                    format(date, 'yyyy-MM') === format(focusedDay, 'yyyy-MM');

                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {if(isValid(date) ){
                        setFocusedDay(date)
                        setViewingDateFunc(date);
                      }}}
                      className={`flex items-center justify-center w-[50px] gap-[5px] py-5 rounded ${
                        isFocused ? 'bg-accent' : 'bg-transparent'
                      }`}
                    >
                      <Text className="text-lg font-semibold text-white">
                        {isValid(date) ? format(date, 'MMM') : '--'}
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
          <ScrollView style={{ flex: 1, backgroundColor: numbers.primaryColor}}>
      {/* Placeholder for main content */}
      {/* <Text className="text-black text-lg">Main content goes here</Text> */}
      {/* <DayViewCalendar day={focusedDay} categoriesShown = {categories}/> */}
      <TaskCardCarosel taskCards={[storyCardDetails1, storyCardDetails2, storyCardDetails3]} />
      <CalendarMonthView
      events={sampleEvents}
      onEventPress={(event) => console.log('Pressed event:', event)}
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
              backgroundColor: '#fff',
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
              setView = {setView}
            />
          </View>
        </>
      )}
  </View>
  );
};

export default MonthCalendar;


const sampleEvents = [
  {
    title: 'Morning Run',
    start: new Date('2025-06-24T06:00:00'),
    end: new Date('2025-06-24T07:00:00'),
    color: '#4CAF50',
  },
  {
    title: 'Team Stand-up Meeting',
    start: new Date('2025-06-24T09:15:00'),
    end: new Date('2025-06-24T09:30:00'),
    color: '#2196F3',
  },
  {
    title: 'Morning Run',
    start: new Date('2025-06-24T06:00:00'),
    end: new Date('2025-06-24T07:00:00'),
    color: '#4CAF50',
  },
  {
    title: 'Team Stand-up Meeting',
    start: new Date('2025-06-24T09:00:00'),
    end: new Date('2025-06-24T09:30:00'),
    color: '#2196F3',
  },
  {
    title: 'Morning Run',
    start: new Date('2025-06-24T06:00:00'),
    end: new Date('2025-06-24T07:00:00'),
    color: '#4CAF50',
  },
  {
    title: 'Team Stand-up Meeting',
    start: new Date('2025-06-24T09:20:00'),
    end: new Date('2025-06-24T09:35:00'),
    color: '#2196F3',
  },
  {
    title: 'Work Session: UI Design',
    start: new Date('2025-06-24T10:00:00'),
    end: new Date('2025-06-24T12:00:00'),
    color: '#FFC107',
  },
  {
    title: 'Lunch with Sarah',
    start: new Date('2025-06-24T12:30:00'),
    end: new Date('2025-06-24T13:30:00'),
    color: '#FF5722',
  },
  {
    title: 'Doctor Appointment',
    start: new Date('2025-06-24T15:00:00'),
    end: new Date('2025-06-24T15:45:00'),
    color: '#9C27B0',
  },
  {
    title: 'Project Review Call',
    start: new Date('2025-06-24T16:00:00'),
    end: new Date('2025-06-24T17:00:00'),
    color: '#3F51B5',
  },
  {
    title: 'Evening Yoga',
    start: new Date('2025-06-24T19:00:00'),
    end: new Date('2025-06-24T20:00:00'),
    color: '#E91E63',
  },{
    title: 'Morning Workout',
    start: new Date('2025-06-23T06:30:00'),
    end: new Date('2025-06-23T07:30:00'),
    color: '#4CAF50',
  },
  {
    title: 'Team Standup',
    start: new Date('2025-06-24T09:00:00'),
    end: new Date('2025-06-24T09:30:00'),
    color: '#2196F3',
  },
  {
    title: 'Lunch with Alex',
    start: new Date('2025-06-25T12:00:00'),
    end: new Date('2025-06-25T13:00:00'),
    color: '#FFC107',
  },
  {
    title: 'Project Meeting',
    start: new Date('2025-06-25T15:00:00'),
    end: new Date('2025-06-25T16:30:00'),
    color: '#9C27B0',
  },
  {
    title: 'Dentist Appointment',
    start: new Date('2025-06-26T11:00:00'),
    end: new Date('2025-06-26T11:45:00'),
    color: '#E91E63',
  },
  {
    title: 'Date Night',
    start: new Date('2025-06-27T19:00:00'),
    end: new Date('2025-06-27T21:30:00'),
    color: '#F44336',
  },
  {
    title: 'Weekend Hike',
    start: new Date('2025-06-29T08:00:00'),
    end: new Date('2025-06-29T10:00:00'),
    color: '#3F51B5',
  },{
    title: 'Date Night',
    start: new Date('2025-06-28T19:00:00'),
    end: new Date('2025-06-28T21:30:00'),
    color: '#F44336',
  },
];



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


