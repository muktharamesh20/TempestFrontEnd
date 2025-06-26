import { numbers } from '@/constants/numbers';
import { Calendar, CheckCircle, Clock, List, Plus, SortAsc } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TabBar, TabView } from 'react-native-tab-view';

export interface TaskCardDetails {
  taskID?: string;
  eventID?: string;
  taskName?: string;
  groupName?: string | null;
  dueDay?: Date;
  finished?: boolean;
  accomplished: boolean;
  mytask: boolean;
  backlog?: boolean;
  color?: string;
}

interface KanbanProps {
  taskCards: TaskCardDetails[];
}

const TABS = ['Backlog', 'To Do', 'Done', 'Events'] as const;
type Tab = typeof TABS[number];

const addOptionIcons = [
    <Plus color="white" size={18} />,
    <List color="white" size={18} />,
    <Calendar color="white" size={18} />,
    <CheckCircle color="white" size={18} />
  ];
  const sortOptionIcons = [
    <SortAsc color="white" size={18} />,
    <Clock color="white" size={18} />,
    <CheckCircle color="white" size={18} />
  ];

const initialLayout = { width: Dimensions.get('window').width };

const KanbanPage = ({ taskCards }: KanbanProps) => {
  const [index, setIndex] = useState(1); // default to "To Do"
  const [routes] = useState(
    TABS.map(tab => ({ key: tab, title: tab }))
  );

  const [activeTab, setActiveTab] = useState<Tab>('To Do');
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);

  const toggleAdd = () => {
    setShowAddOptions(prev => !prev);
    if (showSortOptions) setShowSortOptions(false);
  };

  const toggleSort = () => {
    setShowSortOptions(prev => !prev);
    if (showAddOptions) setShowAddOptions(false);
  };

  const closeMenus = () => {
    if (showAddOptions || showSortOptions) {
      setShowAddOptions(false);
      setShowSortOptions(false);
    }
  };

  const filteredTasks: Record<Tab, TaskCardDetails[]> = {
    Backlog: taskCards.filter(task => task.backlog),
    'To Do': taskCards.filter(task => !task.backlog && !task.accomplished && !task.eventID),
    Done: taskCards.filter(task => task.accomplished && !task.eventID),
    Events: taskCards.filter(task => task.eventID),
  };

  const renderTaskList = (tab: Tab) => {
    const tasks = filteredTasks[tab];
    if (tasks.length === 0) {
      if (tab === 'Events'){
        return <Text className="text-center text-gray-400 mt-4">No events</Text>;
      }
      return <Text className="text-center text-gray-400 mt-4">No tasks</Text>;
    }

    return (
        <ScrollView className="px-4 py-2">
          {tasks.map(task => (
            <View
              key={task.taskID ?? task.eventID}
              className="rounded-lg p-3 mb-3"
              style={{ backgroundColor: task.color || '#E5E7EB' }}
            >
              <Text className="text-xl font-bold text-white mb-1" numberOfLines={1}>
                {task.taskName || 'Untitled Task'}
              </Text>
              {task.groupName && (
                <Text className="text-base text-white" numberOfLines={1}>
                  {task.groupName}
                </Text>
              )}
              {task.dueDay && (
                <Text className="text-base text-white mt-1">
                  {task.eventID ? 'Starts: ' : 'Due: '}
                  {task.dueDay.toLocaleDateString()} at {task.dueDay.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      );
  };

  const renderScene = ({ route }: { route: { key: string } }) => {
    return renderTaskList(route.key as Tab);
  };

  return (
    <TouchableWithoutFeedback onPress={closeMenus}>
    <View className="flex-1 bg-primary">
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        swipeEnabled={true}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: 'white',
                height: 3,
                marginBottom: 7, 
              }}
              
            style={{ backgroundColor: numbers.secondaryColor, marginBottom: 7}}
            //labelStyle={{ color: 'white', fontWeight: '600' }}
            activeColor="white"
            inactiveColor="#d1d5db"
          />
        )}
      />

      {/* Floating Pill Button and expanded options */}
      <View className="absolute bottom-6 right-6 items-end" style={{ zIndex: 2 }}>
          {(showAddOptions || showSortOptions) && (
            <View className="mb-2 rounded-lg px-0 py-0" style={{ minWidth: 140 }}>
              {(showAddOptions
                ? ['To-do', 'Task', 'Event', 'Category']
                : ['Auto', 'Deadline', 'Priority']
              ).map((label, index) => {
                const icon = showAddOptions ? addOptionIcons[index] : sortOptionIcons[index];
                const dotColor = showAddOptions ? '#000000': numbers.secondaryColor;

                return (
                  <TouchableOpacity
                    key={label}
                    onPress={() => {
                      console.log(`${label} option pressed`);
                      if (showSortOptions) {
                        setShowSortOptions(false);
                      }
                    }}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      width: '100%',
                      paddingVertical: 8,
                      paddingHorizontal: 0,
                      marginBottom: 8,
                      alignSelf: 'flex-end',
                      maxWidth: 140, 
                    }}
                  >
                    <Text
                      style={{ color: numbers.secondaryColor, flex: 1, textAlign: 'right', marginRight: 12 }}
                      className="font-medium"
                    >
                      {label}
                    </Text>
                    <View
                      className="w-12 h-12 rounded-full justify-center items-center"
                      style={{ backgroundColor: dotColor }}
                    >
                      {icon}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Main pill buttons */}
          <View
            className="flex-row p-2 rounded-full"
            style={{ backgroundColor: numbers.secondaryColor }}
          >
            <TouchableOpacity onPress={toggleAdd} className="mr-2">
              <View className="w-10 h-10 rounded-full justify-center items-center">
                <Plus color="white" size={20} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleSort}>
              <View className="w-10 h-10 rounded-full justify-center items-center">
                <SortAsc color="white" size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
    </View>
     </TouchableWithoutFeedback>
  );
};

export default KanbanPage;
