import LikesModal from '@/components/LikesModal'
import TaskCard, { TaskCardDetails } from '@/components/TaskCard'
import React, { useState } from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const kanban = () => {
  const [visible, setVisible] = useState(true);
  return (
    <SafeAreaView>
      <Text>kanban</Text>
      <TaskCard {...storyCardDetails1} />
      <TaskCard {...storyCardDetails2} />
      <TaskCard {...storyCardDetails3} />
      <LikesModal visible={visible} likes={exampleLikes} onClose={()=>setVisible(false)}/>
    </SafeAreaView>
  )
}

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
