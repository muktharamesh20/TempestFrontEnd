import { supabase } from '@/constants/supabaseClient';
import { deleteTodo } from '@/services/myCalendar';
import { TodoDetails } from '@/services/utils';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, isBefore, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';

interface Mastertodo {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export default function SubtodoTimeline({
  currSubtodoId,
  setCurrSubTodoId,
  masterTodo,
  setMasterTodo,
  subtodos,
  setSubtodos,
  isEditing,
  onClose,
}: {
  currSubtodoId: string;
  setCurrSubTodoId: React.Dispatch<React.SetStateAction<string>>;
  masterTodo: Mastertodo;
  setMasterTodo: React.Dispatch<Mastertodo>;
  subtodos: TodoDetails[];
  setSubtodos: React.Dispatch<React.SetStateAction<TodoDetails[]>>;
  isEditing: boolean;
  onClose: () => void;
}) {
  const toggleSubtodo = (id: string) => {
    setSubtodos(prev =>
      prev.map(st => (st.id === id ? { ...st, datetime_completed: st.datetime_completed ? st.datetime_completed : (new Date()).toISOString() } : st))
    );
  };

  const [showAddModal, setShowAddModal] = useState(false);
const [newSubTitle, setNewSubTitle] = useState('');
const [newSubDueDate, setNewSubDueDate] = useState<Date | null>(null);
const [showDatePicker, setShowDatePicker] = useState(false);
const [color, setColor] = useState('#66C7C5'); // Default color


//   const addSubtodo = () => {
//     const newSub = {
//       id: Date.now().toString(),
//       title: '',
//       completed: false,
//       dueDate: '',
//     };
//     setSubtodos(prev => [...prev, newSub]);
//   };

  const removeSubtodo = (id: string) => {
    setSubtodos(prev => prev.filter(st => st.id !== id));
  };

  const removeMasterTodo = (id: string) => {
    Alert.alert(
      'Are you sure you would like to delete this todo?',
      'Deleting this todo will also delete all sub-todos.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTodo(id, supabase).then(onClose);
          },
        },
      ],
      { cancelable: true }
    );
  };
  

  const updateTitle = (id: string, title: string) => {
    setSubtodos(prev =>
      prev.map(st => (st.id === id ? { ...st, title } : st))
    );
  };

  useEffect(() => {
    if (!subtodos.every(st => st.datetime_completed)) {
      setMasterTodo({ ...masterTodo, completed: false });
    }
  }, [subtodos]);

  // Sort by dueDate (empty dueDates go to the end)
  const sortedSubtodos = [...subtodos].sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  const renderDueDate = (dateStr: string, completed: boolean) => {
    if (!dateStr) return null;
    const parsedDate = parseISO(dateStr);
    const isOverdue = !completed && isBefore(parsedDate, new Date());
    return (
      <Text
        style={{
          marginLeft: 10,
          fontSize: 12,
          color: completed ? '#888' : isOverdue ? '#E53935' : '#555',
        }}
      >
        {format(parsedDate, 'MMM dd yyyy')}
      </Text>
    );
  };

  

  return (
    <View style={{ marginVertical: 10 }}>

{/**Modal woohoooooooooo */}
{showAddModal && (
  <Modal
    transparent
    animationType="fade"
    visible={showAddModal}
    onRequestClose={() => setShowAddModal(false)}
  >
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 12,
          width: '85%',
        }}
      >
        <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 10 }}>
          Add Subtodo
        </Text>

        <TextInput
          placeholder="Subtodo Title"
          value={newSubTitle}
          onChangeText={setNewSubTitle}
          placeholderTextColor={'#999'}
          style={{
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            marginBottom: 12,
          }}
        />

        {/* <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: newSubDueDate ? '#000' : '#888' }}>
            {newSubDueDate
              ? format(newSubDueDate, 'MMM dd yyyy')
              : 'Select Due Date'}
          </Text>
        </TouchableOpacity> */}

        (
            <View style = {{
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    gap: 4
  }}>
            <Ionicons name="calendar-outline" size={24} color="#555" onPress={() => setShowDatePicker(true)} />
          <DateTimePicker
            mode="datetime"
            value={newSubDueDate || new Date()}
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setNewSubDueDate(selectedDate);
            }}
          />
          </View>
        )

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

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => {
              setShowAddModal(false);
              setNewSubTitle('');
              setNewSubDueDate(null);
            }}
            style={{ marginRight: 15 }}
          >
            <Text style={{ color: '#888' }}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (!newSubTitle.trim()) return;
              const newSub = {
                id: Date.now().toString(),
                title: newSubTitle,
                completed: false,
                soft_deadline_of: newSubDueDate?.toISOString() || '',
              };
              setSubtodos(prev => [...prev, newSub]);
              setNewSubTitle('');
              setNewSubDueDate(null);
              setShowAddModal(false);
            }}
          >
            <Text style={{ color: '#007AFF', fontWeight: '600' }}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)}


      {sortedSubtodos.map(st => (
        <View
          key={st.id}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
        >
          <TouchableOpacity onPress={() => toggleSubtodo(st.id)}>
            <Icon
              name={st.completed ? 'checkmark-circle' : 'ellipse-outline'}
              type="ionicon"
              color={st.completed ? '#4CAF50' : '#aaa'}
              size={22}
            />
          </TouchableOpacity>

          <View style={{ marginLeft: 10, flex: 1 }}>
            {isEditing ? (
              <Text
              style={{
                textDecorationLine: st.completed ? 'line-through' : 'none',
                color: st.completed ? '#888' : '#000',
                fontStyle: currSubtodoId === st.id ? 'italic' : 'normal',
              }}
            >
              {st.title}
            </Text>
            
            ) : (
                <Text
                style={{
                  textDecorationLine: st.completed ? 'line-through' : 'none',
                  color: st.completed ? '#888' : '#000',
                  fontStyle: currSubtodoId === st.id ? 'italic' : 'normal',
                }}
              >
                {st.title}
              </Text>
            )}
          </View>

          {renderDueDate(st.dueDate, st.completed)}

          {isEditing && (
            <TouchableOpacity onPress={() => removeSubtodo(st.id)} style={{ marginLeft: 8 }}>
              <Icon name="close" type="ionicon" color="#999" size={18} />
            </TouchableOpacity>
          )}
        </View>
      ))}

      {/* master todo */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        {subtodos.every(st => st.completed) && !masterTodo.completed ? (
          <TouchableOpacity
            onPress={() => setMasterTodo({ ...masterTodo, completed: true })}
          >
            <Icon
              name={masterTodo.completed ? 'checkmark-circle' : 'ellipse-outline'}
              type="ionicon"
              color={masterTodo.completed ? '#4CAF50' : '#aaa'}
              size={22}
            />
          </TouchableOpacity>
        ) : (
          <View>
            <Icon
              name={masterTodo.completed ? 'checkmark-circle' : 'ellipse-outline'}
              type="ionicon"
              color={masterTodo.completed ? '#4CAF50' : '#aaa'}
              size={22}
            />
          </View>
        )}

        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text
            style={{
              textDecorationLine: masterTodo.completed ? 'line-through' : 'none',
              color: masterTodo.completed ? '#888' : '#000',
              fontWeight: '600',
            }}
          >
            {masterTodo.title}
          </Text>
        </View>

        {renderDueDate(masterTodo.dueDate, masterTodo.completed)}

        {isEditing && (
            <TouchableOpacity onPress={() => removeMasterTodo(masterTodo.id)} style={{ marginLeft: 8 }}>
              <Icon name="close" type="ionicon" color="#999" size={18} />
            </TouchableOpacity>
          )}

      </View>

      {isEditing && (
        <TouchableOpacity
        onPress={() => setShowAddModal(true)}

          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}
        >
          <Icon name="add-circle-outline" type="ionicon" color="#555" />
          <Text style={{ marginLeft: 6, fontWeight: '500' }}>Add Subtodo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
      }, });