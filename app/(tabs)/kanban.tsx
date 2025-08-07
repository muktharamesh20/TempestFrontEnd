import KanbanPage from '@/components/kanban'
import { numbers } from '@/constants/numbers'
import { addDays } from 'date-fns'
import React from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const kanban = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: numbers.secondaryColor, paddingTop: insets.top }}>

      <Text className="font-semibold text-3xl text-center text-white mb-0">Task Board</Text>

      <KanbanPage
        taskCards={[
          {
            taskID: '1',
            taskName: 'Fix bug',
            groupName: 'Engineering',
            dueDay: new Date(),
            accomplished: false,
            mytask: true,
            backlog: false,
            color: '#f87171', // Tailwind red-400
          },
          {
            eventID: 'e1',
            taskName: 'Sprint Planning',
            groupName: 'Team Meeting',
            dueDay: addDays(new Date(), 5),
            accomplished: false,
            mytask: false,
            color: '#60a5fa', // Tailwind blue-400
          },
          {
            eventID: 'e3',
            taskName: 'Birthday',
            groupName: 'Team Meeting',
            dueDay: addDays(new Date(), -5),
            accomplished: false,
            mytask: false,
            color: '#f87171', // Tailwind blue-400
          },
          {
            taskID: '2',
            taskName: 'Submit report',
            groupName: 'Operations',
            dueDay: addDays(new Date(), 5),
            accomplished: true,
            mytask: true,
            color: '#34d399', // Tailwind green-400
          },
        ]}
      />

    </View>
  )
}

const sampleEvents = [
  {
    title: 'Morning Run',
    start: new Date('2025-06-24T06:00:00'),
    end: new Date('2025-06-24T07:00:00'),
    color: '#4CAF50',
  },
  {
    title: 'Team Stand-up Meeting',
    start: new Date('2025-06-24T09:15:00'),
    end: new Date('2025-06-24T09:30:00'),
    color: '#2196F3',
  },
  {
    title: 'Morning Run',
    start: new Date('2025-06-24T06:00:00'),
    end: new Date('2025-06-24T07:00:00'),
    color: '#4CAF50',
  },
  {
    title: 'Team Stand-up Meeting',
    start: new Date('2025-06-24T09:00:00'),
    end: new Date('2025-06-24T09:30:00'),
    color: '#2196F3',
  },
  {
    title: 'Morning Run',
    start: new Date('2025-06-24T06:00:00'),
    end: new Date('2025-06-24T07:00:00'),
    color: '#4CAF50',
  },
  {
    title: 'Team Stand-up Meeting',
    start: new Date('2025-06-24T09:20:00'),
    end: new Date('2025-06-24T09:35:00'),
    color: '#2196F3',
  },
  {
    title: 'Work Session: UI Design',
    start: new Date('2025-06-24T10:00:00'),
    end: new Date('2025-06-24T12:00:00'),
    color: '#FFC107',
  },
  {
    title: 'Lunch with Sarah',
    start: new Date('2025-06-24T12:30:00'),
    end: new Date('2025-06-24T13:30:00'),
    color: '#FF5722',
  },
  {
    title: 'Doctor Appointment',
    start: new Date('2025-06-24T15:00:00'),
    end: new Date('2025-06-24T15:45:00'),
    color: '#9C27B0',
  },
  {
    title: 'Project Review Call',
    start: new Date('2025-06-24T16:00:00'),
    end: new Date('2025-06-24T17:00:00'),
    color: '#3F51B5',
  },
  {
    title: 'Evening Yoga',
    start: new Date('2025-06-24T19:00:00'),
    end: new Date('2025-06-24T20:00:00'),
    color: '#E91E63',
  },
];

export default kanban
