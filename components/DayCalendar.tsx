import { icons } from '@/constants/icons';
import { numbers } from '@/constants/numbers';
import { EventDetailsForNow } from '@/services/utils';
import { Ionicons } from '@expo/vector-icons';
import { addDays, endOfWeek, format, isValid, startOfWeek } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  GestureResponderEvent,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  PanResponderGestureState,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CalendarDrawer, { drawerProps } from './CalendarDrawer'; // Adjust the import path as needed
import { TaskCardDetails } from './TaskCard';
import TaskCardCarosel from './TaskCardCarosel';
import MultiDayCalendar from './todosEvents/multiDayCalendarView';

interface calendarProps {
  events: EventDetailsForNow[];
  viewingDate: Date;
  setViewingDateFunc: (date: Date) => void;
  categories: drawerProps[];
  handleCategoryToggle: (categoryId: string, newValue: boolean) => void;
  setView: (view: 'day' | 'week' | 'month') => void;
  hourHeight: number;
  setHourHeight: React.Dispatch<React.SetStateAction<number>>;
}

const createWeekDaysArray = (day: Date) => {
  const todayStart = startOfWeek(new Date(), { weekStartsOn: 0 });
  const dayStart = startOfWeek(day, { weekStartsOn: 0 });

  const earlier = dayStart < todayStart ? dayStart : todayStart;
  const later = dayStart > todayStart ? dayStart : todayStart;

  // Expand the range by one week before and after
  const start = addDays(earlier, -7);
  const end = addDays(later, 7);

  const sundays = [];
  let current = start;

  while (current <= end) {
    sundays.push(current);
    current = addDays(current, 7);
  }

  return sundays;
};

const DayCalendar = ({ events, setView, viewingDate, setViewingDateFunc, categories, handleCategoryToggle, hourHeight, setHourHeight }: calendarProps) => {
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

  // const scrollToDate = (date: Date) => {
  //   console.log(data)
  //   const targetIndex = data.findIndex((d) => format(d, 'yyyy-MM-dd') === format(startOfWeek(date), 'yyyy-MM-dd'));
  //   if (targetIndex !== -1) {
  //     scrollToIndex(targetIndex);
  //     setFocusedDay(date);
  //   } else {
  //     console.warn("Date not found in the current week data.");
  //   }
  // };

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
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 50 && Math.abs(gestureState.dy)/Math.abs(gestureState.dx) < 0.05 && Math.abs(gestureState.dy) < 15 ;
      },
      onPanResponderRelease: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (gestureState.dx > 20 ) {
          // Swiped right — go to previous day
          // setFocusedDay((prev) => addDays(prev, -1));
          // setViewingDateFunc(addDays(focusedDay, -1));
          //scrollToDate(addDays(focusedDay,-1))
          setFocusedDay((prev) => {
            const newDate = addDays(prev, -1);
            setViewingDateFunc(newDate);
            scrollToDate(newDate);
            return newDate;
          });
        } else if (gestureState.dx < -20) {
          // Swiped left — go to next day
          // setFocusedDay((prev) => addDays(prev, 1));
          // setViewingDateFunc(addDays(focusedDay, 1));
          //scrollToDate(addDays(focusedDay,1))
          setFocusedDay((prev) => {
            const newDate = addDays(prev, 1);
            setViewingDateFunc(newDate);
            scrollToDate(newDate);
            return newDate;
          });
        }
      },
    })
  ).current;
  

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent> ) => {
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
  };

  const today = new Date();
  const todayDate = format(today, 'd');


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
    
    {/*underlay, the actual calendar itself*/}
        
    {/* Main Content Area */}
    <ScrollView style={{ flex: 1, backgroundColor: numbers.primaryColor }}>
  {/* Static, non-panResponder section */}
  <TaskCardCarosel taskCards={[storyCardDetails1, storyCardDetails2, storyCardDetails3]} />

  {/* Section with pan responder attached */}
  {/* <View {...panResponder.panHandlers}> */}
    {/* <CalendarDayView
      events={sampleEvents}
      onEventPress={(event) => console.log('Pressed event:', event)}
      day={focusedDay}
    /> */}
    <View>
    <MultiDayCalendar
  events={events}
  currFocusedDay={focusedDay}
  onEventPress={(event) => console.log('Tapped event', event)}
  changeViewingDate={(date) => {setFocusedDay(date); scrollToDate(date)}}
  hourHeight = {hourHeight}
  setHourHeight = {setHourHeight}
/>
</View>

  {/* </View> */}
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

export default DayCalendar;


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


