
import DayCalendar from '@/components/DayCalendar';
import MonthCalendar from '@/components/MonthCalendar';
import DraggablePlusButton from '@/components/todosEvents/draggableButton';
import TodoModal from '@/components/todosEvents/todoModal';
import WeekCalendar from '@/components/WeekCalendar';
import { supabase } from '@/constants/supabaseClient';
import { getUserId } from '@/services/api';
import { getMyEvents } from '@/services/myCalendar';
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
  const peopleShown: calendarPersonProps[] = [{ personId: 'person1', personName: 'Person 1', isChecked: false }, { personId: 'person2', personName: 'Person 2', isChecked: true }, { personId: 'person3', personName: 'Person 3', isChecked: false }];
  const groupsShown: calendarGroupProps[] = [{ groupId: 'group1', groupName: 'Group 1', isChecked: true }, { groupId: 'group2', groupName: 'Group 2', isChecked: true }, { groupId: 'group3', groupName: 'Group 3', isChecked: false }];
  const isFocused = useIsFocused();
  const [date, setDate] = React.useState<Date>(new Date());
  const [categories, setCategories] = React.useState<drawerProps[]>(categoriesShown);
  const [people, setPeople] = React.useState<calendarPersonProps[]>(peopleShown);
  const [groups, setGroups] = React.useState<calendarGroupProps[]>(groupsShown);
  const [view, setView] = React.useState<'day' | 'week' | 'month'>('day');
  const [eventModalVisible, setEventModalVisible] = React.useState<boolean>(false);
  const [currEvent, setCurrEvent] = React.useState<EventDetailsForNow | null>(null);
  const [supabaseEvents, setSupabaseEvents] = React.useState<EventDetailsForNow[]>([]);
  useEffect(() => { console.log(date.toDateString()) }, [date]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const userId = (await getUserId())[0];
        const events = await getMyEvents(userId, supabase);
  
        if (events) {
          const mappedEvents: EventDetailsForNow[] = events.map((ev) => ({
            title: ev.title,
            start_date: new Date(ev.start_date),
            end_date: new Date(ev.end_date),
            // If end_repeat exists, use it; otherwise fallback to end_date
            end_repeat: ev.end_repeat ? new Date(ev.end_repeat) : new Date(ev.end_date),
            event_color: ev.event_color ?? '#000000', // fallback color
            weekdays: ev.weekdays,
            repeat: ev.repeat as 'weekly' | 'monthly' | 'biweekly' | 'daily' | 'none' | 'yearly',
            isAllDay: ev.is_all_day,
            id: ev.id
          }));
  
          setSupabaseEvents(mappedEvents);
          console.log('Fetched events:', mappedEvents);
        } else {
          console.log('No events found or error fetching events.');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
  
    fetchEvents();
  }, []);
  

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

  const handleChangedEvent = (eventDetails: EventDetailsForNow) => { }


  const INITIAL_HEIGHT = 30;

  const [hourHeight, setHourHeight] = useState<number>(INITIAL_HEIGHT);


  return (
    <View className="flex flex-col flex-1 gap-0 bg-primary h-full w-full">
      {view === 'day' && (
        <>
          {isFocused ? <StatusBar style="light" /> : null}
          <DayCalendar events={supabaseEvents} viewingDate={date} setViewingDateFunc={setDate} categories={categories} handleCategoryToggle={handleTogglePublic} setView={setView} hourHeight={hourHeight} setHourHeight={setHourHeight} people={people} groups={groups} handlePersonToggle={handlePersonToggle} handleGroupToggle={handleGroupToggle} onEventPress={(event) => { setCurrEvent(event); console.log('event switched', event); setEventModalVisible(true); }} />
        </>
      )}
      {view === 'week' && (
        <>
          {isFocused ? <StatusBar style="light" /> : null}
          <WeekCalendar events={supabaseEvents} viewingDate={date} setViewingDateFunc={setDate} categories={categories} handleCategoryToggle={handleTogglePublic} setView={setView} hourHeight={hourHeight} setHourHeight={setHourHeight} people={people} groups={groups} handlePersonToggle={handlePersonToggle} handleGroupToggle={handleGroupToggle} onEventPress={(event) => { setCurrEvent(event); setEventModalVisible(true); }} />
        </>
      )}
      {view === 'month' && (
        <>
          {isFocused ? <StatusBar style="light" /> : null}
          <MonthCalendar events={supabaseEvents} viewingDate={date} setViewingDateFunc={setDate} categories={categories} handleCategoryToggle={handleTogglePublic} setView={setView} people={people} hourHeight={hourHeight} setHourHeight={setHourHeight} groups={groups} handlePersonToggle={handlePersonToggle} handleGroupToggle={handleGroupToggle} onEventPress={(event) => { setCurrEvent(event); setEventModalVisible(true); }} />
        </>
      )}

      <>
        <DraggablePlusButton onPress={() => console.log('buttonPressed!')} />
        {/* <EventModal visible={eventModalVisible} onClose={(() => setEventModalVisible(false))} event={currEvent} onSave={(event) => { setCurrEvent(event) }} /> */}
        <TodoModal visible={eventModalVisible} onClose={() => setEventModalVisible(false)}/>
      </>


    </View>
  );
}

