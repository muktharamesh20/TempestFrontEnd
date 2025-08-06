import ProgressHeader from '@/components/ProgressHeader';
import { images } from '@/constants/images';
import { numbers } from '@/constants/numbers';
import { useIsFocused } from '@react-navigation/native';
import { differenceInCalendarWeeks, eachDayOfInterval, endOfMonth, format, getDay, isBefore, isSameDay, startOfMonth, subMonths } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


interface HabitProgressCalendarProps {
  title: string;
  startDate: Date;
  endDate: Date;
  frequency: 'daily' | 'weekly' | 'biweekly';
  days?: number[]; // 0-6 (Sun-Sat)
  completionImages: Record<string, string>; // 'yyyy-MM-dd': imageUrl
}

//let paddingBottom = 200; // Adjust based on your bottom navigation height

const getFrequencyLabel = (frequency: 'daily' | 'weekly' | 'biweekly', days?: number[]) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (frequency === 'daily') return 'Every Day';
  if (frequency === 'weekly') return `Weekly on ${days?.map(d => dayNames[d]).join(', ')}`;
  if (frequency === 'biweekly') return `Every Other Week on ${days?.map(d => dayNames[d]).join(', ')}`;
  return '';
};
const { width: screenWidth } = useWindowDimensions();
//paddingBottom = 100 + insets.bottom;
const calendarPadding = 16 * 2; // same as container padding
const totalGaps = 6;
const availableWidth = screenWidth - calendarPadding;
const gapSize = Math.floor(availableWidth * 0.01); // e.g., 1% of available width
const totalGapWidth = gapSize * totalGaps;
const cellSize = Math.floor((availableWidth - totalGapWidth) / 7);

const totalCells = 7;
const horizontalGap = (availableWidth - cellSize * totalCells) / totalGaps;

