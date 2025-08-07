import { images } from '@/constants/images';
import { numbers } from '@/constants/numbers';
import { Subtodo } from '@/services/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import LocationSearch from './mapSearch';
import SubtodoTimeline from './subtodotimeline';


const avatars = [
  images.googleLogo,
  images.googleLogo,
  images.googleLogo
];

interface eventModalProps {
  visible: boolean;
  onClose: () => void;
}

const allCategories = ['Work', 'UI', 'Design', 'Engineering', 'Marketing', 'Research', 'Meeting'];

export default function TodoModal({ visible, onClose }: eventModalProps) {

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('Product Design Demo');
  const [categories, setCategories] = useState(['Work']);
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('13:30');
  const [repetition, setRepetition] = useState('Every two weeks');
  const [location, setLocation] = useState('London, Red Meeting Room');
  const [color, setColor] = useState('#FFD700'); // Gold default



  const toggleCategory = (category: string) => {
    setCategories((prev) =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const subExamples: Subtodo[] = [
    { id: '1-1', title: 'Finalize Landing Page', completed: false, dueDate: '2024-06-10' },
    { id: '1-2', title: 'Bug Fixes', completed: true, dueDate: '2024-06-11' },
    { id: '1-3', title: 'Invite Friends', completed: false, dueDate: '2024-06-12' },
  ]
  const groupName = 'google people';

  const [subtodos, setSubtodos] = useState(subExamples)
  const [masterTodo, setMasterTodo] = useState({ id: '1', title: 'Master Todo', completed: false, dueDate: '2025-06-10' });
  const [currSubTodoId, setCurrSubTodoId] = useState('1-1');
  const [dueDate, setDueDate] = useState(new Date());
  const [completed, setCompleted] = useState(false);
  const [isRepeatOpen, setIsRepeatOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState(location); // holds edits while editing
  const [privacySetting, setPrivacySetting] = useState<PrivacySetting>('private');

const [showAdvanced, setShowAdvanced] = useState(false);
const [showPrivacyViewer, setShowPrivacyViewer] = useState(false);

const visibleUsers = [
  { id: 1, name: 'Alice', avatar: images.googleLogo },
  { id: 2, name: 'Bob', avatar: images.googleLogo },
  { id: 3, name: 'Charlie', avatar: images.googleLogo },
];



  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const isToday = dueDate?.toDateString() === now.toDateString();
  const isTomorrow = dueDate?.toDateString() === tomorrow.toDateString();
  const isOverdue = dueDate && dueDate < now;
  const daysLeft = dueDate ? Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24)) : null;

  useEffect(() => {
    const currentSubtodo = subtodos.find(subtodo => subtodo.id === currSubTodoId);
    if (currentSubtodo) {
      setTitle(currentSubtodo.title);
      setDueDate(currentSubtodo.dueDate ? new Date(currentSubtodo.dueDate) : new Date());
      setCompleted(currentSubtodo.completed);
    }
  }, [currSubTodoId, subtodos]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle); // Only update local state
  };

  const saveAllChange = () => {
    if (currSubTodoId === masterTodo.id) {
      setMasterTodo(prev => ({ ...prev, title: title, dueDate: dueDate.toISOString() }));
    } else {
      setSubtodos(prev =>
        prev.map(subtodo =>
          subtodo.id === currSubTodoId ? { ...subtodo, title: title, dueDate: dueDate.toISOString() } : subtodo
        )
      );
    }
  };



  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={[styles.card, { borderLeftColor: color }]}>
        {/* <ScrollView
      style={{ maxHeight: '100%' }} 
      showsVerticalScrollIndicator={false}
      persistTaps="handled"
    > */}
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" type="ionicon" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setIsEditing(!isEditing); saveAllChange() }}>
              <Icon name={isEditing ? 'checkmark' : "create-outline"} type="ionicon" />
            </TouchableOpacity>
          </View>

          {/* Title */}
          {isEditing ? (
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={handleTitleChange}
            />
          ) : (
            <Text style={styles.title}>{title}</Text>
          )}

          {/* Group Subtitle */}
          <Text style={styles.groupTitle}>{groupName}</Text>




           {/* Time */}
           <View style={styles.detailBox}>
            {/* <Icon name="time-outline" type="ionicon" size={20} /> */}




            <View style={{...styles.detailBox, marginVertical: 0}}>
              <Icon name="time-outline" type="ionicon" size={20} />
              {/* <Text style={{...styles.detailText, marginLeft: 0, flex: 0, fontWeight: '500', marginRight: -10}}>Due: </Text> */}

              {isEditing ? (
                <DateTimePicker
                  value={dueDate}
                  mode="datetime"
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setDueDate(selectedDate);
                  }}
                />
              ) : (
                <Text
                  style={{
                    ...styles.detailText,
                    color: completed
                      ? 'green'
                      : isOverdue
                        ? 'red'
                        : 'black',
                  }}
                >
                  {dueDate ? (
                    completed ? (
                      'Completed'
                    ) : isToday ? (
                      'Due Today at ' +
                      dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    ) : isTomorrow ? (
                      'Due Tomorrow at ' +
                      dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    ) : isOverdue ? (
                      'Overdue (Due ' + dueDate.toLocaleDateString() + ')'
                    ) : (
                      'Due in ' + daysLeft + ' days'
                    )
                  ) : (
                    'Backlogged Task'
                  )}
                </Text>
              )}
            </View>
            </View>


            {/* Location Search (opens upward) - lower on screen */}
          <View style={{ zIndex: !isRepeatOpen ? 4000 : 1000, marginBottom: 10 }} className="flex flex-row items-center">
            <Icon name="location-outline" type="ionicon" size={20} />
            {isEditing ? (
              <LocationSearch
                setTempLocation={setTempLocation}
                tempLocation={location}
              />
            ) : location ? (
              <Text style={{ ...styles.detailText }}>{location}</Text>
            ) : (
              <Text style={{ ...styles.detailText, color: '#888' }}>No location set</Text>
            )}
          </View>

            <Text className = 'font-semibold mb-[-5] text-lg'>Progress:</Text>

          <SubtodoTimeline
            currSubtodoId={currSubTodoId}
            setCurrSubTodoId={setCurrSubTodoId}
            masterTodo={masterTodo}
            setMasterTodo={setMasterTodo}
            subtodos={subtodos}
            setSubtodos={setSubtodos}
            isEditing={isEditing}
            onClose={onClose}
          />



         
      


          {/* Color Picker */}
          {isEditing && (
            <View>
              <Text style={{ fontWeight: '600', marginTop: 10 }}>Select Priority:</Text>
              <View style={styles.colorRow}>
                {["#66C7C5", "#FFD56B", "#FF9E6D", "#FF607F", "#FF3B3B"].map((c, idx) => (
                  <TouchableOpacity key={idx} onPress={() => setColor(c)} style={[styles.colorDot, { backgroundColor: c, borderWidth: c === color ? 2 : 0 }]} />
                ))}
              </View>
            </View>
          )}

           {/* Privacy */}

           <Modal visible={showPrivacyViewer} animationType="slide" transparent>
  <View style={inviteStyles.overlay}>
    <View style={inviteStyles.modal}>
      <Text style={inviteStyles.title}>Who Can View This</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {visibleUsers.map(user => (
          <View key={user.id} style={inviteStyles.userRow}>
            <Image source={images.googleLogo} style={inviteStyles.avatar} />
            <Text style={inviteStyles.userName}>{user.name}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={() => setShowPrivacyViewer(false)} style={inviteStyles.closeButton}>
        <Text style={{ color: '#fff' }}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>









           <View style={{marginBottom: 2 }}>
  <Text style={{ fontWeight: 'bold'}}>Privacy (Same for All Subtodos):</Text>
  {isEditing ? (
    <>
      {/* Basic Options */}
      <RadioOption
        icon="🔒"
        label="Private"
        value="private"
        selected={privacySetting === 'private'}
        onPress={setPrivacySetting}
      />
      <RadioOption
        icon="🧍‍♂️"
        label="Close Friends"
        value="closeFriends"
        selected={privacySetting === 'closeFriends'}
        onPress={setPrivacySetting}
      />
      <RadioOption
        icon="🌍"
        label="Followers"
        value="followers"
        selected={privacySetting === 'followers'}
        onPress={setPrivacySetting}
      />

      {/* Advanced Toggle */}
      <TouchableOpacity onPress={() => setShowAdvanced(!showAdvanced)} style={{ marginVertical: 6 }}>
        <Text style={{ fontWeight: '500', color: '#555' }}>
          {showAdvanced ? '▼ Hide Advanced' : '▶ Show Advanced'}
        </Text>
      </TouchableOpacity>

      {showAdvanced && (
        <>
          <RadioOption
            icon="🗂️"
            label="Category-Based (Close Friends Only)"
            value="categoryCF"
            selected={privacySetting === 'categoryCF'}
            onPress={setPrivacySetting}
          />
          <RadioOption
            icon="🗂️"
            label="Category-Based (Followers Only)"
            value="categoryFollowers"
            selected={privacySetting === 'categoryFollowers'}
            onPress={setPrivacySetting}
          />
        </>
      )}
    </>
  ) : (
    // View Mode
    <TouchableOpacity onPress={() => setShowPrivacyViewer(true)} style={styles.detailBox}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
      <Text style={{ fontSize: 18, marginRight: 8 }}>
        {{
          private: '🔒',
          closeFriends: '🧍‍♂️',
          followers: '🌍',
          categoryCF: '🗂️',
          categoryFollowers: '🗂️',
        }[privacySetting]}
      </Text>
      <Text style={{ fontSize: 16 }}>
        {{
          private: 'Private',
          closeFriends: 'Close Friends',
          followers: 'Followers',
          categoryCF: 'Categories (CF Only)',
          categoryFollowers: 'Categories (Followers)',
        }[privacySetting]}
      </Text>
    </View>
    </TouchableOpacity>
  )}



</View>
















          {/* Category Selection */}
          {isEditing && (
            <View style={styles.categoryPicker}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Add Categories:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {allCategories.map((cat, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => toggleCategory(cat)}
                    style={[styles.tag, { backgroundColor: categories.includes(cat) ? '#add8e6' : '#eee' }]}>
                    <Text>{cat}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => console.log('add/edit categoriy')}
                  style={[styles.tag, { borderColor: '#000', borderWidth: 1 }]}>
                  <Text>Add/Edit Categories</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}

         

          {/* Categories */}
          {!isEditing && categories.length !== 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Categories:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Text style={{ fontSize: 16 }}>
                  {categories.join(', ')}
                </Text>
              </ScrollView>
            </View>
          )}


{!completed  && !isEditing? (
  <TouchableOpacity
    onPress={() => console.log('go to complete page')}
    style={{
      marginTop: 15,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 8,
      paddingVertical: 12,
      // backgroundColor: '#f5f5f5',
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }}
  >
    <Text style={{ color: '#444', fontSize: 16, fontWeight: '600' }}>Mark as Done</Text>
  </TouchableOpacity>
) : null}

{completed  && !isEditing? (
  <TouchableOpacity
    onPress={() => console.log('go to complete page')}
    style={{
      marginTop: 15,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 8,
      paddingVertical: 12,
      // backgroundColor: '#f5f5f5',
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }}
  >
    <Text style={{ color: '#444', fontSize: 16, fontWeight: '600' }}>View Ripple</Text>
  </TouchableOpacity>
) : null}


{/* </ScrollView> */}
        </View>


        
      </View>
      
    </Modal>
  );
}

function TimeDropdown({ time, setTime }: { time: string; setTime: (val: string) => void }) {
  const [hour, minute, period] = parseTime(time);

  const updateTime = (newHour: string, newMinute: string, newPeriod: string) => {
    setTime(`${newHour}:${newMinute} ${newPeriod}`);
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Picker
        selectedValue={hour}
        style={{ height: 40, width: 60 }}
        onValueChange={(itemValue) => updateTime(itemValue, minute, period)}
      >
        {Array.from({ length: 12 }, (_, i) => {
          const val = (i + 1).toString().padStart(2, '0');
          return <Picker.Item key={val} label={val} value={val} />;
        })}
      </Picker>
      <Text>:</Text>
      <Picker
        selectedValue={minute}
        style={{ height: 40, width: 60 }}
        onValueChange={(itemValue) => updateTime(hour, itemValue, period)}
      >
        {['00', '15', '30', '45'].map((m) => (
          <Picker.Item key={m} label={m} value={m} />
        ))}
      </Picker>
      <Picker
        selectedValue={period}
        style={{ height: 40, width: 60 }}
        onValueChange={(itemValue) => updateTime(hour, minute, itemValue)}
      >
        <Picker.Item label="AM" value="AM" />
        <Picker.Item label="PM" value="PM" />
      </Picker>
    </View>
  );
}

function TimePickerDropdown({ time, setTime }: { time: string; setTime: (val: string) => void }) {
  const [hour, minute, period] = parseTime(time);

  const updateTime = (newHour: string, newMinute: string, newPeriod: string) => {
    setTime(`${newHour}:${newMinute} ${newPeriod}`);
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Picker
        selectedValue={hour}
        style={{ height: 40, width: 60 }}
        onValueChange={(value) => updateTime(value, minute, period)}
      >
        {Array.from({ length: 12 }, (_, i) => {
          const h = (i + 1).toString().padStart(2, '0');
          return <Picker.Item key={h} label={h} value={h} />;
        })}
      </Picker>
      <Text>:</Text>
      <Picker
        selectedValue={minute}
        style={{ height: 40, width: 60 }}
        onValueChange={(value) => updateTime(hour, value, period)}
      >
        {['00', '15', '30', '45'].map((m) => (
          <Picker.Item key={m} label={m} value={m} />
        ))}
      </Picker>
      <Picker
        selectedValue={period}
        style={{ height: 40, width: 60 }}
        onValueChange={(value) => updateTime(hour, minute, value)}
      >
        <Picker.Item label="AM" value="AM" />
        <Picker.Item label="PM" value="PM" />
      </Picker>
    </View>
  );
}

function parseTime(time: string): [string, string, string] {
  const match = time.match(/(\d{1,2}):(\d{2}) ?(AM|PM)?/i);
  if (!match) return ['12', '00', 'AM'];
  let [, h, m, p] = match;
  h = h.padStart(2, '0');
  p = (p || (parseInt(h) >= 12 ? 'PM' : 'AM')).toUpperCase();
  return [h, m, p];
}



const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    width: '90%',
    maxHeight: '90%',
    borderRadius: 25,
    padding: 20,
    borderLeftWidth: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 10,
  }, groupTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#555',
    marginBottom: 5,
    marginTop: -5
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tagContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  tagText: {
    fontWeight: 'bold',
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: -10,
  },
  moreAvatar: {
    backgroundColor: '#e3e3e3',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  moreText: {
    fontWeight: 'bold',
  },
  detailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  detailText: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },
  inlineInput: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    width: 60,
    fontSize: 16,
    textAlign: 'center',
  },
  colorRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  colorDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  categoryPicker: {
    marginTop: 10,
  },
});


type PrivacySetting = 'private' | 'closeFriends' | 'followers' | 'categoryCF' | 'categoryFollowers';

const RadioOption = ({
  icon,
  label,
  value,
  selected,
  onPress
}: {
  icon: string;
  label: string;
  value: PrivacySetting;
  selected: boolean;
  onPress: (val: PrivacySetting) => void;
}) => (
  <TouchableOpacity
    onPress={() => onPress(value)}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    }}
  >
    <Text style={{ fontSize: 18, marginRight: 10 }}>{icon}</Text>
    <Text style={{ fontSize: 16, flex: 1 }}>{label}</Text>
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#444',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {selected && (
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: '#444',
          }}
        />
      )}
    </View>
  </TouchableOpacity>
);


const inviteStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  }, inviteButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#444',
    borderWidth: 1,
    borderRadius: 8,
  },

  inviteButtonText: {
    color: numbers.primaryColor,
    fontWeight: 'bold',
    fontSize: 14,
  }, invitePill: {
    backgroundColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginLeft: 4,
  },

  inviteText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },


});

