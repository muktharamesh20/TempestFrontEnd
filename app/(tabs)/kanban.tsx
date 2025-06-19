import TaskCard, { TaskCardDetails } from '@/components/TaskCard'
import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const kanban = () => {
  return (
    <SafeAreaView>
      <Text>kanban</Text>
      <TaskCard {...storyCardDetails1} />
      <TaskCard {...storyCardDetails2} />
      <TaskCard {...storyCardDetails3} />
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