export default calendar

// Example props usage (for reference):
/*
<TodoModal
  visible={true}
  onClose={() => console.log('Closed')}
  todo={{
    title: 'Plan birthday party',
    dueDate: '2025-08-10T00:00:00Z',
    repeat: 'weekly',
    location: 'Central Park',
    allDay: true,
    completed: false,
  }}
  subtodos={[
    { id: '1', title: 'Buy cake', completed: true, completedBy: 'Alice', dueDate: '2025-08-08' },
    { id: '2', title: 'Send invites', completed: false, dueDate: '2025-08-09' },
    { id: '3', title: 'Book picnic spot', completed: false, dueDate: '2025-08-07', isMaster: true },
  ]}
  onSubtodoPress={(sub) => console.log('Subtodo pressed:', sub)}
/>
*/


// const sampleEvents: EventDetailsForNow[] = [
//   {
//     title: 'Morning Run',
//     start_date: new Date('2025-06-24T06:00:00'),
//     end_date: new Date('2025-06-24T07:00:00'),
//     event_color: '#4CAF50',
//     end_repeat: new Date('2025-08-24T023:59:59'),
//     repeat: 'none',
//     weekdays: []
//   },
//   {
//     title: 'Team Stand-up Meeting',
//     start_date: new Date('2025-06-24T09:15:00'),
//     end_date: new Date('2025-06-24T09:30:00'),
//     event_color: '#2196F3',
//     end_repeat: new Date('2025-06-24T09:30:00'),
//     repeat: 'none',
//     weekdays: []
//   },
//   {
//     title: 'Morning Run',
//     start_date: new Date('2025-06-24T06:00:00'),
//     end_date: new Date('2025-06-24T07:00:00'),
//     event_color: '#4CAF50',
//     end_repeat: new Date('2025-06-24T07:00:00'),
//     repeat: 'none',
//     weekdays: []
//   },
//   {
//     title: 'Team Stand-up Meeting',
//     start_date: new Date('2025-06-24T09:00:00'),
//     end_date: new Date('2025-06-24T09:30:00'),
//     event_color: '#2196F3',
//     end_repeat: new Date('2025-06-24T09:30:00'),
//     repeat: 'none',
//     weekdays: []
//   },
//   {
//     title: 'Morning Run',
//     start_date: new Date('2025-06-24T06:00:00'),
//     end_date: new Date('2025-06-24T07:00:00'),
//     event_color: '#4CAF50',
//     end_repeat: new Date('2025-06-24T07:00:00'),
//     repeat: 'none',
//     weekdays: []
//   },
//   {
//     title: 'Team Stand-up Meeting',
//     start_date: new Date('2025-06-24T09:20:00'),
//     end_date: new Date('2025-06-24T09:35:00'),
//     event_color: '#2196F3',
//     end_repeat: new Date('2025-06-24T09:35:00'),
//     repeat: 'none',
//     weekdays: []
//   },
//   {
//     title: 'Work Session: UI Design',
//     start_date: new Date('2025-06-24T10:00:00'),
//     end_date: new Date('2025-06-24T12:00:00'),
//     event_color: '#FFC107',
//     end_repeat: new Date('2025-06-24T12:00:00'),
//     repeat: 'none',
//     weekdays: []
//   },
//   {
//     title: 'Lunch with Sarah',
//     start_date: new Date('2025-06-24T12:30:00'),
//     end_date: new Date('2025-06-24T13:30:00'),
//     event_color: '#FF5722',
//     end_repeat: new Date('2025-06-24T13:30:00'),
//     repeat: 'none',
//     weekdays: []
//   },
//   {
//     title: 'Doctor Appointment',
//     start_date: new Date('2025-06-24T15:00:00'),
//     end_date: new Date('2025-06-24T15:45:00'),
//     event_color: '#9C27B0',
//     end_repeat: new Date('2025-06-24T15:45:00'),
//     repeat: 'none',
//     weekdays: []
//   },
//   {
//     title: 'Project Review Call',
//     start_date: new Date('2025-06-24T16:00:00'),
//     end_date: new Date('2025-06-24T17:00:00'),
//     event_color: '#3F51B5',
//     end_repeat: new Date('2025-06-24T17:00:00'),
//     repeat: 'none',
//     weekdays: []
//   },
//   {
//     title: 'Morning Workout',
//     start_date: new Date('2025-06-23T06:30:00'),
//     end_date: new Date('2025-06-23T07:30:00'),
//     event_color: '#4CAF50',
//     end_repeat: new Date('2025-06-23T07:30:00'),
//     repeat: 'none',
//     weekdays: []
//   },
//   {
//     title: 'Team Standup',
//     start_date: new Date('2025-06-24T09:00:00'),
//     end_date: new Date('2025-06-24T09:30:00'),
//     event_color: '#2196F3',
//     end_repeat: new Date('2025-06-24T09:30:00'),
//     repeat: 'none',
//     weekdays: []
//   },
//   {
//     title: 'Lunch with Alex',
//     start_date: new Date('2025-06-25T12:00:00'),
//     end_date: new Date('2025-06-25T13:00:00'),
//     event_color: '#FFC107',
//     end_repeat: new Date('2025-06-25T13:00:00'),
//     repeat: 'none',
//     weekdays: []
//   },
//   {
//     title: 'Project Meeting',
//     start_date: new Date('2025-06-25T15:00:00'),
//     end_date: new Date('2025-06-25T16:30:00'),
//     event_color: '#9C27B0',
//     end_repeat: new Date('2025-06-25T16:30:00'),
//     repeat: 'none',
//     weekdays: []
//   },
//   {
//     title: 'Dentist Appointment',
//     start_date: new Date('2025-06-26T11:00:00'),
//     end_date: new Date('2025-06-26T11:45:00'),
//     event_color: '#E91E63',
//     end_repeat: new Date('2025-06-26T11:45:00'),
//     repeat: 'none',
//     weekdays: []
//   },
//   {
//     title: 'Date Night',
//     start_date: new Date('2025-06-27T19:00:00'),
//     end_date: new Date('2025-06-27T21:30:00'),
//     event_color: '#F44336',
//     end_repeat: new Date('2025-06-27T21:30:00'),
//     repeat: 'none',
//     weekdays: []
//   },
//   {
//     title: 'Weekend Hike',
//     start_date: new Date('2025-06-29T08:00:00'),
//     end_date: new Date('2025-06-29T10:00:00'),
//     event_color: '#3F51B5',
//     end_repeat: new Date('2025-06-29T10:00:00'),
//     repeat: 'none',
//     weekdays: []
//   }, {
//     title: 'Date Night',
//     start_date: new Date('2025-06-28T19:00:00'),
//     end_date: new Date('2025-06-28T21:30:00'),
//     event_color: '#F44336',
//     end_repeat: new Date('2025-06-28T21:30:00'),
//     repeat: 'none',
//     weekdays: []
//   },
//   // {
//   //   title: 'Evening Yoga',
//   //   start: new Date('2025-07-31T19:00:00'),
//   //   end: new Date('2025-08-02T20:00:00'),
//   //   color: '#E91E63',
//   //   end_repeat: new Date('2026-05-24T30:00:00'),
//   //   repeat_schedule: 'weekly',
//   //   days: [0,1,2,6]
//   // },
//   {
//     title: 'Birthday!',
//     start_date: new Date('2006-02-08T23:00:00Z'),
//     end_date: new Date('2006-02-09T23:00:00Z'),
//     event_color: '#E91E63',
//     end_repeat: new Date('2100-08-09T23:00:00Z'),
//     repeat: 'yearly',
//     weekdays: [1],
//     isAllDay: true
//   },
// ];
