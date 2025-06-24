// SimplifiedCalendar.tsx
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

export default function SimplifiedCalendar() {
  return (
    <ScrollView style={{ flex: 1 }}>
      {Array.from({ length: 24 }, (_, i) => (
        <View key={i} style={styles.hourBlock}>
          <Text>{`${i}:00`}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  hourBlock: {
    height: 60,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    paddingLeft: 10,
  },
})
