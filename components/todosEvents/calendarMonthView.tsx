import { EventDetailsForNow } from '@/services/utils';
import { addMinutes } from 'date-fns';
import React from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { generateOccurrences } from './calendarWeekView';

interface CalendarMonthViewProps {
  events: EventDetailsForNow[];
  onEventPress: (
    event: EventDetailsForNow | { overflow: true; day: number; count: number }
  ) => void;
  year?: number;
  month?: number; // 0-based month, default current month
  maxVisibleEvents?: number;
  setView: (view: "day" | "week" | "month") => void;
  setViewingDateFunc: (date: Date) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const DAYS_IN_WEEK = 7;
const CELL_PADDING = 4;
const MAX_VISIBLE_EVENTS_DEFAULT = 3;

const padZero = (n: number) => (n < 10 ? `0${n}` : n);

const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  events,
  onEventPress,
  year,
  month,
  maxVisibleEvents = MAX_VISIBLE_EVENTS_DEFAULT,
  setView,
  setViewingDateFunc
}) => {
  const today = new Date();
  const viewYear = year ?? today.getFullYear();
  const viewMonth = month ?? today.getMonth();

  const startOfMonth = new Date(viewYear, viewMonth, 1, 0, 0, 0, 0); // local midnight at start of month
  const endOfMonth = new Date(viewYear, viewMonth + 1, 0, 23, 59, 59, 999); // local end of last day of the month


  // Get days in month
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

  // First day of week for month (0 = Sunday)
  const firstDayWeekday = new Date(viewYear, viewMonth, 1).getDay();

  // Number of days in month
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);

  // Total cells (including blanks to align with weeks)
  const totalCells = Math.ceil((firstDayWeekday + daysInMonth) / DAYS_IN_WEEK) * DAYS_IN_WEEK;

  // Create array for day numbers + blanks (null)
  const daysArray = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - firstDayWeekday + 1;
    return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
  });

  // Group events by day (day number in month)
  const eventsByDay: Record<number, EventDetailsForNow[]> = {};
  events
  .flatMap((event) => generateOccurrences(event, startOfMonth, endOfMonth))
  .forEach((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    // Clamp the event range to this month only
    const localStart = new Date(
      Math.max(eventStart.getTime(), startOfMonth.getTime())
    );
    const localEnd = new Date(
      Math.min(eventEnd.getTime(), endOfMonth.getTime())
    );

    for (
      let date = new Date(localStart);
      date <= localEnd;
      date.setDate(date.getDate() + 1)
    ) {
      if (date.getFullYear() === viewYear && date.getMonth() === viewMonth) {
        const dayNum = date.getDate();
        if (!eventsByDay[dayNum]) eventsByDay[dayNum] = [];
        eventsByDay[dayNum].push(event);
      }
    }
  });


  const cellWidth = SCREEN_WIDTH / DAYS_IN_WEEK;

  function dealWithDayPressed(date: Date): void {
      setViewingDateFunc(addMinutes(date, date.getTimezoneOffset()));
      console.log('pressed!', addMinutes(date, date.getTimezoneOffset()).toLocaleDateString());
      setView('day');
  }

  const renderDayCell = (day: number | null, index: number) => {
    if (!day) {
      return <View key={index} style={[styles.dayCell, { width: cellWidth }]} />;
    }

    const dayEvents = eventsByDay[day] || [];
    const visibleEvents = dayEvents.slice(0, maxVisibleEvents);
    const overflowCount = dayEvents.length - maxVisibleEvents;

    const dateStr = `${viewYear}-${padZero(viewMonth + 1)}-${padZero(day)}`;

    return (
      <View key={index} style={[styles.dayCell, { width: cellWidth }]}>
        <Pressable onPress={() => dealWithDayPressed(new Date(dateStr))}>
          <Text style={styles.dayNumber}>{day}</Text>
        </Pressable>

        <View style={styles.eventsContainer}>
          {visibleEvents.map((event, idx) => (
            <Pressable
              key={idx}
              style={[styles.eventSliver, { backgroundColor: event.color || '#999' }]}
              onPress={() => onEventPress(event)}
            >
              <Text style={styles.eventTitle} numberOfLines={1}>
                {event.title}
              </Text>
            </Pressable>
          ))}
          {overflowCount > 0 && (
            <Pressable
              style={[styles.eventSliver, styles.overflowSliver]}
              onPress={() => dealWithDayPressed(new Date(dateStr))}
            >
              <Text style={styles.overflowText}>+{overflowCount}</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={daysArray}
      keyExtractor={(_, i) => i.toString()}
      numColumns={DAYS_IN_WEEK}
      scrollEnabled={false}
      renderItem={({ item, index }) => renderDayCell(item, index)}
      contentContainerStyle={{ paddingBottom: 0 }}
    />
  );
};

const styles = StyleSheet.create({
  dayCell: {
    borderWidth: 0.5,
    borderColor: '#ddd',
    padding: CELL_PADDING,
    minHeight: 80,
  },
  dayNumber: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  eventSliver: {
    height: 16,
    borderRadius: 4,
    marginBottom: 3,
    paddingHorizontal: 2,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 9,
    color: 'white',
    fontWeight: 600
  },
  overflowSliver: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overflowText: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default CalendarMonthView;
