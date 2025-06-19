import React from 'react';
import { Text, View } from 'react-native';
import { drawerProps } from './CalendarDrawer';

export interface DayViewCalendarProps {
    day: Date;
    categoriesShown: drawerProps[];
}

const DayViewCalendar = ({day, categoriesShown}: DayViewCalendarProps) => {
  return (
    <View className='bg-primary w-full h-full'>
      <Text>DayViewCalendar</Text>
    </View>
  )
}

export default DayViewCalendar