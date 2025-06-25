import { numbers } from '@/constants/numbers';
import React, { useEffect, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useSharedValue,
} from 'react-native-reanimated';

interface EventItem {
  title: string;
  start: string | Date;
  end: string | Date;
  color?: string;
  [key: string]: any;
}

interface CalendarWeekViewProps {
  events: EventItem[];
  onEventPress: (event: EventItem) => void;
  focusedDay: Date; // <- New prop
  hourHeight: number;
  setHourHeight: React.Dispatch<React.SetStateAction<number>>;
}

const hours = Array.from({ length: 24 }, (_, i) =>
  `${i.toString().padStart(2, '0')}:00`
);

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MIN_HEIGHT = 30;
const MAX_HEIGHT = 200;
const INITIAL_HEIGHT = 60;

const EVENT_TOP_OFFSET = 20;
const SHOW_TIME_THRESHOLD = 90;

// Helper function to interpolate font size between min and max based on hourHeight
const interpolateFontSize = (
  height: number,
  minH: number,
  maxH: number,
  minFont: number,
  maxFont: number
) => {
  if (height <= minH) return minFont;
  if (height >= maxH) return maxFont;
  return minFont + ((height - minH) / (maxH - minH)) * (maxFont - minFont);
};

const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({
  events,
  onEventPress,
  focusedDay,
  hourHeight,
  setHourHeight
}) => {
  const baseHeight = useSharedValue(INITIAL_HEIGHT);

  // Get start of week (Sunday)
const getStartOfWeek = (date: Date) => {
  const day = new Date(date);
  const diff = day.getDate() - day.getDay(); // Sunday = 0
  day.setDate(diff);
  day.setHours(0, 0, 0, 0);
  return day;
};

const startOfWeek = getStartOfWeek(focusedDay);
const weekDates = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(startOfWeek);
  d.setDate(d.getDate() + i);
  return d;
});

  const [containerWidth, setContainerWidth] = useState<number>(0);
  let maxStack = -1;

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onActive: (event) => {
      const newHeight = Math.min(
        Math.max(
          MIN_HEIGHT,
          baseHeight.value * (1 + (event.scale - 1) * 0.3)
        ),
        MAX_HEIGHT
      );
      runOnJS(setHourHeight)(newHeight);
    },
    onEnd: () => {
      baseHeight.value = hourHeight;
    },
  });

  // Render all-day or multi-day events as slivers on top spanning across days
  const renderAllDayEvents = () => {
    if (containerWidth === 0) return null;
  
    const TOTAL_LEFT_MARGIN = 35;
    const adjustedContainerWidth = containerWidth - TOTAL_LEFT_MARGIN;
    const adjustedColumnWidth = adjustedContainerWidth / 7;
  
    const EVENT_HEIGHT = 20;
    const VERTICAL_MARGIN = 2;
  
    const isFullDay = (start: Date, end: Date) => {
      const s = new Date(start);
      const e = new Date(end);
      return (
        s.getHours() === 0 &&
        s.getMinutes() === 0 &&
        s.getSeconds() === 0 &&
        e.getHours() === 0 &&
        e.getMinutes() === 0 &&
        e.getSeconds() === 0 &&
        e.getTime() - s.getTime() >= 24 * 60 * 60 * 1000
      );
    };
  
    // Returns an array of objects like: { dayIndex: 0-6, date: Date }
    const getFullyCoveredDays = (start: Date, end: Date) => {
      const fullDays: { dayIndex: number; date: Date }[] = [];
  
      const s = new Date(start);
      const e = new Date(end);
      let current = new Date(s);
      current.setHours(0, 0, 0, 0);
  
      while (current < e) {
        const nextDay = new Date(current);
        nextDay.setDate(current.getDate() + 1);
  
        const rangeStart = current.getTime();
        const rangeEnd = nextDay.getTime();
  
        // If the event fully spans this day (00:00 to 00:00 next)
        if (start <= current && end >= nextDay) {
          fullDays.push({ dayIndex: current.getDay(), date: new Date(current) });
        }
  
        current = nextDay;
      }
  
      return fullDays;
    };
  
    const placedEvents: {
      event: EventItem;
      startDay: number;
      endDay: number;
      stackIndex: number;
    }[] = [];

    
  
    events
    .filter((event) => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      return (
        end >= weekDates[0] && start < new Date(weekDates[6].getTime() + 86400000)
      );
    })
    .forEach((event) => {
  
      const start = new Date(event.start);
      const end = new Date(event.end);
  
      // Get only the days where the event fully covers 00:00 to 00:00
      const fullDays = getFullyCoveredDays(start, end);
  
      if (fullDays.length === 0) return;
  
      const startDay = Math.min(...fullDays.map((d) => d.dayIndex));
      const endDay = Math.max(...fullDays.map((d) => d.dayIndex));
  
      // Find available stack index
      let stackIndex = 0;
      while (
        placedEvents.some((pe) => {
          const overlaps =
            !(endDay < pe.startDay || startDay > pe.endDay) &&
            pe.stackIndex === stackIndex;
          return overlaps;
        })
      ) {
        stackIndex++;
      }
      
      maxStack = Math.max(maxStack, stackIndex)
      placedEvents.push({ event, startDay, endDay, stackIndex });
    });
  
    return placedEvents.map(({ event, startDay, endDay, stackIndex }, index) => {
      const left = TOTAL_LEFT_MARGIN + adjustedColumnWidth * startDay;
      const spanDays = endDay - startDay + 1;
      const width = adjustedColumnWidth * spanDays;
      const top = stackIndex * (EVENT_HEIGHT + VERTICAL_MARGIN);
  
      return (
        <Pressable
          key={`allDay-${index}`}
          style={[
            styles.allDayEvent,
            {
              position: 'absolute',
              top,
              left,
              width,
              height: EVENT_HEIGHT,
              backgroundColor: event.color || '#999',
            },
          ]}
          onPress={() => onEventPress(event)}
          testID={`allDayEvent-${index}`}
        >
          <Text style={styles.allDayEventText} numberOfLines={1}>
            {event.title}
          </Text>
        </Pressable>
      );
    });
  };
  const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(new Date());
  }, 60 * 1000); // update every minute

  return () => clearInterval(interval);
}, []);


  const renderCurrentTimeLine = ({extraMargin} : {extraMargin: number}) => {
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
  
    const minutesSinceStart =
      (currentTime.getHours() * 60 + currentTime.getMinutes());
    const top = (minutesSinceStart / 60) * hourHeight + extraMargin;
  
    return (
      <View
        style={[
          styles.currentTimeLine,
          {
            top: top,
            marginLeft: 5,
            width: containerWidth,
          },
        ]}
      >
        <View style={styles.currentTimeDot} />
        <View style={styles.currentTimeBar} />
      </View>
    );
  };
  
  
  

  const renderEvents = () => {
    // Step 1: Split events into per-day slices (excluding full-day coverage)
    const daySlices: {
      event: EventItem;
      sliceStart: Date;
      sliceEnd: Date;
      dayIndex: number;
    }[] = [];
  
    events
    .filter((event) => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      return (
        end >= weekDates[0] && start < new Date(weekDates[6].getTime() + 86400000)
      );
    })
    .forEach((event) => {
  
      const start = new Date(event.start);
      const end = new Date(event.end);
  
      const startDay = new Date(start);
      startDay.setHours(0, 0, 0, 0);
  
      const endDay = new Date(end);
      endDay.setHours(0, 0, 0, 0);
  
      const daysSpanned = Math.ceil(
        (endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
  
      for (let i = 0; i < daysSpanned; i++) {
        const dayStart = new Date(startDay);
        dayStart.setDate(dayStart.getDate() + i);
        dayStart.setHours(0, 0, 0, 0);
  
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
  
        const sliceStart = new Date(Math.max(start.getTime(), dayStart.getTime()));
        const sliceEnd = new Date(Math.min(end.getTime(), dayEnd.getTime()));
  
        // Skip if full day covered exactly
        if (
          sliceStart.getTime() === dayStart.getTime() &&
          sliceEnd.getTime() === dayEnd.getTime()
        ) {
          continue;
        }
  
        daySlices.push({
          event,
          sliceStart,
          sliceEnd,
          dayIndex: dayStart.getDay(),
        });
      }
    });
  
    // Step 2: Group slices by day and handle overlap grouping per day
    // groupsByDay: Array of groups per day, each group is an array of slices that overlap
    const groupsByDay: Array<Array<typeof daySlices[0][]> > = Array(7)
      .fill(null)
      .map(() => []);
  
    daySlices.forEach((slice) => {
      const dayGroups = groupsByDay[slice.dayIndex];
  
      let added = false;
      for (const group of dayGroups) {
        // Check if slice overlaps with any slice in this group
        if (
          group.some((gSlice) => {
            return !(
              gSlice.sliceEnd <= slice.sliceStart || 
              gSlice.sliceStart >= slice.sliceEnd
            );
          })
        ) {
          group.push(slice);
          added = true;
          break;
        }
      }
      if (!added) {
        dayGroups.push([slice]);
      }
    });
  
    // Step 3: Render each slice, positioning and sizing based on group overlaps
    const TOTAL_LEFT_MARGIN = 35;
    const adjustedContainerWidth = containerWidth - TOTAL_LEFT_MARGIN;
    const adjustedColumnWidth = adjustedContainerWidth / 7;
    const totalAvailableWidth = adjustedColumnWidth - 10;
  
    return daySlices.flatMap((slice, index) => {
      const { sliceStart, sliceEnd, dayIndex, event } = slice;
  
      // Find the group this slice belongs to on that day
      const dayGroups = groupsByDay[dayIndex];
      const group = dayGroups.find((g) => g.includes(slice))!;
      const groupSize = group.length;
      const columnIndex = group.indexOf(slice);
  
      const durationHours = (sliceEnd.getTime() - sliceStart.getTime()) / (1000 * 60 * 60);
      const top = (sliceStart.getHours() + sliceStart.getMinutes() / 60) * hourHeight;
      const height = durationHours * hourHeight;
  
      const eventWidth = groupSize > 0 ? totalAvailableWidth / groupSize : totalAvailableWidth;
      const left = TOTAL_LEFT_MARGIN + adjustedColumnWidth * dayIndex + eventWidth * columnIndex;
  
      const fontSizeTitle = interpolateFontSize(hourHeight, MIN_HEIGHT, MAX_HEIGHT, 10, 17);
      const fontSizeTime = Math.max(fontSizeTitle - 2, 10);
  
      return (
        <Pressable
          key={`${index}-${dayIndex}`}
          style={[
            styles.event,
            {
              top,
              height,
              left,
              width: eventWidth,
              right: undefined,
            },
          ]}
          onPress={() => onEventPress(event)}
        >
          <View style={[styles.colorStrip, { backgroundColor: event.color || '#999' }]} />
          <View style={styles.eventContent}>
            <Text style={[styles.eventTitle, { fontSize: fontSizeTitle }]}>{event.title}</Text>
            {hourHeight >= SHOW_TIME_THRESHOLD && (
              <Text style={[styles.eventTime, { fontSize: fontSizeTime }]}>
                {`${sliceStart.getHours()}:${sliceStart.getMinutes().toString().padStart(2, '0')} - ${sliceEnd.getHours()}:${sliceEnd.getMinutes().toString().padStart(2, '0')}`}
              </Text>
            )}
          </View>
        </Pressable>
      );
    });
  };

  
  return (
    <PinchGestureHandler onGestureEvent={pinchHandler}>
      <Animated.View style={styles.container} onLayout={onLayout}>
  
        {/* All-day / Multi-day events bar on top */}
        <View style={styles.allDayEventsContainer}>
          {renderAllDayEvents()}
        </View>
  
        {/* Main scrollable calendar */}
          <View style={{...styles.bodyContainer, marginTop: 22*(maxStack + 1) - 2}}>
            {hours.map((hour, idx) => (
              <View key={idx} style={[styles.hourRow, { height: hourHeight }]}>
                <Text style={styles.hourLabel}>{hour}</Text>
              </View>
            ))}
            {renderEvents()}
            {renderCurrentTimeLine({extraMargin: 0})}
          </View>
      </Animated.View>
    </PinchGestureHandler>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    alignItems: 'center',
    padding: 4,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  bodyContainer: {
    position: 'relative',
    flex: 1,
  },
  hourRow: {
    borderTopWidth: 0.5,
    borderColor: numbers.divider,
    paddingLeft: 4,
  },
  hourLabel: {
    fontSize: 10,
    color: '#666',
    position: 'absolute',
    left: 2,
    top: 2,
  },
  event: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 6,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
  },
  colorStrip: {
    width: 6,
  },
  eventContent: {
    padding: 6,
    flex: 1,
  },
  eventTitle: {
    fontWeight: 'bold',
  },
  eventTime: {
    color: '#555',
  },

  // New styles for all-day event bar on top
  allDayEventsContainer: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
  },
  allDayEvent: {
    position: 'absolute',
    top: 2,
    height: 20,
    borderRadius: 6,
    paddingHorizontal: 6,
    justifyContent: 'center',
    elevation: 2,
  },
  allDayEventText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  currentTimeLine: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  currentTimeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'blue',
    marginRight: 4,
  },
  currentTimeBar: {
    height: 1,
    backgroundColor: 'blue',
    flex: 1,
    marginRight:5
  },
});

export default CalendarWeekView;
