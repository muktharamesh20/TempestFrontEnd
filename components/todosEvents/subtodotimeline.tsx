import { Subtodo } from '@/services/utils';
import { format, isBefore, parseISO } from 'date-fns';
import { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
}: {
  currSubtodoId: string;
  setCurrSubTodoId: React.Dispatch<React.SetStateAction<string>>;
  masterTodo: Mastertodo;
  setMasterTodo: React.Dispatch<Mastertodo>;
  subtodos: Subtodo[];
  setSubtodos: React.Dispatch<React.SetStateAction<Subtodo[]>>;
  isEditing: boolean;
}) {
  const toggleSubtodo = (id: string) => {
    setSubtodos(prev =>
      prev.map(st => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  const addSubtodo = () => {
    const newSub = {
      id: Date.now().toString(),
      title: '',
      completed: false,
      dueDate: '',
    };
    setSubtodos(prev => [...prev, newSub]);
  };

  const removeSubtodo = (id: string) => {
    setSubtodos(prev => prev.filter(st => st.id !== id));
  };

  const updateTitle = (id: string, title: string) => {
    setSubtodos(prev =>
      prev.map(st => (st.id === id ? { ...st, title } : st))
    );
  };

  useEffect(() => {
    if (!subtodos.every(st => st.completed)) {
      setMasterTodo({ ...masterTodo, completed: false });
    }
  }, [subtodos]);

  // Sort by dueDate (empty dueDates go to the end)
  const sortedSubtodos = [...subtodos].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
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
          <TouchableOpacity
            onPress={() => removeSubtodo(masterTodo.id)}
            style={{ marginLeft: 8 }}
          >
            <Icon name="close" type="ionicon" color="#999" size={18} />
          </TouchableOpacity>
        )}
      </View>

      {isEditing && (
        <TouchableOpacity
          onPress={addSubtodo}
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}
        >
          <Icon name="add-circle-outline" type="ionicon" color="#555" />
          <Text style={{ marginLeft: 6, fontWeight: '500' }}>Add Subtodo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
