import { drawerProps } from '@/components/CalendarDrawer';
import DayCalendar from '@/components/DayCalendar';
import MonthCalendar from '@/components/MonthCalendar';
import WeekCalendar from '@/components/WeekCalendar';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

const calendar = () => {
  const categoriesShown: drawerProps[] = 
    [{isPublic: true, categoryId: 'blahblah', categoryName: 'blah', categoryColor: 'green'}
    , {isPublic: false, categoryId: 'blahblah2', categoryName: 'blah2', categoryColor: 'blue'}
    , {isPublic: true, categoryId: 'blahblah3', categoryName: 'blah3aaaaaaaaaaaaaaaaaaaaaaa aaaaa aaaaaaaaaaaaaaaaaaaa', categoryColor: '#000000'},
    {isPublic: false, categoryId: 'blahblah4', categoryName: 'blah4', categoryColor: 'red'}
    ];
  const isFocused = useIsFocused();
  const [date, setDate] = React.useState<Date>(new Date());
  const [categories, setCategories] = React.useState<drawerProps[]>(categoriesShown);
  const [view, setView] = React.useState<'day' | 'week' | 'month'>('day');
  useEffect(() => {console.log(date.toDateString())}, [date]);

  const handleTogglePublic = (categoryId: string, newValue: boolean) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.categoryId === categoryId ? { ...cat, isPublic: newValue } : cat
      )
    );
  };

  const INITIAL_HEIGHT = 60;

  const [hourHeight, setHourHeight] = useState<number>(INITIAL_HEIGHT);

  
  return (
    <View className="flex flex-col flex-1 gap-0 bg-primary h-full w-full">
    {view === 'day' && (
      <>
        {isFocused ? <StatusBar style="light" /> : null}
        <DayCalendar viewingDate={date} setViewingDateFunc={setDate} categories={categories} handleCategoryToggle={handleTogglePublic} setView={setView} hourHeight={hourHeight} setHourHeight={setHourHeight} />
      </>
    )}
    {view === 'week' && (
      <>
        {isFocused ? <StatusBar style="light" /> : null}
        <WeekCalendar viewingDate={date} setViewingDateFunc={setDate} categories={categories} handleCategoryToggle={handleTogglePublic} setView={setView} hourHeight={hourHeight} setHourHeight={setHourHeight}/>
      </>
    )}
    {view === 'month' && (
      <>
        {isFocused ? <StatusBar style="light" /> : null}
        <MonthCalendar viewingDate={date} setViewingDateFunc={setDate} categories={categories} handleCategoryToggle={handleTogglePublic} setView={setView} />
      </>
    )}
    </View>
  );
}

export default calendar