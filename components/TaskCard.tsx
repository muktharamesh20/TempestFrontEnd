import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

export interface TaskCardDetails {
	taskID?: string;
	eventID?: string;
	personID: string;
	taskName?: string;
	groupName?: string | null;
	dueDay?: Date; 
	numNudges?: number;
	nudged?: boolean;
	finished?: boolean;
	username?: string;
	mytask:boolean;
	backlog?: boolean;
	accomplished: boolean;
}

const TaskCard = ({backlog, mytask, taskID, eventID, personID, taskName, groupName, dueDay, numNudges, nudged, finished, username, accomplished }: TaskCardDetails) => {

  return (
		<Link href = {taskID ? `../infoScreen/todo/${taskID}` : `../infoScreen/event/${eventID}`} asChild>
    <ImageBackground
      source={(!accomplished && require('../assets/images/border.png'))} 
      style={styles.border} 
	  className = {accomplished ? "border border-black" : ""}
      imageStyle={{ borderRadius: 12 }}
    >
      <View style={styles.innerBox} className="w-[200px] h-[100px] bg-primary flex flex-row justify-between">
        <View className = "mt-[13px] ml-[13px] mr-[70px] mb-[13px] flex flex-col justify-center gap-0">

					{/** The group name (if available) */}
					{groupName &&
					<Text className="text-[12px] font-bold text-gray-400 mt-[5px]" numberOfLines={1}>
						{groupName}
					</Text>
					}
					{/* If groupName is not available, show an empty Text component to leave a little space */}
					{!groupName &&
					<Text className="text-[2px] font-bold text-gray-400 mt-[5px]" numberOfLines={1}>
						</Text>
					}

					{/** The task name (if available) */}
					<Text className="text-[17px] font-bold " numberOfLines={2}>
						{taskName || 'No Taskkkkkkkkkk'}
					</Text>

					{/** The due day (if available) */}
					<Text className="text-xs font-medium mt-4" numberOfLines={2}>
						{dueDay?.toDateString() === new Date().toDateString()
							? (taskID ? 'Due ' : '') + 'Today at ' + dueDay?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
							: dueDay && dueDay < new Date()
							? <Text className = "text-black">{taskID ? 'Overdue' : 'Event already started'}</Text>
							:dueDay && dueDay.toDateString() === new Date(new Date().setDate(new Date().getDate() + 1)).toDateString()
							? (taskID ? 'Due ' : '') + 'Tomorrow at ' + dueDay?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
							: dueDay && dueDay > new Date()
							? (taskID ? 'Due in ' : 'Occuring in') + Math.ceil((dueDay.getTime() - new Date().getTime()) / (1000 * 3600 * 24)) + ' days'
							: backlog
							? 'Backlogged Task'
							: 'No Due Date'}
					</Text>
        </View>
		<View>
				{/** The nudges and finished status for tasks */}
				{taskID &&
				<View className="flex flex-col items-center mr-3 absolute bottom-4">
					{mytask &&
					<Ionicons name = "checkmark-circle-outline" size={30} color="#000" />
				  }
					{/**Leave gap if not ur task */}
					{!mytask &&
					<Text className="text-[12.5px] justify-center absolute">
					</Text>
				  }

					<Text className="text-[12.5px] font-medium text-white bg-black px-3 py-1 rounded-full">
					👆 {numNudges || 0}
					</Text>
				</View>
				}
		</View>
      </View>
    </ImageBackground>
	</Link>
  );
};

const styles = StyleSheet.create({
  border: {
    padding: 3,
    borderRadius: 12,
  },
  innerBox: {
    backgroundColor: '#F9F8F5',
    borderRadius: 10,
  }
});

export default TaskCard;

