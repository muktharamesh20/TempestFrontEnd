import { images } from '@/constants/images';
import { differenceInCalendarWeeks, eachDayOfInterval, endOfMonth, format, getDay, isBefore, isSameDay, startOfMonth, subMonths } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

interface HabitProgressCalendarProps {
  title: string;
  startDate: Date;
  endDate: Date;
  frequency: 'daily' | 'weekly' | 'biweekly';
  days?: number[]; // 0-6 (Sun-Sat)
  completionImages: Record<string, string>; // 'yyyy-MM-dd': imageUrl
}

const getFrequencyLabel = (frequency: string, days?: number[]) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (frequency === 'daily') return 'Every Day';
  if (frequency === 'weekly') return `Weekly on ${days?.map(d => dayNames[d]).join(', ')}`;
  if (frequency === 'biweekly') return `Every Other Week on ${days?.map(d => dayNames[d]).join(', ')}`;
  return '';
};
const { width: screenWidth } = useWindowDimensions();
const calendarPadding = 16 * 2; // same as your container padding
const spacing = 6 * 2; // 6 gaps between 7 cells, each 2px
const availableWidth = screenWidth - calendarPadding - spacing;
const cellSize = Math.floor(availableWidth / 7);
const HabitProgressCalendar = () => {


  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [visibleMonthCount, setVisibleMonthCount] = useState(3);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const { height: windowHeight } = useWindowDimensions();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');
  useEffect(() => {
    if (!isLoadingMore) return;
  
    const interval = setInterval(() => {
      setLoadingDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400); // Animation speed
  
    return () => clearInterval(interval);
  }, [isLoadingMore]);

  const shouldDoHabit = (date: Date) => {
    if (isBefore(date, startDate) || isBefore(endDate, date)) return false;
  
    const weekday = getDay(date);
  
    if (frequency === 'daily') return true;
    if (frequency === 'weekly') return days.includes(weekday);
  
    if (frequency === 'biweekly') {
      const weeksBetween = differenceInCalendarWeeks(date, startDate);
      return weeksBetween % 2 === 0 && days.includes(weekday);
    }
  
    return false;
  };
  

  const months: { label: string; dates: Date[] }[] = [];

  const { endDate, startDate, frequency, days = [], title, completionImages } = example2;


  const now = new Date();
  const start = startOfMonth(startDate);
  const lastVisibleMonth = isBefore(endDate, now) ? endOfMonth(endDate) : endOfMonth(now);
  
  let current = lastVisibleMonth;
  
  while (isBefore(start, current) || isSameDay(start, current)) {
    const monthStart = startOfMonth(current);
    const monthEnd = endOfMonth(current);
  
    // Clamp the visible range of this month to the startDate and current date
    const clippedStart = isBefore(startDate, monthStart) ? monthStart : startDate;
    const clippedEnd = [endDate, now, monthEnd].sort((a, b) => +a - +b)[0];
  
    // Skip if no visible dates in this month
    if (isBefore(clippedEnd, clippedStart)) {
      current = subMonths(current, 1);
      continue;
    }
  
    const visibleDates = eachDayOfInterval({
      start: clippedStart,
      end: clippedEnd,
    });
  
    const hasActiveDays = visibleDates.some(date => {
        const isInRange = !isBefore(date, startDate) && !isBefore(endDate, date);
        return isInRange && shouldDoHabit(date);
      });
    
      if (hasActiveDays) {
        months.push({
          label: format(current, 'MMMM yyyy'),
          dates: visibleDates,
        });
      }
  
    current = subMonths(current, 1);
  }
  
  


  const visibleMonths = months.slice(0, visibleMonthCount);

  const handleScroll = async (event: any) => {
    const { contentOffset } = event.nativeEvent;
    setScrollY(contentOffset.y);
  
    const nearBottom = contentOffset.y + windowHeight >= contentHeight - 100;
    if (nearBottom && visibleMonthCount < months.length && !isLoadingMore) {
      setIsLoadingMore(true);
  
      // 👇 Artificial delay to see pagination – delete this later
      await new Promise(res => setTimeout(res, 500));
  
      setVisibleMonthCount(prev => prev + 1);
      setIsLoadingMore(false);
      setLoadingDots('');
    }
  };
  





  return (
    <ScrollView
      ref={scrollRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      onContentSizeChange={(_, height) => setContentHeight(height)}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{getFrequencyLabel(frequency, days)}</Text>

      {visibleMonths.map((month, i) => (
        <View key={i} style={styles.monthContainer}>
          <Text style={styles.monthLabel}>{month.label}</Text>
          <View style={styles.weekRow}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <Text key={d} style={styles.dayHeader}>{d}</Text>
            ))}
          </View>
          <View style={styles.grid}>
  {(() => {
    const cells = [];
    const firstDate = startOfMonth(month.dates[0]); // use month start
    const weekdayOffset = getDay(firstDate); // 0=Sun ... 6=Sat
  
    // Add leading blank cells
    for (let i = 0; i < weekdayOffset; i++) {
      cells.push(<View key={`blank-${i}`} style={styles.dayCell} />);
    }
  
    for (let j = 0; j < month.dates.length; j++) {
      const date = month.dates[j];
      const dateStr = format(date, 'yyyy-MM-dd');
      const isInRange = !isBefore(date, startDate) && !isBefore(endDate, date);
      const isDue = isInRange && shouldDoHabit(date);
      const img = isInRange ? completionImages[dateStr] : undefined;
  
      cells.push(
        <View key={dateStr} style={styles.dayCell}>
          {img ? (
            <Image source={{ uri: img }} style={styles.image} />
          ) : (
            <View
              style={[
                styles.rect,
                isInRange ? (isDue ? styles.blue : styles.grey) : { backgroundColor: '#f0f0f0' },
              ]}
            />
          )}
        </View>
      );
    }
  
    return cells;
  })()}
  
        

          </View>
        </View>
      ))}
      <View className='flex flex-row items-start justify-center w-full'>
            {isLoadingMore && (
            <Text style={styles.loadingText}>Loading{loadingDots}</Text>
            )}
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  backButton: {
    marginBottom: 12,
  },
  backText: {
    fontSize: 16,
    color: '#007bff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
  },
  monthContainer: {
    marginBottom: 24,
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dayHeader: {
    width: 40,
    textAlign: 'center',
    fontWeight: '600',
    color: '#888',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: cellSize,
    height: 50,
    marginRight: 2,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  rect: {
    width: '90%',
    height: '90%',
    borderRadius: 12,
  },
  
  blue: {
    backgroundColor: '#007bff',
  },
  grey: {
    backgroundColor: '#ddd',
  },
  image: {
    width: 38,
    height: 48,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#007bff',
    marginTop: 10,
  },
  
});

export default HabitProgressCalendar;

//Example usage:
const example2: HabitProgressCalendarProps = {
  title: "Watch the ducks",
  startDate: new Date('2025-02-01'),
  endDate: new Date('2025-12-31'),
  frequency: "weekly",
  days: [1, 2, 3, 4, 5],
  completionImages: {
    '2025-02-05': 'https://example.com/duck1.jpg',
    '2025-03-04': 'https://example.com/duck2.jpg',
    '2025-03-06': 'https://example.com/duck3.jpg',
  }
};

const example: HabitProgressCalendarProps = {
  title: "Watch the ducks",
  startDate: new Date('2025-02-01'),
  endDate: new Date('2025-03-31'),
  frequency: "weekly",
  days: [1, 2, 3, 4, 5],
  completionImages: {
    '2025-02-01': images.googleLogo,
    '2025-02-02': images.googleLogo,
    '2025-03-01': images.googleLogo
  },
};
