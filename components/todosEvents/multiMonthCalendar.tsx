import { EventDetailsForNow } from '@/services/utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from 'react-native';
import CalendarMonthView from './calendarMonthView';

interface MultiMonthViewProps {
    events: EventDetailsForNow[];
    onEventPress: (
        event: EventDetailsForNow
    ) => void;
    initialMonth?: number; // 0-based
    initialYear?: number;
    setView: (view: "day" | "week" | "month") => void;
    focusedDay: Date;
    setViewingDateFunc: (date: Date) => void;
    setFocusedDay: React.Dispatch<React.SetStateAction<Date>>
}

const screenWidth = Dimensions.get('window').width;

const addMonth = (year: number, month: number, offset: number): { year: number; month: number } => {
    const newDate = new Date(year, month + offset, 1);
    return { year: newDate.getFullYear(), month: newDate.getMonth() };
};

const MultiMonthView: React.FC<MultiMonthViewProps> = ({
    events,
    onEventPress,
    initialMonth,
    initialYear,
    setView,
    focusedDay,
    setFocusedDay,
    setViewingDateFunc
}) => {
    const today = new Date();
    const initial = {
        year: initialYear ?? today.getFullYear(),
        month: initialMonth ?? today.getMonth(),
    };

    const scrollRef = useRef<ScrollView>(null);
    const [centerDate, setCenterDate] = useState(initial);

    const scrollToCenter = useCallback(() => {
        scrollRef.current?.scrollTo({ x: screenWidth, animated: false });
    }, []);

    useEffect(() => {
        scrollToCenter();
    }, []);

    useEffect(() => {
        if (focusedDay.getFullYear() !== centerDate.year || focusedDay.getMonth() !== centerDate.month) {
            setCenterDate({ year: focusedDay.getFullYear(), month: focusedDay.getMonth() })
            //console.log(centerDate)
            //scrollToCenter()
        }
    }, [focusedDay])

    useEffect(() => {
        if (focusedDay.getFullYear() !== centerDate.year || focusedDay.getMonth() !== centerDate.month) {
            const newCenter = new Date(`${centerDate.year}-${centerDate.month + 1}-02`);
            console.log(newCenter, centerDate.year, centerDate.month + 1)
            setFocusedDay(newCenter);
        }
    }, [centerDate])

    const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        const direction = offsetX > screenWidth ? 1 : offsetX < screenWidth ? -1 : 0;

        if (direction !== 0) {
            setCenterDate(prev => addMonth(prev.year, prev.month, direction));
            scrollToCenter(); // reset to center for smooth paging
        }
    };

    const prev = addMonth(centerDate.year, centerDate.month, -1);
    const next = addMonth(centerDate.year, centerDate.month, 1);

    return (
        <ScrollView
            horizontal
            pagingEnabled
            ref={scrollRef}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScrollEnd}
            scrollEventThrottle={16}
        >
            {[prev, centerDate, next].map((date, idx) => (
                <View key={idx} style={{ width: screenWidth }}>
                    <CalendarMonthView
                        year={date.year}
                        month={date.month}
                        events={events}
                        onEventPress={onEventPress}
                        setView={setView}
                        setViewingDateFunc={setViewingDateFunc}
                    />
                </View>
            ))}
        </ScrollView>
    );
};

export default MultiMonthView;
