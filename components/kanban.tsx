import { numbers } from '@/constants/numbers';
import { Calendar, CheckCircle, Clock, List, Plus, SortAsc } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

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

const KanbanPage = ({ taskCards }: KanbanProps) => {
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

  const renderTabs = () => (
    <View className="flex-row justify-around pt-4 pb-2 border-b border-gray-200 bg-secondary">
      {TABS.map(tab => (
        <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
          <Text className={`px-3 pb-1 text-lg font-semibold ${activeTab === tab ? 'border-b-2 border-white text-white' : 'text-white'}`}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTaskList = () => {
    const tasks = filteredTasks[activeTab];
    if (tasks.length === 0) {
      return <Text className="text-center text-gray-400 mt-4 bg-primary">No tasks</Text>;
    }

    return (
      <View className="px-4 py-2">
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
                    {task.dueDay?.toDateString() === new Date().toDateString()
                    ? `Today at ${task.dueDay?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : task.dueDay.toDateString() === new Date(new Date().setDate(new Date().getDate() + 1)).toDateString()
                    ? `Tomorrow at ${task.dueDay?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : task.dueDay < new Date()
                    ? (
                        <Text className="text-red">
                            {task.dueDay.toLocaleDateString()} at {task.dueDay.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                        )
                    : `${task.dueDay.toLocaleDateString()} at ${task.dueDay.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                </Text>
                )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={closeMenus}>
      <View className="flex-1 bg-primary">
        {renderTabs()}
        <ScrollView className="flex-1">{renderTaskList()}</ScrollView>

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
