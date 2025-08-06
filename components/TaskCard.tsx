import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface TaskCardDetails {
  personID?: string;
  username?: string;
  taskID?: string;
  eventID?: string;
  taskName?: string;
  groupName?: string | null;
  dueDay?: Date;
  finished?: boolean;
  accomplished: boolean;
  mytask: boolean;
  backlog?: boolean;
}

const TaskCard = ({
  taskID,
  eventID,
  taskName,
  groupName,
  dueDay,
  finished,
  accomplished,
  mytask,
  backlog
}: TaskCardDetails) => {
  const cardContent = (
    <View
      style={[
        styles.innerBox,
        accomplished && { borderWidth: 2.5, borderColor: 'black' }
      ]}
      className="w-[200px] h-[110px] bg-primary flex-row items-center px-4 py-3 justify-between"
    >
      <View className="flex flex-col justify-center flex-1 mr-4">
        {groupName &&
          <Text className="text-[12px] font-bold text-gray-400 mb-1" numberOfLines={1}>
            {groupName}
          </Text>
        }
        <Text className="text-[16px] font-bold" numberOfLines={2}>
          {taskName || 'No Task Name'}
        </Text>
        <Text className="text-[12px] font-medium mt-1" numberOfLines={2}>
          {dueDay?.toDateString() === new Date().toDateString()
            ? (taskID ? 'Due ' : '') + 'Today at ' + dueDay?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : dueDay && dueDay < new Date()
              ? (taskID ? 'Overdue' : 'Event started')
              : dueDay && dueDay.toDateString() === new Date(new Date().setDate(new Date().getDate() + 1)).toDateString()
                ? (taskID ? 'Due ' : '') + 'Tomorrow at ' + dueDay?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : dueDay && dueDay > new Date()
                  ? (taskID ? 'Due in ' : 'In ') + Math.ceil((dueDay.getTime() - new Date().getTime()) / (1000 * 3600 * 24)) + ' days'
                  : backlog
                    ? 'Backlogged Task'
                    : 'No Due Date'}
        </Text>
      </View>

      {mytask && !finished && !accomplished && (
        <Text className="text-[13px] font-medium text-black bg-white border border-black px-4 py-1 rounded-full">
          Done
        </Text>
      )}
    </View>
  );

  return (
    <Link href={taskID ? `../infoScreen/todo/${taskID}` : `../infoScreen/event/${eventID}`} asChild>
      {!accomplished ? (
        <LinearGradient
          colors={['#4facfe', '#0A1929']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.border}
        >
          {cardContent}
        </LinearGradient>
      ) : (
        <View style={styles.border}>
          {cardContent}
        </View>
      )}
    </Link>
  );
};

const styles = StyleSheet.create({
  border: {
    padding: 3,
    borderRadius: 12,
  },
  innerBox: {
    backgroundColor: 'white',
    borderRadius: 10,
  }
});

export default TaskCard;
