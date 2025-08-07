import { images } from '@/constants/images';
import { Subtodo } from '@/services/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
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

  const [subtodos, setSubtodos] = useState(subExamples)
  const [masterTodo, setMasterTodo] = useState({ id: '1', title: 'Master Todo', completed: false, dueDate: '2025-06-10' });
  const [currSubTodoId, setCurrSubTodoId] = useState('1-1');
  const [dueDate, setDueDate] = useState(new Date());

  useEffect(() => {
    const currentSubtodo = subtodos.find(subtodo => subtodo.id === currSubTodoId);
    if (currentSubtodo) {
      setTitle(currentSubtodo.title);
      setDueDate(currentSubtodo.dueDate ? new Date(currentSubtodo.dueDate) : new Date());
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


          <SubtodoTimeline
            currSubtodoId={currSubTodoId}
            setCurrSubTodoId={setCurrSubTodoId}
            masterTodo={masterTodo}
            setMasterTodo={setMasterTodo}
            subtodos={subtodos}
            setSubtodos={setSubtodos}
            isEditing={isEditing}
          />



          {/* Time */}
          <View style={styles.detailBox}>
            {/* <Icon name="time-outline" type="ionicon" size={20} /> */}




            {isEditing ? (
              <>

                <>
                  <View className='flex flex-row items-center gap-3'>
                    <Icon name="time-outline" type="ionicon" size={20} />
                    <DateTimePicker
                      value={dueDate}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setDueDate(selectedDate || dueDate);
                      }}
                    />
                  </View>
                </>
              </>
            ) : (
              <View className='flex flex-row items-center'>
                <Icon name="time-outline" type="ionicon" size={20} />
                <Text style={styles.detailText}>

                  {dueDate.toDateString()}
                </Text></View>

            )}

          </View>




          {/* Color Picker */}
          {isEditing && (
            <View>
              <Text style={{ fontWeight: '600', marginTop: 10 }}>Select Priority</Text>
              <View style={styles.colorRow}>
                {["#66C7C5", "#FFD56B", "#FF9E6D", "#FF607F", "#FF3B3B"].map((c, idx) => (
                  <TouchableOpacity key={idx} onPress={() => setColor(c)} style={[styles.colorDot, { backgroundColor: c, borderWidth: c === color ? 2 : 0 }]} />
                ))}
              </View>
            </View>
          )}

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
    marginVertical: 10,
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
