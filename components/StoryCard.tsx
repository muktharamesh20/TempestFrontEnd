import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SB_STORAGE_CONFIG } from '../services/api';

export interface StoryCardDetails {
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

const StoryCard = ({backlog, mytask, taskID, eventID, personID, taskName, groupName, dueDay, numNudges, nudged, finished, username, accomplished }: StoryCardDetails) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const profilePicUrl = `${SB_STORAGE_CONFIG.BASE_URL}${personID}.jpg`;
    const defaultPicUrl = `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg`;

    // Check if the profile picture exists
    Image.prefetch(profilePicUrl)
      .then(() => setImageUrl(profilePicUrl)) // If it exists, use it
      .catch(() => setImageUrl(defaultPicUrl)); // Otherwise, use the default
  }, [personID]);
  return (
		<Link href = {taskID ? `../infoScreen/todo/${taskID}` : `../infoScreen/event/${eventID}`} asChild>
    <ImageBackground
      source={(!accomplished && require('../assets/images/border.png'))} 
      style={styles.border} 
	  className = {accomplished ? "border border-black" : ""}
      imageStyle={{ borderRadius: 12 }}
    >
      <View style={styles.innerBox} className="w-[130px] h-[170px] bg-primary">
        <View className = "mt-[13px] ml-[13px] mr-[13px] mb-[13px] flex flex-col flex-start gap-0">
          {/** The profile picture and username */}
          <View className="flex flex-row flex-start gap-2 items-center mt-[-1px] ml-[-2px]">
            <Image source={{ uri: imageUrl }} className='flex flex-row flex-start w-[20px] h-[20px] border' 
                    resizeMode='cover' borderRadius = {10}/>
            <Text className="text-xs font-semibold mr-7" numberOfLines={1}>
                {username || 'Unknown User'} 
            </Text>
          </View>

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

				{/** The nudges and finished status for tasks */}
				{taskID &&
				<View className="flex flex-row justify-between items-baseline ml-3 absolute bottom-4 w-[107px]">
					{mytask &&
					<Text className="text-[12.5px] font-medium text-black bg-white border border-black px-3 py-1 rounded-full">
					Done
					</Text>
				  }
					{/**Leave gap if not ur task */}
					{!mytask &&
					<Text className="text-[12.5px]">
					</Text>
				  }

					<Text className="text-[12.5px] font-medium text-white bg-black px-3 py-1 rounded-full">
					👆 {numNudges || 0}
					</Text>
				</View>
				}

				{/** Post button for events */}
				{eventID && mytask &&
				<View className="flex flex-row justify-end items-baseline ml-3 absolute bottom-4 w-[107px]">
					<Text className="text-[12.5px] font-medium text-white bg-black border border-black px-3 py-1 rounded-full">
					Post
					</Text>
				</View>
				}
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

export default StoryCard;

