
import DayCalendar from '@/components/DayCalendar';
import MonthCalendar from '@/components/MonthCalendar';
import DraggablePlusButton from '@/components/todosEvents/draggableButton';
import EventModal from '@/components/todosEvents/eventModal';
import WeekCalendar from '@/components/WeekCalendar';
import { calendarGroupProps, calendarPersonProps, drawerProps, EventDetailsForNow } from '@/services/utils';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

const calendar = () => {
  const categoriesShown: drawerProps[] =
    [{ isPublic: true, categoryId: 'blahblah', categoryName: 'blah', categoryColor: 'green' }
      , { isPublic: false, categoryId: 'blahblah2', categoryName: 'blah2', categoryColor: 'blue' }
      , { isPublic: true, categoryId: 'blahblah3', categoryName: 'blah3aaaaaaaaaaaaaaaaaaaaaaa aaaaa aaaaaaaaaaaaaaaaaaaa', categoryColor: '#000000' },
    { isPublic: false, categoryId: 'blahblah4', categoryName: 'blah4', categoryColor: 'red' }
    ];
  const peopleShown: calendarPersonProps[] = [{personId: 'person1', personName: 'Person 1',  isChecked: false}, {personId: 'person2', personName: 'Person 2', isChecked: true}, {personId: 'person3', personName: 'Person 3', isChecked: false}];
  const groupsShown: calendarGroupProps[] = [{groupId: 'group1', groupName: 'Group 1', isChecked: true}, {groupId: 'group2', groupName: 'Group 2', isChecked: true}, {groupId: 'group3', groupName: 'Group 3', isChecked: false}];
  const isFocused = useIsFocused();
  const [date, setDate] = React.useState<Date>(new Date());
  const [categories, setCategories] = React.useState<drawerProps[]>(categoriesShown);
  const [people, setPeople] = React.useState<calendarPersonProps[]>(peopleShown);
  const [groups, setGroups] = React.useState<calendarGroupProps[]>(groupsShown);
  const [view, setView] = React.useState<'day' | 'week' | 'month'>('day');
  const [eventModalVisible, setEventModalVisible] = React.useState<boolean>(false);
  const [currEvent, setCurrEvent] = React.useState<EventDetailsForNow | null>(null);
  useEffect(() => { console.log(date.toDateString()) }, [date]);

  const handleTogglePublic = (categoryId: string, newValue: boolean) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.categoryId === categoryId ? { ...cat, isPublic: newValue } : cat
      )
    );
  };

  const handlePersonToggle = (personId: string, newValue: boolean) => {
    setPeople(prev =>
      prev.map(person =>
        person.personId === personId ? { ...person, isChecked: newValue } : person
      )
    );
  };

  const handleGroupToggle = (groupId: string, newValue: boolean) => {
    setGroups(prev =>
      prev.map(group =>
        group.groupId === groupId ? { ...group, isChecked: newValue } : group
      )
    );
  };

  const handleChangedEvent = (eventDetails: EventDetailsForNow) => {}


  const INITIAL_HEIGHT = 30;

  const [hourHeight, setHourHeight] = useState<number>(INITIAL_HEIGHT);


  return (
    <View className="flex flex-col flex-1 gap-0 bg-primary h-full w-full">
      {view === 'day' && (
        <>
          {isFocused ? <StatusBar style="light" /> : null}
          <DayCalendar events={sampleEvents} viewingDate={date} setViewingDateFunc={setDate} categories={categories} handleCategoryToggle={handleTogglePublic} setView={setView} hourHeight={hourHeight} setHourHeight={setHourHeight} people={people} groups={groups} handlePersonToggle={handlePersonToggle} handleGroupToggle={handleGroupToggle} onEventPress={(event) => {setCurrEvent(event); console.log('event switched', event); setEventModalVisible(true);}}/>
        </>
      )}
      {view === 'week' && (
        <>
          {isFocused ? <StatusBar style="light" /> : null}
          <WeekCalendar events={sampleEvents} viewingDate={date} setViewingDateFunc={setDate} categories={categories} handleCategoryToggle={handleTogglePublic} setView={setView} hourHeight={hourHeight} setHourHeight={setHourHeight} people={people} groups={groups} handlePersonToggle={handlePersonToggle} handleGroupToggle={handleGroupToggle} onEventPress={(event) => {setCurrEvent(event); setEventModalVisible(true);}}/>
        </>
      )}
      {view === 'month' && (
        <>
          {isFocused ? <StatusBar style="light" /> : null}
          <MonthCalendar events={sampleEvents} viewingDate={date} setViewingDateFunc={setDate} categories={categories} handleCategoryToggle={handleTogglePublic} setView={setView} people={people} hourHeight={hourHeight} setHourHeight={setHourHeight} groups={groups} handlePersonToggle={handlePersonToggle} handleGroupToggle={handleGroupToggle} onEventPress={(event) => {setCurrEvent(event); setEventModalVisible(true);}}/>
        </>
      )}

      <>
    <DraggablePlusButton onPress={() => console.log('buttonPressed!')}/>
    <EventModal visible={eventModalVisible} onClose={(() => setEventModalVisible(false))} event ={currEvent} onSave={(event) => {setCurrEvent(event)}}/>

    </>


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
  }, {
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
    start: new Date('2025-07-31T19:00:00'),
    end: new Date('2025-08-02T20:00:00'),
    color: '#E91E63',
    end_repeat: new Date('2026-05-24T30:00:00'),
    repeat_schedule: 'weekly',
    days: [0,1,2,6]
  },
  {
    title: 'Birthday!',
    start: new Date('2006-02-07T23:00:00'),
    end: new Date('2006-02-08T23:00:00'),
    color: '#E91E63',
    end_repeat: new Date('2028-05-24T20:00:00'),
    repeat_schedule: 'yearly',
    days: [1],
    isAllDay: true
  },
];
