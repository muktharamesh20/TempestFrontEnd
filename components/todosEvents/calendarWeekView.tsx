import { numbers } from '@/constants/numbers';
import { EventDetailsForNow } from '@/services/utils';
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

interface CalendarWeekViewProps {
  events: EventDetailsForNow[];
  onEventPress: (event: EventDetailsForNow) => void;
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
  
    /* ─── layout constants ─── */
    const TOTAL_LEFT_MARGIN = 35;
    const adjustedContainerWidth = containerWidth - TOTAL_LEFT_MARGIN;
    const adjustedColumnWidth = adjustedContainerWidth / 7;
  
    const EVENT_HEIGHT = 20;
    const VERTICAL_MARGIN = 2;
    const DAY_MS = 24 * 60 * 60 * 1000;
  
    /* ─── helper: does event cover the whole day? ─── */
    const fullyCovers = (start: Date, end: Date, dayStart: Date) => {
      const nextDay = new Date(dayStart.getTime() + DAY_MS);
      return start <= dayStart && end >= nextDay;
    };
  
    type Placed = { event: EventDetailsForNow; startDay: number; endDay: number; stackIndex: number };
    const placedEvents: Placed[] = [];
  
    events
      /* keep only events that touch this week */
      .filter((event) => {
        const s = new Date(event.start);
        const e = new Date(event.end);
        return e >= startOfWeek && s < new Date(startOfWeek.getTime() + 7 * DAY_MS);
      })
      .forEach((event) => {
        const s = new Date(event.start);
        const e = new Date(event.end);
  
        /* collect the *indices* (0-6) of fully covered days inside this week */
        const covered: number[] = [];
        for (let i = 0; i < 7; i++) {
          const dayStart = new Date(startOfWeek.getTime() + i * DAY_MS);
          if (fullyCovers(s, e, dayStart)) covered.push(i);
        }
        if (covered.length === 0) return; // nothing to draw this week
  
        const startDay = covered[0];
        const endDay   = covered[covered.length - 1];
  
        /* find a free row (stackIndex) that doesn't collide horizontally */
        let stackIndex = 0;
        while (
          placedEvents.some(
            (pe) =>
              pe.stackIndex === stackIndex &&
              !(endDay < pe.startDay || startDay > pe.endDay)
          )
        ) {
          stackIndex++;
        }
  
        /* if you're deriving maxStack outside, keep this line */
        maxStack = Math.max(maxStack, stackIndex);
  
        placedEvents.push({ event, startDay, endDay, stackIndex });
      });
  
    /* ─── render ─── */
    return placedEvents.map(({ event, startDay, endDay, stackIndex }, idx) => {
      const left  = TOTAL_LEFT_MARGIN + adjustedColumnWidth * startDay;
      const width = adjustedColumnWidth * (endDay - startDay + 1);
      const top   = stackIndex * (EVENT_HEIGHT + VERTICAL_MARGIN);
  
      return (
        <Pressable
          key={`allDay-${idx}`}
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
          testID={`allDayEvent-${idx}`}
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
    /* ───────── collect per-day slices (timed only) ───────── */
    type Slice = {
      event: EventDetailsForNow;
      sliceStart: Date;
      sliceEnd: Date;
      dayIndex: number; // 0–6, relative to startOfWeek
    };
    const daySlices: Slice[] = [];
  
    const DAY_MS = 24 * 60 * 60 * 1000;
    const weekStart = startOfWeek;                 // Sunday 00:00 of this view
    const weekEnd   = new Date(weekStart.getTime() + 7 * DAY_MS);
  
    events
      /* keep events that touch this week */
      .filter((ev) => {
        const s = new Date(ev.start);
        const e = new Date(ev.end);
        return e > weekStart && s < weekEnd;
      })
      .forEach((ev) => {
        const evStart = new Date(ev.start);
        const evEnd   = new Date(ev.end);
  
        /* walk each day of *this* week (0-6) */
        for (let i = 0; i < 7; i++) {
          const dayStart = new Date(weekStart.getTime() + i * DAY_MS);
          const dayEnd   = new Date(dayStart.getTime() + DAY_MS);
  
          /* intersection of [ev] and this day */
          const sliceStart = new Date(Math.max(evStart.getTime(), dayStart.getTime()));
          const sliceEnd   = new Date(Math.min(evEnd.getTime(),   dayEnd.getTime()));
  
          if (sliceEnd <= sliceStart) continue;            // no overlap
          if (sliceStart.getTime() === dayStart.getTime()  // full-day => handled elsewhere
              && sliceEnd.getTime() === dayEnd.getTime()) {
            continue;
          }
  
          daySlices.push({ event: ev, sliceStart, sliceEnd, dayIndex: i });
        }
      });
  
    /* ───────── group overlapping slices per day ───────── */
    const groupsByDay: Array<Array<Slice[]>> = Array(7).fill(null).map(() => []);
  
    daySlices.forEach((slice) => {
      const dayGroups = groupsByDay[slice.dayIndex];
  
      let placed = false;
      for (const group of dayGroups) {
        const overlaps = group.some(
          (g) => !(g.sliceEnd <= slice.sliceStart || g.sliceStart >= slice.sliceEnd)
        );
        if (overlaps) {
          group.push(slice);
          placed = true;
          break;
        }
      }
      if (!placed) dayGroups.push([slice]);
    });
  
    /* ───────── render ───────── */
    const TOTAL_LEFT_MARGIN = 35;
    const adjustedContainerWidth = containerWidth - TOTAL_LEFT_MARGIN;
    const adjustedColumnWidth = adjustedContainerWidth / 7;
    const totalAvailableWidth = adjustedColumnWidth - 10;
  
    return daySlices.flatMap((slice, idx) => {
      const { sliceStart, sliceEnd, dayIndex, event } = slice;
  
      const dayGroups = groupsByDay[dayIndex];
      const group = dayGroups.find((g) => g.includes(slice))!;
      const groupSize = group.length;
      const columnIndex = group.indexOf(slice);
  
      const durationHrs = (sliceEnd.getTime() - sliceStart.getTime()) / (1000 * 60 * 60);
      const top = (sliceStart.getHours() + sliceStart.getMinutes() / 60) * hourHeight;
      const height = durationHrs * hourHeight;
  
      const eventWidth = groupSize ? totalAvailableWidth / groupSize : totalAvailableWidth;
      const left =
        TOTAL_LEFT_MARGIN +
        adjustedColumnWidth * dayIndex +
        eventWidth * columnIndex;
  
      const fontSizeTitle = interpolateFontSize(hourHeight, MIN_HEIGHT, MAX_HEIGHT, 10, 17);
      const fontSizeTime  = Math.max(fontSizeTitle - 2, 10);
  
      return (
        <Pressable
          key={`${idx}-${dayIndex}`}
          style={[
            styles.event,
            { top, height, left, width: eventWidth },
          ]}
          onPress={() => onEventPress(event)}
        >
          <View style={[styles.colorStrip, { backgroundColor: event.color || '#999' }]} />
          <View style={styles.eventContent}>
            <Text style={[styles.eventTitle, { fontSize: fontSizeTitle }]}>{event.title}</Text>
            {hourHeight >= SHOW_TIME_THRESHOLD && (
              <Text style={[styles.eventTime, { fontSize: fontSizeTime }]}>
                {`${sliceStart.getHours()}:${sliceStart.getMinutes().toString().padStart(2, '0')} - ` +
                  `${sliceEnd.getHours()}:${sliceEnd.getMinutes().toString().padStart(2, '0')}`}
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
          <View style={{...styles.bodyContainer, marginTop: 22*(maxStack + 1)}}>
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
