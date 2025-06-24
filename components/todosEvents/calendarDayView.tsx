import { numbers } from '@/constants/numbers';
import React, { useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
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

interface CalendarDayViewProps {
  events: EventItem[];
  onEventPress: (event: EventItem) => void;
}

const hours = Array.from({ length: 24 }, (_, i) =>
  `${i.toString().padStart(2, '0')}:00`
);

const MIN_HEIGHT = 30;
const MAX_HEIGHT = 200;
const INITIAL_HEIGHT = 60;

const EVENT_LEFT_START = 40;
const SHOW_TIME_THRESHOLD = 90; // Threshold to show event time text

const ALL_DAY_EVENT_SINGLE_HEIGHT = 24;

const CalendarDayView: React.FC<CalendarDayViewProps> = ({
  events,
  onEventPress,
}) => {
  const [hourHeight, setHourHeight] = useState<number>(INITIAL_HEIGHT);
  const baseHeight = useSharedValue(INITIAL_HEIGHT);

  const [containerWidth, setContainerWidth] = useState<number>(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  // Helper to scale font size based on hourHeight between minSize and maxSize
  const getFontSize = (hourHeight: number, minSize = 8, maxSize = 17) => {
    if (hourHeight <= MIN_HEIGHT) return minSize;
    if (hourHeight >= MAX_HEIGHT) return maxSize;

    return (
      minSize +
      ((hourHeight - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT)) * (maxSize - minSize)
    );
  };

  const pinchHandler = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent
  >({
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

  // Determine if event is all-day: start <= 00:00 AND end >= 23:59 on the same day
  const isAllDayEvent = (event: EventItem, dayStart: Date, dayEnd: Date) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    return start <= dayStart && end >= dayEnd;
  };

  // Separate all-day events and timed events
  // const renderEvents = () => {
  //   const dayStart = new Date();
  //   dayStart.setHours(0, 0, 0, 0);
  //   const dayEnd = new Date();
  //   dayEnd.setHours(23, 59, 59, 999);

  //   // Separate all-day and timed events
  //   const allDayEvents = events.filter((event) => {
  //     const start = new Date(event.start);
  //     const end = new Date(event.end);
  //     return start <= dayStart && end >= dayEnd;
  //   });

  //   const timedEvents = events.filter((event) => {
  //     const start = new Date(event.start);
  //     const end = new Date(event.end);
  //     return !(start <= dayStart && end >= dayEnd);
  //   });

    

  //   // Calculate dynamic total height for all-day events stack
  //   const allDayStackHeight = allDayEvents.length * ALL_DAY_EVENT_SINGLE_HEIGHT;

  //   // Render all-day events stacked at the top, full width, no left margin
  //   const allDayEventComponents = allDayEvents.map((event, index) => {
  //     const top = index * ALL_DAY_EVENT_SINGLE_HEIGHT; // stack each event vertically
  //     const width = containerWidth; // full width
  //     const fontSize = getFontSize(hourHeight, 11, 14);

  //     return (
  //       <Pressable
  //         key={`allday-${index}`}
  //         style={[
  //           styles.event,
  //           {
  //             top,
  //             height: ALL_DAY_EVENT_SINGLE_HEIGHT,
  //             left: 0, // full width, no left margin
  //             width,
  //             right: undefined,
  //           },
  //         ]}
  //         onPress={() => onEventPress(event)}
  //       >
  //         <View
  //           style={[styles.colorStrip, { backgroundColor: event.color || '#999' }]}
  //         />
  //         <View style={styles.eventContent}>
  //           <Text style={[styles.eventTitle, { fontSize }]} numberOfLines={1}>
  //             {event.title}
  //           </Text>
  //         </View>
  //       </Pressable>
  //     );
  //   });

  //   // Group timed events as before
  //   const sortedTimedEvents = [...timedEvents].sort(
  //     (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  //   );

  //   const groups: EventItem[][] = [];

  //   sortedTimedEvents.forEach((event) => {
  //     const eventStart = new Date(event.start).getTime();
  //     const eventEnd = new Date(event.end).getTime();

  //     let added = false;
  //     for (const group of groups) {
  //       if (
  //         group.some(
  //           (e) =>
  //             !(
  //               new Date(e.end).getTime() <= eventStart ||
  //               new Date(e.start).getTime() >= eventEnd
  //             )
  //         )
  //       ) {
  //         group.push(event);
  //         added = true;
  //         break;
  //       }
  //     }
  //     if (!added) {
  //       groups.push([event]);
  //     }
  //   });

  //   // Render timed events positioned below the all-day stack
  //   const timedEventComponents = sortedTimedEvents.map((event, index) => {
  //     const group = groups.find((g) => g.includes(event))!;
  //     const groupSize = group.length;
  //     const columnIndex = group.indexOf(event);

  //     const start = new Date(event.start);
  //     const end = new Date(event.end);

  //     // Start time offset by the height of all-day events stack
  //     const top =
  //       (start.getHours() + start.getMinutes() / 60) * hourHeight +
  //       allDayStackHeight + 5;

  //     const height =
  //       ((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * hourHeight;

  //     const totalAvailableWidth = containerWidth - EVENT_LEFT_START - 10;
  //     const eventWidth = groupSize > 0 ? totalAvailableWidth / groupSize : totalAvailableWidth;
  //     const left = EVENT_LEFT_START + eventWidth * columnIndex;

  //     const fontSizeTitle = getFontSize(hourHeight, 11, 17);
  //     const fontSizeTime = getFontSize(hourHeight, 11, 17);

  //     return (
  //       <Pressable
  //         key={`timed-${index}`}
  //         style={[
  //           styles.event,
  //           {
  //             top,
  //             height,
  //             left,
  //             width: eventWidth,
  //             right: undefined,
  //           },
  //         ]}
  //         onPress={() => onEventPress(event)}
  //       >
  //         <View
  //           style={[styles.colorStrip, { backgroundColor: event.color || '#999' }]}
  //         />
  //         <View style={styles.eventContent}>
  //           <Text style={[styles.eventTitle, { fontSize: fontSizeTitle }]}>
  //             {event.title}
  //           </Text>
  //           {hourHeight >= SHOW_TIME_THRESHOLD && (
  //             <Text style={[styles.eventTime, { fontSize: fontSizeTime }]}>
  //               {`${start.getHours()}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours()}:${end.getMinutes().toString().padStart(2, '0')}`}
  //             </Text>
  //           )}
  //         </View>
  //       </Pressable>
  //     );
  //   });

  //   return [...allDayEventComponents, ...timedEventComponents];
  // };

  // const renderEvents = () => {
  //   const dayStart = new Date();
  //   dayStart.setHours(0, 0, 0, 0);
  //   const dayEnd = new Date();
  //   dayEnd.setHours(23, 59, 59, 999);
  
  //   const allDayEvents = events.filter((event) => {
  //     const start = new Date(event.start);
  //     const end = new Date(event.end);
  //     return start <= dayStart && end >= dayEnd;
  //   });
  
  //   const timedEvents = events.filter((event) => {
  //     const start = new Date(event.start);
  //     const end = new Date(event.end);
  //     return !(start <= dayStart && end >= dayEnd);
  //   });
  
  //   const allDayStackHeight = allDayEvents.length * ALL_DAY_EVENT_SINGLE_HEIGHT;
  
  //   const allDayEventComponents = allDayEvents.map((event, index) => {
  //     const top = index * ALL_DAY_EVENT_SINGLE_HEIGHT;
  //     const width = containerWidth;
  //     const fontSize = getFontSize(hourHeight, 11, 14);
  
  //     return (
  //       <Pressable
  //         key={`allday-${index}`}
  //         style={[
  //           styles.event,
  //           {
  //             top,
  //             height: ALL_DAY_EVENT_SINGLE_HEIGHT,
  //             left: 0,
  //             width,
  //             right: undefined,
  //           },
  //         ]}
  //         onPress={() => onEventPress(event)}
  //       >
  //         <View
  //           style={[styles.colorStrip, { backgroundColor: event.color || '#999' }]}
  //         />
  //         <View style={styles.eventContent}>
  //           <Text style={[styles.eventTitle, { fontSize }]} numberOfLines={1}>
  //             {event.title}
  //           </Text>
  //         </View>
  //       </Pressable>
  //     );
  //   });
  
  //   const sortedTimedEvents = [...timedEvents].sort(
  //     (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  //   );
  
  //   const groups: EventItem[][] = [];
  
  //   sortedTimedEvents.forEach((event) => {
  //     const eventStart = new Date(event.start).getTime();
  //     const eventEnd = new Date(event.end).getTime();
  
  //     let added = false;
  //     for (const group of groups) {
  //       if (
  //         group.some(
  //           (e) =>
  //             !(
  //               new Date(e.end).getTime() <= eventStart ||
  //               new Date(e.start).getTime() >= eventEnd
  //             )
  //         )
  //       ) {
  //         group.push(event);
  //         added = true;
  //         break;
  //       }
  //     }
  //     if (!added) {
  //       groups.push([event]);
  //     }
  //   });
  
  //   const timedEventComponents = sortedTimedEvents.map((event, index) => {
  //     const group = groups.find((g) => g.includes(event))!;
  //     const groupSize = group.length;
  //     const columnIndex = group.indexOf(event);
  
  //     const start = new Date(event.start);
  //     const end = new Date(event.end);
  
  //     const visibleStart = new Date(Math.max(start.getTime(), dayStart.getTime()));
  //     const visibleEnd = new Date(Math.min(end.getTime(), dayEnd.getTime()));
  
  //     const top =
  //       ((visibleStart.getHours() + visibleStart.getMinutes() / 60) * hourHeight) +
  //       allDayStackHeight +
  //       5;
  
  //     const durationHours =
  //       (visibleEnd.getTime() - visibleStart.getTime()) / (1000 * 60 * 60);
  //     const height = durationHours * hourHeight;
  
  //     const totalAvailableWidth = containerWidth - EVENT_LEFT_START - 10;
  //     const eventWidth = groupSize > 0 ? totalAvailableWidth / groupSize : totalAvailableWidth;
  //     const left = EVENT_LEFT_START + eventWidth * columnIndex;
  
  //     const fontSizeTitle = getFontSize(hourHeight, 11, 17);
  //     const fontSizeTime = getFontSize(hourHeight, 11, 17);
  
  //     return (
  //       <Pressable
  //         key={`timed-${index}`}
  //         style={[
  //           styles.event,
  //           {
  //             top,
  //             height,
  //             left,
  //             width: eventWidth,
  //             right: undefined,
  //           },
  //         ]}
  //         onPress={() => onEventPress(event)}
  //       >
  //         <View
  //           style={[styles.colorStrip, { backgroundColor: event.color || '#999' }]}
  //         />
  //         <View style={styles.eventContent}>
  //           <Text style={[styles.eventTitle, { fontSize: fontSizeTitle }]}>
  //             {event.title}
  //           </Text>
  //           {hourHeight >= SHOW_TIME_THRESHOLD && (
  //             <Text style={[styles.eventTime, { fontSize: fontSizeTime }]}>
  //               {`${start.getHours().toString().padStart(2, '0')}:${start.getMinutes()
  //                 .toString()
  //                 .padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end
  //                 .getMinutes()
  //                 .toString()
  //                 .padStart(2, '0')}`}
  //             </Text>
  //           )}
  //         </View>
  //       </Pressable>
  //     );
  //   });
  
  //   return [...allDayEventComponents, ...timedEventComponents];
  // };

  const renderEvents = () => {
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date();
    dayEnd.setHours(23, 59, 59, 999);
  
    const allDayEvents = events.filter((event) => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      return start <= dayStart && end >= dayEnd;
    });
  
    const timedEvents = events.filter((event) => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      return !(start <= dayStart && end >= dayEnd);
    });
  
    const allDayStackHeight = allDayEvents.length * ALL_DAY_EVENT_SINGLE_HEIGHT;
  
    const allDayEventComponents = allDayEvents.map((event, index) => {
      const top = index * ALL_DAY_EVENT_SINGLE_HEIGHT;
      const width = containerWidth;
      const fontSize = getFontSize(hourHeight, 11, 14);
  
      return (
        <Pressable
          key={`allday-${index}`}
          style={[
            styles.event,
            {
              top,
              height: ALL_DAY_EVENT_SINGLE_HEIGHT,
              left: 0,
              width,
              right: undefined,
            },
          ]}
          onPress={() => onEventPress(event)}
        >
          <View style={[styles.colorStrip, { backgroundColor: event.color || '#999' }]} />
          <View style={styles.eventContent}>
            <Text style={[styles.eventTitle, { fontSize }]} numberOfLines={1}>
              {event.title}
            </Text>
          </View>
        </Pressable>
      );
    });
  
    // Sort timed events by start time
    const sortedTimedEvents = [...timedEvents].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  
    // Build graph: for each event, track which other events it overlaps with
    const overlapGraph: Map<EventItem, EventItem[]> = new Map();
    sortedTimedEvents.forEach((e) => overlapGraph.set(e, []));
  
    for (let i = 0; i < sortedTimedEvents.length; i++) {
      const eventA = sortedTimedEvents[i];
      const startA = new Date(eventA.start).getTime();
      const endA = new Date(eventA.end).getTime();
  
      for (let j = i + 1; j < sortedTimedEvents.length; j++) {
        const eventB = sortedTimedEvents[j];
        const startB = new Date(eventB.start).getTime();
        const endB = new Date(eventB.end).getTime();
  
        // If events overlap
        if (!(endA <= startB || startA >= endB)) {
          overlapGraph.get(eventA)!.push(eventB);
          overlapGraph.get(eventB)!.push(eventA);
        }
      }
    }
  
    // Assign columns to events so no overlapping events share the same column
    // We'll use a greedy coloring algorithm where each column is a color
    const eventColumns = new Map<EventItem, number>();
    
    sortedTimedEvents.forEach((event) => {
      const usedColumns = new Set<number>();
      for (const neighbor of overlapGraph.get(event)!) {
        if (eventColumns.has(neighbor)) {
          usedColumns.add(eventColumns.get(neighbor)!);
        }
      }
  
      // Find the smallest column index not used by neighbors
      let col = 0;
      while (usedColumns.has(col)) {
        col++;
      }
      eventColumns.set(event, col);
    });
  
    // Calculate max columns needed in each connected cluster of overlapping events
    // We'll do a BFS to find clusters and max column count inside each cluster
    const visited = new Set<EventItem>();
    const eventClusterMaxCols = new Map<EventItem, number>();
  
    function bfsCluster(start: EventItem) {
      const queue = [start];
      const clusterEvents: EventItem[] = [];
      visited.add(start);
  
      while (queue.length > 0) {
        const ev = queue.shift()!;
        clusterEvents.push(ev);
        for (const neighbor of overlapGraph.get(ev)!) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
  
      // Determine max column in cluster
      let maxCol = 0;
      clusterEvents.forEach((ev) => {
        maxCol = Math.max(maxCol, eventColumns.get(ev)!);
      });
      maxCol += 1; // columns are 0-indexed
  
      // Assign maxCol info for all events in cluster
      clusterEvents.forEach((ev) => {
        eventClusterMaxCols.set(ev, maxCol);
      });
    }
  
    sortedTimedEvents.forEach((event) => {
      if (!visited.has(event)) bfsCluster(event);
    });
  
    // Render timed events with better column and width calculation
    const timedEventComponents = sortedTimedEvents.map((event, index) => {
      const start = new Date(event.start);
      const end = new Date(event.end);
  
      // Clamp event start/end to current day
      const visibleStart = new Date(Math.max(start.getTime(), dayStart.getTime()));
      const visibleEnd = new Date(Math.min(end.getTime(), dayEnd.getTime()));
  
      // Calculate vertical position and height
      const top = ((visibleStart.getHours() + visibleStart.getMinutes() / 60) * hourHeight) + allDayStackHeight + 5;
      const durationHours = (visibleEnd.getTime() - visibleStart.getTime()) / (1000 * 60 * 60);
      const height = durationHours * hourHeight;
  
      // Layout based on column assignments and cluster max columns
      const colIndex = eventColumns.get(event)!;
      const maxCols = eventClusterMaxCols.get(event)!;
  
      const totalAvailableWidth = containerWidth - EVENT_LEFT_START - 10;
      const eventWidth = totalAvailableWidth / maxCols;
      const left = EVENT_LEFT_START + colIndex * eventWidth;
  
      const fontSizeTitle = getFontSize(hourHeight, 11, 17);
      const fontSizeTime = getFontSize(hourHeight, 11, 17);
  
      return (
        <Pressable
          key={`timed-${index}`}
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
            <Text style={[styles.eventTitle, { fontSize: fontSizeTitle }]}>
              {event.title}
            </Text>
            {hourHeight >= SHOW_TIME_THRESHOLD && (
              <Text style={[styles.eventTime, { fontSize: fontSizeTime }]}>
                {`${start.getHours().toString().padStart(2, '0')}:${start.getMinutes()
                  .toString()
                  .padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')}`}
              </Text>
            )}
          </View>
        </Pressable>
      );
    });
  
    return [...allDayEventComponents, ...timedEventComponents];
  };
  
  
  const buildOverlappingGroups = (events: EventItem[]) => {
  const sorted = [...events].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  const groups: EventItem[][] = [];

  for (const event of sorted) {
    const start = new Date(event.start).getTime();
    const end = new Date(event.end).getTime();

    let placed = false;
    for (const group of groups) {
      // Check if event does NOT overlap with any events in group
      const overlaps = group.some((e) => {
        const eStart = new Date(e.start).getTime();
        const eEnd = new Date(e.end).getTime();
        return !(end <= eStart || start >= eEnd); // true if overlaps
      });

      if (!overlaps) {
        group.push(event);
        placed = true;
        break;
      }
    }

    if (!placed) {
      groups.push([event]);
    }
  }

  return groups;
};


  // Calculate all-day events total height for offsetting hours container and events
  const allDayEventsCount = events.filter((event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date();
    dayEnd.setHours(23, 59, 59, 999);
    return start <= dayStart && end >= dayEnd;
  }).length;

  const allDayStackHeight = allDayEventsCount * ALL_DAY_EVENT_SINGLE_HEIGHT;

  return (
    <PinchGestureHandler onGestureEvent={pinchHandler}>
      <Animated.View style={styles.container} onLayout={onLayout}>
        {/* Container height: all-day section + 24 hours * hourHeight */}
        <View style={{ height: allDayStackHeight + hourHeight * 24 }}>
          <View style={styles.hourContainer}>
            {/* Hour labels shifted down by all-day height */}
            {hours.map((hour, idx) => (
              <View
                key={idx}
                style={[styles.hourBlock, { height: hourHeight, top: allDayStackHeight + idx * hourHeight + 5 }]}
              >
                <Text style={styles.hourLabel}>{hour}</Text>
              </View>
            ))}

            {renderEvents()}
          </View>
        </View>
      </Animated.View>
    </PinchGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hourContainer: {
    position: 'relative',
    width: '100%',
  },
  hourBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: numbers.divider,
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
  hourLabel: {
    fontSize: 12,
    color: '#555',
    position: 'absolute',
    left: 5,
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
    backgroundColor: '#666',
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
  allDayContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: EVENT_LEFT_START + 5,
    zIndex: 10,
  },
  allDayText: {
    fontWeight: 'bold',
    color: '#222',
  },
});

const getDayStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const getDayEnd = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

// Updated check to see if event intersects the current day
const doesEventIntersectDay = (start: Date, end: Date, dayStart: Date, dayEnd: Date) =>
  end >= dayStart && start <= dayEnd;

// More robust check for all-day events
const isAllDayEvent = (start: Date, end: Date, dayStart: Date, dayEnd: Date) =>
  start <= dayStart && end >= dayEnd;
export default CalendarDayView;
