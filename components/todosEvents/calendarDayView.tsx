import { numbers } from '@/constants/numbers';
import { EventDetailsForNow } from '@/services/utils';
import React, { useEffect, useState } from 'react';
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
import { generateOccurrences } from './calendarWeekView';


interface CalendarDayViewProps {
  events: EventDetailsForNow[];
  onEventPress: (event: EventDetailsForNow) => void;
  day: Date;
  hourHeight: number
  setHourHeight:React.Dispatch<React.SetStateAction<number>>
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
  day,
  hourHeight,
  setHourHeight
}) => {
  const baseHeight = useSharedValue(INITIAL_HEIGHT);
  const [currentTime, setCurrentTime] = useState(new Date());

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(new Date());
  }, 120 * 1000); // update every 2 minutes

  return () => clearInterval(interval);
}, []);

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

  const renderEvents = (numEv: number, setNumSt: React.Dispatch<React.SetStateAction<number>>) => {
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    // // const mapRecurringEventsToSingularEvent = (event: EventDetailsForNow) => {
    // //   const results = []
    // //   if (event.repeat_schedule === 'daily') {
    // //     if(event.start <= dayEnd && event.end >= dayStart){

    // //     }
    // //   }
    // // } 

    // function buildInstance(
    //   tpl: EventDetailsForNow,
    //   dayStart: Date,                 // the 00:00 of the day we’re rendering
    // ): EventDetailsForNow {
    //   const origStart = new Date(tpl.start);
    //   const duration  = new Date(tpl.end).getTime() - origStart.getTime();
    
    //   // newStart = dayStart + hh:mm:ss of original start
    //   const newStart = new Date(dayStart);
    //   newStart.setHours(
    //     origStart.getHours(),
    //     origStart.getMinutes(),
    //     origStart.getSeconds(),
    //     origStart.getMilliseconds()
    //   );
    
    //   const newEnd = new Date(newStart.getTime() + duration);
    
    //   // Return a shallow copy so the template isn’t mutated
    //   return { ...tpl, start: newStart, end: newEnd };
    // }

    // const eventsForTheDay = events.filter(event => {
    //  occursToday(event, dayStart, dayEnd)
    // }).map(event => buildInstance(event, dayStart));
    
  
    // const allDayEvents = eventsForTheDay.filter(event => {
    //   if(event.repeat_schedule === 'none'){
    //     const start = new Date(event.start);
    //     const end = new Date(event.end);
    //     return start <= dayStart && end >= dayEnd;
    //   }
    // });
    
  
    // const timedEvents = eventsForTheDay.filter(event => {
    //   if(event.repeat_schedule === 'none'){
    //     const start = new Date(event.start);
    //     const end = new Date(event.end);
    //     return !(start <= dayStart && end >= dayEnd);
    //   }
    // });

    /* ─── helpers ─────────────────────────────────────────────────────────── */

    function makeInstance(
      tpl: EventDetailsForNow,
      startDate: Date,
      durationMs: number
    ): EventDetailsForNow {
      const newStart = new Date(startDate);
      const newEnd = new Date(startDate.getTime() + durationMs);
    
      return {
        ...tpl,
        start: newStart,
        end: newEnd,
        // Optionally: mark it as an instance if needed
        // instanceOf: tpl.id ?? undefined,
      };
    }
    /* ─── helper: copy the HH:MM:SS(.ms) from a source date ─── */
function copyTimeOfDay(from: Date, to: Date) {
  to.setHours(
    from.getHours(),
    from.getMinutes(),
    from.getSeconds(),
    from.getMilliseconds()
  );
}

    

function instancesToday(
  tpl: EventDetailsForNow,
  dayStart: Date,
  dayEnd: Date,
): EventDetailsForNow[] {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const tplStart = new Date(tpl.start);
  const tplEnd = new Date(tpl.end);
  const duration = tplEnd.getTime() - tplStart.getTime();
  const repeatEnd = tpl.repeat_schedule === 'none'
    ? tplEnd
    : new Date(tpl.end_repeat);

  /* ---------- ONE-OFF ------------------------------------------------- */
  // if (tpl.repeat_schedule === 'none') {
    return tplEnd >= dayStart && tplStart <= dayEnd ? [tpl] : [];
  // }

  // /* ---------- define recurrence parameters --------------------------- */
  // let freqDays = 1;
  // if (tpl.repeat_schedule === 'weekly') freqDays = 7;
  // if (tpl.repeat_schedule === 'biweekly') freqDays = 14;

  // const out: EventDetailsForNow[] = [];

  // if (tpl.repeat_schedule === 'monthly') {
  //   // For monthly, iterate over months from tplStart up to dayEnd or repeatEnd
  //   let current = new Date(tplStart);
  //   current.setHours(0, 0, 0, 0);

  //   // We'll loop months forward until past dayEnd or repeatEnd
  //   while (current <= dayEnd && current <= repeatEnd) {
  //     // Construct occurrence date by setting date to the original day of month
  //     const occStart = new Date(current);
  //     const dayOfMonth = tplStart.getDate();

  //     // Set the day, but clamp if the month has fewer days (e.g., Feb 30)
  //     const maxDay = new Date(occStart.getFullYear(), occStart.getMonth() + 1, 0).getDate();
  //     occStart.setDate(dayOfMonth > maxDay ? maxDay : dayOfMonth);

  //     copyTimeOfDay(tplStart, occStart);
  //     const occEnd = new Date(occStart.getTime() + duration);

  //     // Check if occurrence overlaps the day range
  //     if (occEnd >= dayStart && occStart <= dayEnd && occStart <= repeatEnd) {
  //       out.push(makeInstance(tpl, occStart, duration));
  //     }

  //     // Move to next month
  //     current.setMonth(current.getMonth() + 1);
  //   }
  // } else {
  //   // daily, weekly, biweekly logic (existing)
  //   const freqMs = freqDays * DAY_MS;
  //   const firstPossibleStart = tplStart;
  //   const lastPossibleStart = new Date(Math.min(repeatEnd.getTime(), dayEnd.getTime()));
  //   const nMax = Math.floor(
  //     (lastPossibleStart.getTime() - firstPossibleStart.getTime()) / freqMs
  //   );

  //   for (let n = nMax; n >= 0; n--) {
  //     const baseWeekStart = new Date(firstPossibleStart.getTime() + n * freqMs);
  //     baseWeekStart.setHours(0, 0, 0, 0);

  //     if (tpl.repeat_schedule === 'daily') {
  //       const occStart = new Date(baseWeekStart);
  //       copyTimeOfDay(tplStart, occStart);
  //       const occEnd = new Date(occStart.getTime() + duration);

  //       if (occEnd < dayStart || occStart > dayEnd || occStart > repeatEnd) continue;

  //       out.push(makeInstance(tpl, occStart, duration));
  //     } else {
  //       // weekly or biweekly
  //       for (const weekday of tpl.days) {
  //         const occStart = new Date(baseWeekStart);
  //         copyTimeOfDay(tplStart, occStart);
  //         occStart.setDate(occStart.getDate() + ((weekday - occStart.getDay() + 7) % 7));
  //         const occEnd = new Date(occStart.getTime() + duration);

  //         if (occEnd < dayStart || occStart > dayEnd || occStart > repeatEnd) continue;

  //         out.push(makeInstance(tpl, occStart, duration));
  //       }
  //     }
  //   }
  //   }

  // return out;
}

    const todaysEvents: EventDetailsForNow[] = [];
    
    events.flatMap((event) => generateOccurrences(event, dayStart, dayEnd)).forEach((tpl) => {
      todaysEvents.push(
        ...instancesToday(tpl, dayStart, dayEnd)
      );
    });
    
    /* ─── split into all-day vs timed ────────────────────────────────────── */
    
    
    const allDayEvents = todaysEvents.filter((ev) => {
      const s = new Date(ev.start);
      const e = new Date(ev.end);
      return s <= dayStart && e >= dayEnd;          // spans 00–24 entirely
    });
    
    const timedEvents = todaysEvents.filter((ev) => !allDayEvents.includes(ev));
    
  
    const allDayStackHeight = allDayEvents.length * ALL_DAY_EVENT_SINGLE_HEIGHT;
    if (allDayEvents.length !== numEv){
      setNumSt(allDayEvents.length);
    }
    
  
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
    const overlapGraph: Map<EventDetailsForNow, EventDetailsForNow[]> = new Map();
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
    const eventColumns = new Map<EventDetailsForNow, number>();
    
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
    const visited = new Set<EventDetailsForNow>();
    const eventClusterMaxCols = new Map<EventDetailsForNow, number>();
  
    function bfsCluster(start: EventDetailsForNow) {
      const queue = [start];
      const clusterEvents: EventDetailsForNow[] = [];
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
  console.log(allDayEventsCount)

  const[numEvents, setNumStack] = useState(0);

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
                style={[styles.hourBlock, { height: hourHeight, top: numEvents * ALL_DAY_EVENT_SINGLE_HEIGHT + idx * hourHeight + 5  }]}
              >
                <Text style={styles.hourLabel}>{hour}</Text>
              </View>
            ))}

            {/*timeLabel*/}
            <View onLayout={onLayout} style={{ flex: 1 }}>
              {renderCurrentTimeLine({extraMargin: (numEvents * ALL_DAY_EVENT_SINGLE_HEIGHT + 5)})}
              {renderEvents(numEvents, setNumStack)}
            </View>

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
    borderTopWidth: 1,
    borderColor: numbers.divider,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: EVENT_LEFT_START + 5,
    zIndex: 10,
  },
  allDayText: {
    fontWeight: 'bold',
    color: '#222',
  },currentTimeLine: {
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

function isAllDay(ev: EventDetailsForNow): boolean {
  const start = new Date(ev.start);
  const end = new Date(ev.end);

  // Detect if event starts at 00:00 and ends at 23:59 (typical all-day span)
  return (
    start.getHours() === 0 &&
    start.getMinutes() === 0 &&
    start.getSeconds() === 0 &&
    end.getHours() === 23 &&
    end.getMinutes() === 59
  );
}

// Example usage in your code



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


