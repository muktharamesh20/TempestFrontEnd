import { drawerProps } from '@/components/CalendarDrawer';
import DayCalendar from '@/components/DayCalendar';
import MonthCalendar from '@/components/MonthCalendar';
import WeekCalendar from '@/components/WeekCalendar';
import { EventDetailsForNow } from '@/services/utils';
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
        <DayCalendar events={sampleEvents} viewingDate={date} setViewingDateFunc={setDate} categories={categories} handleCategoryToggle={handleTogglePublic} setView={setView} hourHeight={hourHeight} setHourHeight={setHourHeight} />
      </>
    )}
    {view === 'week' && (
      <>
        {isFocused ? <StatusBar style="light" /> : null}
        <WeekCalendar events={sampleEvents} viewingDate={date} setViewingDateFunc={setDate} categories={categories} handleCategoryToggle={handleTogglePublic} setView={setView} hourHeight={hourHeight} setHourHeight={setHourHeight}/>
      </>
    )}
    {view === 'month' && (
      <>
        {isFocused ? <StatusBar style="light" /> : null}
        <MonthCalendar events={sampleEvents} viewingDate={date} setViewingDateFunc={setDate} categories={categories} handleCategoryToggle={handleTogglePublic} setView={setView} />
      </>
    )}
    </View>
  );
}

export default calendar



const sampleEvents: EventDetailsForNow[] = [
  {
    title: 'Morning Run',
    start: new Date('2025-06-24T06:00:00'),
    end: new Date('2025-06-24T07:00:00'),
    color: '#4CAF50',
    end_repeat: new Date('2025-08-24T023:59:59'),
    repeat_schedule: 'none', 
    days: []
  },
  {
    title: 'Team Stand-up Meeting',
    start: new Date('2025-06-24T09:15:00'),
    end: new Date('2025-06-24T09:30:00'),
    color: '#2196F3',
    end_repeat: new Date('2025-06-24T09:30:00'),
    repeat_schedule: 'none', 
    days: []
  },
  {
    title: 'Morning Run',
    start: new Date('2025-06-24T06:00:00'),
    end: new Date('2025-06-24T07:00:00'),
    color: '#4CAF50',
    end_repeat: new Date('2025-06-24T07:00:00'),
    repeat_schedule: 'none', 
    days: []
  },
  {
    title: 'Team Stand-up Meeting',
    start: new Date('2025-06-24T09:00:00'),
    end: new Date('2025-06-24T09:30:00'),
    color: '#2196F3',
    end_repeat: new Date('2025-06-24T09:30:00'),
    repeat_schedule: 'none', 
    days: []
  },
  {
    title: 'Morning Run',
    start: new Date('2025-06-24T06:00:00'),
    end: new Date('2025-06-24T07:00:00'),
    color: '#4CAF50',
    end_repeat: new Date('2025-06-24T07:00:00'),
    repeat_schedule: 'none', 
    days: []
  },
  {
    title: 'Team Stand-up Meeting',
    start: new Date('2025-06-24T09:20:00'),
    end: new Date('2025-06-24T09:35:00'),
    color: '#2196F3',
    end_repeat: new Date('2025-06-24T09:35:00'),
    repeat_schedule: 'none', 
    days: []
  },
  {
    title: 'Work Session: UI Design',
    start: new Date('2025-06-24T10:00:00'),
    end: new Date('2025-06-24T12:00:00'),
    color: '#FFC107',
    end_repeat: new Date('2025-06-24T12:00:00'),
    repeat_schedule: 'none', 
    days: []
  },
  {
    title: 'Lunch with Sarah',
    start: new Date('2025-06-24T12:30:00'),
    end: new Date('2025-06-24T13:30:00'),
    color: '#FF5722',
    end_repeat: new Date('2025-06-24T13:30:00'),
    repeat_schedule: 'none', 
    days: []
  },
  {
    title: 'Doctor Appointment',
    start: new Date('2025-06-24T15:00:00'),
    end: new Date('2025-06-24T15:45:00'),
    color: '#9C27B0',
    end_repeat: new Date('2025-06-24T15:45:00'),
    repeat_schedule: 'none', 
    days: []
  },
  {
    title: 'Project Review Call',
    start: new Date('2025-06-24T16:00:00'),
    end: new Date('2025-06-24T17:00:00'),
    color: '#3F51B5',
    end_repeat: new Date('2025-06-24T17:00:00'),
    repeat_schedule: 'none', 
    days: []
  },
{
    title: 'Morning Workout',
    start: new Date('2025-06-23T06:30:00'),
    end: new Date('2025-06-23T07:30:00'),
    color: '#4CAF50',
    end_repeat: new Date('2025-06-23T07:30:00'),
    repeat_schedule: 'none', 
    days: []
  },
  {
    title: 'Team Standup',
    start: new Date('2025-06-24T09:00:00'),
    end: new Date('2025-06-24T09:30:00'),
    color: '#2196F3',
    end_repeat: new Date('2025-06-24T09:30:00'),
    repeat_schedule: 'none', 
    days: []
  },
  {
    title: 'Lunch with Alex',
    start: new Date('2025-06-25T12:00:00'),
    end: new Date('2025-06-25T13:00:00'),
    color: '#FFC107',
    end_repeat: new Date('2025-06-25T13:00:00'),
    repeat_schedule: 'none', 
    days: []
  },
  {
    title: 'Project Meeting',
    start: new Date('2025-06-25T15:00:00'),
    end: new Date('2025-06-25T16:30:00'),
    color: '#9C27B0',
    end_repeat: new Date('2025-06-25T16:30:00'),
    repeat_schedule: 'none', 
    days: []
  },
  {
    title: 'Dentist Appointment',
    start: new Date('2025-06-26T11:00:00'),
    end: new Date('2025-06-26T11:45:00'),
    color: '#E91E63',
    end_repeat: new Date('2025-06-26T11:45:00'),
    repeat_schedule: 'none', 
    days: []
  },
  {
    title: 'Date Night',
    start: new Date('2025-06-27T19:00:00'),
    end: new Date('2025-06-27T21:30:00'),
    color: '#F44336',
    end_repeat: new Date('2025-06-27T21:30:00'),
    repeat_schedule: 'none', 
    days: []
  },
  {
    title: 'Weekend Hike',
    start: new Date('2025-06-29T08:00:00'),
    end: new Date('2025-06-29T10:00:00'),
    color: '#3F51B5',
    end_repeat: new Date('2025-06-29T10:00:00'),
    repeat_schedule: 'none', 
    days: []
  },{
    title: 'Date Night',
    start: new Date('2025-06-28T19:00:00'),
    end: new Date('2025-06-28T21:30:00'),
    color: '#F44336',
    end_repeat: new Date('2025-06-28T21:30:00'),
    repeat_schedule: 'none', 
    days: []
  },
    {
    title: 'Evening Yoga',
    start: new Date('2025-06-22T19:00:00'),
    end: new Date('2025-06-26T20:00:00'),
    color: '#E91E63',
    end_repeat: new Date('2025-08-24T30:00:00'),
    repeat_schedule: 'monthly', 
    days: [0,1,2,3,4,6]
  },
];
