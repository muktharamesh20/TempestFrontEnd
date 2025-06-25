import KanbanPage from '@/components/kanban'
import { TaskCardDetails } from '@/components/TaskCard'
import { numbers } from '@/constants/numbers'
import { addDays } from 'date-fns'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const kanban = () => {
  const [visible, setVisible] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const insets = useSafeAreaInsets();
  return (
    <View style = {{flex: 1, backgroundColor: numbers.secondaryColor, paddingTop: insets.top}}>
      
      {/* <Text>kanban</Text>
      <TaskCard {...storyCardDetails1} />
      <TaskCard {...storyCardDetails2} />
      <TaskCard {...storyCardDetails3} />
      <TaskCardCarosel taskCards={[storyCardDetails1, storyCardDetails2, storyCardDetails3]} />
      {/*<LikesModal visible={visible} likes={exampleLikes} onClose={()=>setVisible(false)}/>*/}
      {/* <CalendarDayView
  events={sampleEvents}
  onEventPress={(event) => console.log('Pressed event:', event)}
/> */}
{/* <SimplifiedCalendar /> */}

      {/* <TodoModal visible={showModal} onClose={() => setShowModal(false)} />  */}

      <Text className="font-bold text-3xl text-center text-white self-center mb-0">Task Board</Text>


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
      dueDay: addDays(new Date(),5),
      accomplished: false,
      mytask: false,
      color: '#60a5fa', // Tailwind blue-400
    },
    {
      eventID: 'e3',
      taskName: 'Birthday',
      groupName: 'Team Meeting',
      dueDay: addDays(new Date(),-5),
      accomplished: false,
      mytask: false,
      color: '#f87171', // Tailwind blue-400
    },
    {
      taskID: '2',
      taskName: 'Submit report',
      groupName: 'Operations',
      dueDay: addDays(new Date(),5),
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

const storyCardDetails1: TaskCardDetails = { 
  personID: "1", 
  taskID: "h", 
  groupName: "Gym ofc 🏋️", 
  taskName: "little rhea kid gym day", 
  mytask: true, 
  backlog: false, 
  dueDay: new Date("2025-06-19T00:00:00Z"),
  accomplished: false,
}

const storyCardDetails2: TaskCardDetails = { 
  personID: "2", 
  eventID: "g",
  username: "umamageswari", 
  groupName: "Gym ofc 🏋️", 
  taskName: "little rhea kid gym day", 
  mytask: true, 
  backlog: false, 
  dueDay: new Date("2025-06-17T00:00:00Z"), 
  accomplished: true,
}

const storyCardDetails3: TaskCardDetails = { 
  personID: "2", 
  taskID: "g",
  username: "umamageswari", 
  groupName: "Gym ofc 🏋️", 
  taskName: "little rhea kid gym day", 
  mytask: false, 
  backlog: true,
  accomplished: false,
}


interface Like {
  id: string;
  username: string;
  avatar: string;
}

export const exampleLikes: Like[] = [
  {
    id: '1',
    username: 'alice_wonder',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '2',
    username: 'bob_the_builder',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '3',
    username: 'charlie.day',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: '4',
    username: 'diana.prince',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  {
    id: '5',
    username: 'eve_techie',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
  },
  {
    id: '6',
    username: 'franklin99',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
  },
  {
    id: '7',
    username: 'grace_notes',
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
  },
  {
    id: '8',
    username: 'hank_the_tank',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
  },
  {
    id: '9',
    username: 'ivy_gardens',
    avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
  },
  {
    id: '10',
    username: 'johnny_code',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
  },
  {
    id: '153',
    username: 'eve_techie',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
  },
  {
    id: '163',
    username: 'franklin99',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
  },
  {
    id: '173',
    username: 'grace_notes',
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
  },
  {
    id: '183',
    username: 'hank_the_tank',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
  },
  {
    id: '193',
    username: 'ivy_gardens',
    avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
  },
  {
    id: '110',
    username: 'johnny_code',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
  },
  {
    id: '15',
    username: 'eve_techie',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
  },
  {
    id: '16',
    username: 'franklin99',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
  },
  {
    id: '17',
    username: 'grace_notes',
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
  },
  {
    id: '18',
    username: 'hank_the_tank',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
  },
  {
    id: '19',
    username: 'ivy_gardens',
    avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
  },
  {
    id: '1110',
    username: 'johnny_code',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
  },
];
