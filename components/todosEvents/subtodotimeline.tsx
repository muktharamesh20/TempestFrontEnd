import { Subtodo } from '@/services/utils';
import { useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';

interface Mastertodo {
    id: string;
    title: string;
    completed: boolean;
    dueDate: string;
}

export default function SubtodoTimeline({ currSubtodoId, masterTodo, setMasterTodo, subtodos, setSubtodos, isEditing }: {currSubtodoId: string, masterTodo: Mastertodo, setMasterTodo: React.Dispatch<Mastertodo>, subtodos: Subtodo[], setSubtodos: React.Dispatch<React.SetStateAction<Subtodo[]>>, isEditing: boolean}) {
    const toggleSubtodo = (id: string) => {
        setSubtodos(prev =>
            prev.map(st => st.id === id ? { ...st, completed: !st.completed } : st)
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
            prev.map(st => st.id === id ? { ...st, title } : st)
        );
    };

    useEffect(() => {
        if(!subtodos.every(st => st.completed)) {
            setMasterTodo({ ...masterTodo, completed: false });
        }
    },[subtodos])

    return (
        <View style={{ marginVertical: 10 }}>
            {subtodos.map((st, index) => (
                <View key={st.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
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
                            <TextInput
                                value={st.title}
                                onChangeText={(text) => updateTitle(st.id, text)}
                                placeholder="Subtodo"
                                style={{
                                    borderBottomWidth: 1,
                                    borderColor: '#ccc',
                                    paddingVertical: 2,
                                }}
                            />
                        ) : (
                            <Text style={{
                                textDecorationLine: st.completed ? 'line-through' : 'none',
                                color: st.completed ? '#888' : '#000'
                            }}>
                                {st.title}
                            </Text>
                        )}
                    </View>

                    {isEditing && (
                        <TouchableOpacity onPress={() => removeSubtodo(st.id)}>
                            <Icon name="close" type="ionicon" color="#999" size={18} />
                        </TouchableOpacity>
                    )}
                </View>
            ))}

            {/* master todo */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  {/**If all other todos completed, then master todo can be completed */}
                  { subtodos.every(st => st.completed) && !masterTodo.completed ? 
                  (<TouchableOpacity onPress={() => {console.log('hehe)'); setMasterTodo({...masterTodo, completed: true}); console.log(masterTodo.completed)}}>
                        <Icon
                            name={masterTodo.completed ? 'checkmark-circle' : 'ellipse-outline'}
                            type="ionicon"
                            color={masterTodo.completed ? '#4CAF50' : '#aaa'}
                            size={22}
                        />
                    </TouchableOpacity>):
                    (<View>
                        <Icon
                            name={masterTodo.completed ? 'checkmark-circle' : 'ellipse-outline'}
                            type="ionicon"
                            color={masterTodo.completed ? '#4CAF50' : '#aaa'}
                            size={22}
                        />
                    </View>)}
                    

                    <View style={{ marginLeft: 10, flex: 1 }}> 
                            <Text style={{
                                textDecorationLine: masterTodo.completed ? 'line-through' : 'none',
                                color: masterTodo.completed ? '#888' : '#000',
                                fontWeight: '600'
                            }}>
                                {masterTodo.title}
                            </Text>
                    </View>

                    {isEditing && (
                        <TouchableOpacity onPress={() => removeSubtodo(masterTodo.id)}>
                            <Icon name="close" type="ionicon" color="#999" size={18} />
                        </TouchableOpacity>
                    )}
                </View>

            {isEditing && (
                <TouchableOpacity onPress={addSubtodo} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <Icon name="add-circle-outline" type="ionicon" color="#555" />
                    <Text style={{ marginLeft: 6, fontWeight: '500' }}>Add Subtodo</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
