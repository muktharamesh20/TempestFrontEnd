import { numbers } from '@/constants/numbers';
import { EventDetailsForNow } from '@/services/utils';
import { addDays, endOfWeek, startOfWeek } from 'date-fns';
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


export function generateOccurrences(
  event: EventDetailsForNow,
  weekStart: Date,
  weekEnd: Date,
): EventDetailsForNow[] {
  function toDateOnly(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  const isAllDay = event.isAllDay ?? false;

  const originalStart = isAllDay ? toDateOnly(event.start) : new Date(event.start);
  const originalEnd = isAllDay ? toDateOnly(event.end) : new Date(event.end);

  const eventsForNow: EventDetailsForNow[] = [];

  const cloneDateWithTime = (base: Date, reference: Date): Date => {
    if (isAllDay) return toDateOnly(base);
    const newDate = new Date(base);
    newDate.setHours(
      reference.getHours(),
      reference.getMinutes(),
      reference.getSeconds(),
      reference.getMilliseconds()
    );
    return newDate;
  };

  const startDate = isAllDay ? toDateOnly(event.start) : new Date(event.start);
  const endDate = isAllDay ? toDateOnly(event.end) : new Date(event.end);
  const endRepeatDate = isAllDay ? toDateOnly(event.end_repeat) : new Date(event.end_repeat);

  const effectiveWeekStart = isAllDay ? toDateOnly(weekStart) : weekStart;
  const effectiveWeekEnd = isAllDay
    ? toDateOnly(weekEnd > endRepeatDate ? endRepeatDate : weekEnd)
    : weekEnd > endRepeatDate ? endRepeatDate : weekEnd;

  if (event.repeat_schedule === 'none') {
    if (startDate <= effectiveWeekEnd && endDate >= effectiveWeekStart) {
      eventsForNow.push({ ...event });
    }
    return eventsForNow;
  }

  const eventDuration = endDate.getTime() - startDate.getTime();

  if (event.repeat_schedule === 'daily') {
    for (
      let d = new Date(effectiveWeekStart.getTime() - eventDuration);
      d <= effectiveWeekEnd;
      d = addDays(d, 1)
    ) {
      if (d >= startDate && d <= endRepeatDate) {
        const start = cloneDateWithTime(d, startDate);
        const end = new Date(start.getTime() + eventDuration);
        eventsForNow.push({ ...event, start, end });
      }
    }
  } else if (event.repeat_schedule === 'weekly' || event.repeat_schedule === 'biweekly') {
    const increment = event.repeat_schedule === 'weekly' ? 7 : 14;

    const startDay = startDate.getDay();
    const startWeekMonday = addDays(startDate, -startDay);
    const weekStartDay = addDays(new Date(effectiveWeekStart.getDate() - eventDuration), -1);
    const currentWeekMonday = addDays(effectiveWeekStart, -weekStartDay);

    const weeksDiff = Math.floor(
      (currentWeekMonday.getTime() - startWeekMonday.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );

    let firstWeekMonday =
      weeksDiff >= 0
        ? addDays(startWeekMonday, Math.floor(weeksDiff / (increment / 7)) * increment)
        : startWeekMonday;

    for (
      let weekStartDate = firstWeekMonday;
      weekStartDate <= effectiveWeekEnd;
      weekStartDate = addDays(weekStartDate, increment)
    ) {
      for (let i = 0; i < 7; i++) {
        const day = addDays(weekStartDate, i);

        if (
          day >= weekStartDate &&
          day <= effectiveWeekEnd &&
          day <= endRepeatDate &&
          day >= event.start &&
          event.days.includes(day.getDay())
        ) {
          const start = cloneDateWithTime(day, startDate);
          const end = new Date(start.getTime() + eventDuration);
          eventsForNow.push({ ...event, start, end });
        }
      }
    }
  } else if (event.repeat_schedule === 'yearly') {
    for (
      let year = startDate.getFullYear();
      year <= endRepeatDate.getFullYear();
      year++
    ) {
      const occurrenceStart = isAllDay
        ? toDateOnly(new Date(year, startDate.getMonth(), startDate.getDate()))
        : new Date(
            year,
            startDate.getMonth(),
            startDate.getDate(),
            startDate.getHours(),
            startDate.getMinutes(),
            startDate.getSeconds(),
            startDate.getMilliseconds()
          );

      const occurrenceEnd = new Date(occurrenceStart.getTime() + eventDuration);

      if (
        occurrenceStart <= effectiveWeekEnd &&
        occurrenceEnd >= effectiveWeekStart
      ) {
        eventsForNow.push({
          ...event,
          start: occurrenceStart,
          end: occurrenceEnd,
        });
      }
    }
  } else if (event.repeat_schedule === 'monthly') {
    let monthCursor = new Date(startDate.getTime());

    while (monthCursor < addDays(new Date(effectiveWeekStart.getDate() - eventDuration), -1)) {
      monthCursor.setMonth(monthCursor.getMonth() - 1);
      const daysInMonth = new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 0).getDate();
      monthCursor.setDate(Math.min(startDate.getDate(), daysInMonth));
    }

    while (monthCursor <= effectiveWeekEnd && monthCursor <= endRepeatDate) {
      if (
        monthCursor >= startDate &&
        monthCursor >= addDays(new Date(effectiveWeekStart.getDate() - eventDuration), -1) &&
        monthCursor.getDate() == startDate.getDate()
      ) {
        const start = cloneDateWithTime(monthCursor, startDate);
        const end = new Date(start.getTime() + eventDuration);
        eventsForNow.push({ ...event, start, end });
      }

      monthCursor.setMonth(monthCursor.getMonth() + 1);
      const daysInMonth = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0).getDate();
      monthCursor.setDate(Math.min(startDate.getDate(), daysInMonth));
    }
  }

  return eventsForNow;
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

  events = events.flatMap((event) => generateOccurrences(event, startOfWeek(focusedDay), endOfWeek(focusedDay)))


  const weekStart = startOfWeek(focusedDay);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
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
      const nextDay = new Date(dayStart);
      nextDay.setDate(dayStart.getDate() + 1);

      return start <= dayStart && end >= nextDay;
    };

    type Placed = { event: EventDetailsForNow; startDay: number; endDay: number; stackIndex: number };
    const placedEvents: Placed[] = [];

    events
      /* keep only events that touch this week */
      .filter((event) => {
        const s = new Date(event.start);
        const e = new Date(event.end);
        return e >= weekStart && s < addDays(weekStart, 7);
      })
      .forEach((event) => {
        const s = new Date(event.start);
        const e = new Date(event.end);

        /* collect the *indices* (0-6) of fully covered days inside this week */
        const covered: number[] = [];
        for (let i = 0; i < 7; i++) {
          const dayStart = addDays(weekStart, i);
          if (fullyCovers(s, e, dayStart)) covered.push(i);
        }
        if (covered.length === 0) return; // nothing to draw this week

        const startDay = covered[0];
        const endDay = covered[covered.length - 1];

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
      const left = TOTAL_LEFT_MARGIN + adjustedColumnWidth * startDay;
      const width = adjustedColumnWidth * (endDay - startDay + 1);
      const top = stackIndex * (EVENT_HEIGHT + VERTICAL_MARGIN);

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


  const renderCurrentTimeLine = ({ extraMargin }: { extraMargin: number }) => {
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
    // const weekStart = weekStart;                 // Sunday 00:00 of this view
    const weekEnd = addDays(weekStart, 7);

    events
      /* keep events that touch this week */
      .filter((ev) => {
        const s = new Date(ev.start);
        const e = new Date(ev.end);
        return e > weekStart && s < weekEnd;
      })
      .forEach((ev) => {
        const evStart = new Date(ev.start);
        const evEnd = new Date(ev.end);

        /* walk each day of *this* week (0-6) */
        for (let i = 0; i < 7; i++) {
          const dayStart = addDays(weekStart, i);
          const dayEnd = addDays(dayStart, 1);

          /* intersection of [ev] and this day */
          const sliceStart = new Date(Math.max(evStart.getTime(), dayStart.getTime()));
          const sliceEnd = new Date(Math.min(evEnd.getTime(), dayEnd.getTime()));

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
      const fontSizeTime = Math.max(fontSizeTitle - 2, 10);

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
        <View style={{ ...styles.bodyContainer, marginTop: 22 * (maxStack + 1) }}>
          {hours.map((hour, idx) => (
            <View key={idx} style={[styles.hourRow, { height: hourHeight }]}>
              <Text style={styles.hourLabel}>{hour}</Text>
            </View>
          ))}
          {renderEvents()}
          {renderCurrentTimeLine({ extraMargin: 0 })}
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
    marginRight: 5
  },
});

export default CalendarWeekView;
