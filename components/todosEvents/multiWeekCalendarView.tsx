import { EventDetailsForNow } from '@/services/utils';
import { addDays } from 'date-fns';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';
import CalendarWeekView from './calendarWeekView';

interface multiWeekCalendarView {
  events: EventDetailsForNow[];
  onEventPress: (event: EventDetailsForNow) => void;
  currFocusedDay: Date;
  changeViewingDate: (date: Date) => void
  hourHeight: number;
  setHourHeight: React.Dispatch<React.SetStateAction<number>>;
}

const MultiWeekCalendar: React.FC<multiWeekCalendarView> = ({
  events,
  onEventPress,
  currFocusedDay,
  changeViewingDate,
  hourHeight,
  setHourHeight
}) => {
  const [centerDate, setCenterDate] = useState(currFocusedDay);
  const scrollRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;

  const scrollToCenter = useCallback(() => {
    scrollRef.current?.scrollTo({ x: screenWidth, animated: false });
  }, [screenWidth]);

  useEffect(() => {
    scrollToCenter();
    if (centerDate != currFocusedDay) {
        changeViewingDate(centerDate)
    }
  }, [centerDate, scrollToCenter]);

  useEffect(() => {
    if (centerDate != currFocusedDay) {
        setCenterDate(currFocusedDay)
        scrollToCenter()
    }
  }, [currFocusedDay])

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const direction = offsetX > screenWidth ? 7 : offsetX < screenWidth ? -7 : 0;

    if (direction !== 0) {
      setCenterDate(prev => addDays(prev, direction));
    }
  };

  const daysToRender = [
    addDays(centerDate, -7),
    centerDate,
    addDays(centerDate, 7),
  ];

  const INITIAL_HEIGHT = 60;

  return (
    <ScrollView
      horizontal
      pagingEnabled
      ref={scrollRef}
      onMomentumScrollEnd={handleScrollEnd}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
    >
      {daysToRender.map((date, idx) => (
        <View key={idx} style={{ width: screenWidth }}>
          <CalendarWeekView
            focusedDay={date}
            events={events}
            onEventPress={onEventPress}
            hourHeight={hourHeight}
            setHourHeight={setHourHeight}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default MultiWeekCalendar;