const dayCellHeight = 60;
const dayCellInnerWidth = Math.floor(cellSize * 0.9); // 90% of width like before
const HabitProgressCalendar = () => {

  const insets = useSafeAreaInsets();
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

  //utility functions
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

const getStreakStats = (dates: Date[]) => {
    const sortedDates = dates
      .filter(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return shouldDoHabit(date);
      })
      .sort((a, b) => a.getTime() - b.getTime());
  
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
  
    for (let i = 0; i < sortedDates.length; i++) {
      const date = sortedDates[i];
      const dateStr = format(date, 'yyyy-MM-dd');
      const completed = !!completionImages[dateStr];
  
      if (completed) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }
  
    // Calculate current streak by going backwards
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const date = sortedDates[i];
      const dateStr = format(date, 'yyyy-MM-dd');
      if (completionImages[dateStr]) {
        currentStreak++;
      } else {
        break;
      }
    }
  
    return { currentStreak, longestStreak };
  };
  
  const getCompletionStats = (dates: Date[]) => {
    let total = 0;
    let completed = 0;
  
    dates.forEach(date => {
      if (shouldDoHabit(date)) {
        total++;
        if (completionImages[format(date, 'yyyy-MM-dd')]) {
          completed++;
        }
      }
    });
  
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  

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
      //await new Promise(res => setTimeout(res, 500));
  
      setVisibleMonthCount(prev => prev + 1);
      setIsLoadingMore(false);
      setLoadingDots('');
    }
  };
  


  const allDates: Date[] = [];

  months.forEach(month => {
    allDates.push(...month.dates);
  });
  const { currentStreak, longestStreak } = getStreakStats(allDates);
  const { completed, total, percentage } = getCompletionStats(allDates);

  
  const isFocused = useIsFocused();

  return (
    <View style={{ flex: 1, backgroundColor: numbers.primaryColor }}>
    <ProgressHeader title={title} frequencey={getFrequencyLabel(frequency, days)} />
    {isFocused && <StatusBar style="dark" />}

    <ScrollView
  ref={scrollRef}
  onScroll={handleScroll}
  scrollEventThrottle={16}
  onContentSizeChange={(_, height) => setContentHeight(height)}
  contentContainerStyle={{
    ...styles.container,
    paddingBottom: insets.bottom + 30,
    backgroundColor: numbers.primaryColor,
  }}
//   stickyHeaderIndices={[0]} // <-- makes the first child sticky
>
  {/* Sticky Header
  <View style={styles.stickyStatsContainer}>
    <View style={styles.statsRow}>
      <View style={styles.statsLeft}>
        <Text style={styles.statsText}>Current Streak: {currentStreak} 🔥</Text>
        <Text style={styles.statsText}>Longest Streak: {longestStreak} 🏆</Text>
      </View>
      <View style={styles.statsRight}>
        <Text style={styles.statsText}>
          Completion: {percentage}% ({completed}/{total})
        </Text>
      </View>
    </View>
    <View style={styles.divider} />
  </View> */}



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
    const firstDate = startOfMonth(month.dates[0]);
    const weekdayOffset = getDay(firstDate);
    const allDates: (Date | null)[] = Array(weekdayOffset).fill(null).concat(month.dates);

    // Pad to full weeks (multiples of 7)
    while (allDates.length % 7 !== 0) {
      allDates.push(null);
    }

    for (let i = 0; i < allDates.length; i += 7) {
      const week = allDates.slice(i, i + 7);
      cells.push(
        <View key={`week-${i}`} style={styles.gridRow}>
          {week.map((date, j) => {
            if (!date) {
              return <View key={`blank-${i}-${j}`} style={styles.dayCell} />;
            }

            const dateStr = format(date, 'yyyy-MM-dd');
            const isInRange = !isBefore(date, startDate) && !isBefore(endDate, date);
            const isDue = isInRange && shouldDoHabit(date);
            const img = isInRange ? completionImages[dateStr] : undefined;

            return (
              <View key={dateStr} style={styles.dayCell}>
                {img ? (
                  <Image source={{ uri: img }} style={styles.image} />
                ) : (
                    isDue ? (
                        <LinearGradient
                    colors={['#4facfe', '#0A1929']} // your diagonal gradient colors
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cellGradient}
                    >
                    <View style={styles.cellInnerBlue} />
                    </LinearGradient>

                      ) : (
                        <View
                          style={[
                            styles.rect,
                            isInRange ? styles.grey : { backgroundColor: '#f0f0f0' },
                          ]}
                        />
                      )
                      
                )}
              </View>
            );
          })}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
    width: cellSize,
    textAlign: 'center',
    fontWeight: '600',
    color: '#888',
  },
  grid: {
    gap: 4,
  },
  dayCell: {
    width: cellSize,
    height: dayCellHeight,
    marginTop: horizontalGap/2,
    //marginBottom: horizontalGap/2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  rect: {
    width: '90%',
    height: '100%',
    borderRadius: 12,
  },

  grey: {
    backgroundColor: 'black',
    opacity: 0.09
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  
  image: {
    width: '90%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: numbers.secondaryColor
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#007bff',
    marginTop: 10,
  },statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  statsLeft: {
    flex: 1,
  },
  statsRight: {
    alignItems: 'flex-end',
  },
  statsText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
    fontWeight: '500',
  },stickyStatsContainer: {
    backgroundColor: numbers.primaryColor,
    zIndex: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 8,
  },imageBorder: {
    width: '90%',
    height: '100%',
    padding: 2, // adjust based on your border image
    borderRadius: 12,
  },
  innerRect: {
    flex: 1,
    backgroundColor: '#3898F3', // solid fill inside border
    borderRadius: 10,
    opacity: 0.0
  },  cellBorderImage: {
    width: dayCellInnerWidth,
    height: dayCellHeight,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2.5,
    borderRadius: 12,
    alignSelf: 'center', // <-- centers inside dayCell
  },

  borderImageStyle: {
    borderRadius: 12,
    resizeMode: 'stretch',
  },

  cellInnerBlue: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D2E5F5',
    borderRadius: 9,
  },cellGradient: {
    width: cellSize * 0.9,
    height: 60,
    borderRadius: 12,
    padding: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  
  
  
  
  
  
});

export default HabitProgressCalendar;

//Example usage:
const example2: HabitProgressCalendarProps = {
  title: "Watch the ducks",
  startDate: new Date('2025-02-01'),
  endDate: new Date('2025-12-31'),
  frequency: "weekly",
  days: [1, 2, 5, 4, 3],
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
  frequency: "daily",
  days: [1, 2, 4, 0],
  completionImages: {
    '2025-02-01': images.googleLogo,
    '2025-02-02': images.googleLogo,
    '2025-03-01': images.googleLogo
  },
};
