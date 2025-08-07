import { images } from '@/constants/images';
import { EventDetailsForNow } from '@/services/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDays } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Icon, Switch } from 'react-native-elements';
import LocationSearch from './mapSearch';

interface eventModalProps {
  visible: boolean;
  onClose: () => void;
  event: EventDetailsForNow | null;
  onSave: (event: EventDetailsForNow | null) => void;
}

const allCategories = ['Work', 'UI', 'Design', 'Engineering', 'Marketing', 'Research', 'Meeting'];
const avatars = [images.googleLogo, images.googleLogo, images.googleLogo];

export default function EventModal({ visible, onClose, event, onSave }: eventModalProps) {
  const [open, setOpen] = useState(false);
  const [repeatValue, setRepeatValue] = useState('None');
const [isRepeatOpen, setIsRepeatOpen] = useState(false);
const [endRepeat, setEndRepeat] = useState<Date | undefined>(undefined);
const [days, setDays] = useState<number[] | undefined>(undefined);
const [isAllDay, setIsAllDay] = useState<boolean>(false);
const [title, setTitle] = useState(event?.title || '');
const [categories, setCategories] = useState(['Work']);
const [location, setLocation] = useState('London, Red Meeting Room');
const [color, setColor] = useState('#FFD700');
const [isEditing, setIsEditing] = useState(false);
const [startDate, setStartDate] = useState(new Date());
const [endDate, setEndDate] = useState(new Date());
const [startTime, setStartTime] = useState(new Date());
const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 90 * 60000));
const [showStartPicker, setShowStartPicker] = useState(false);
const [showEndPicker, setShowEndPicker] = useState(false);
const [selectedDay, setSelectedDay] = useState<number>(startDate.getDay())
const [tempLocation, setTempLocation] = useState(location); // holds edits while editing

useEffect(() => {
  if (isAllDay) {
    const startOfDayUTC = new Date(Date.UTC(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      0, 0, 0
    ));
    const endOfDayUTC = new Date(Date.UTC(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      23, 59, 59
    ));
    setStartTime(startOfDayUTC);
    setEndTime(endOfDayUTC);
  }
}, [isAllDay, startDate, endDate]);

useEffect(() => {
  if (isAllDay) {
    if (repeatValue === 'Weekly' || repeatValue === 'Biweekly') {
      setSelectedDay(startTime.getUTCDay())
      setDays((prev) => {
        if (!(prev?.includes(startTime.getUTCDay()))) {
          return [...(prev || []), startTime.getUTCDay()];
        }
        return prev;
      });
    }
  }
  else {
    if (repeatValue === 'Weekly' || repeatValue === 'Biweekly') {
      console.log('in if statment')
      setSelectedDay(startTime.getDay())
      setDays((prev) => {
        if (!(prev?.includes(startTime.getDay()))) {
          return [...(prev || []), startTime.getDay()];
        }
        return prev;
      });
    }
  }
}, [startTime, repeatValue]);



  const [repeatItems, setRepeatItems] = useState([
    { label: 'None', value: 'None' },
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Biweekly', value: 'Biweekly' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Yearly', value: 'Yearly' },
  ]);
  const repeatOptions = [
    { label: 'None', value: 'none' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Biweekly', value: 'biweekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
  ];
  

  
  


  const toggleCategory = (category: string) => {
    setCategories((prev) =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setRepeatValue(event.repeat_schedule || 'None');
      setColor(event.color || '#FFD700');
    }
  }, [event]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={[styles.card, { borderLeftColor: color }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => { onClose(); setIsEditing(false); }}>
              <Icon name="close" type="ionicon" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              if (isEditing && startTime && endTime) {
                const eventToSave: EventDetailsForNow = {
                  ...event,
                  title,
                  repeat_schedule: repeatValue,
                  color,
                  start: startTime,
                  end: endTime,
                  end_repeat: endRepeat ?? endTime, // fallback to endTime if undefined
                  days: days || [],
                  isAllDay,
                };
                
                onSave(eventToSave);
                setLocation(tempLocation); // finally commit it
                
                // onClose(); <-----------------------uncomment later
              }
              
              setIsEditing(!isEditing);
            }}>
              <Icon name={isEditing ? "checkmark-outline" : "create-outline"} type="ionicon" />
            </TouchableOpacity>
          </View>

          {/* Title */}
          {isEditing ? (
            <TextInput style={styles.titleInput} value={title} onChangeText={setTitle} />
          ) : (
            <Text style={styles.title}>{title}</Text>
          )}


          {/* Avatars */}
          <View style={styles.avatarGroup}>
            {avatars.map((src, idx) => (
              <Image key={idx} source={src} style={styles.avatar} />
            ))}
            <View style={styles.moreAvatar}><Text style={styles.moreText}>35+</Text></View>
          </View>

          {/* Time */}
          <View style={styles.detailBox}>
            {/* <Icon name="time-outline" type="ionicon" size={20} /> */}
      



{isEditing ? (
  <>
    {isAllDay ? (
      <>
      <View className='flex flex-row items-center gap-3'>
      <Icon name="time-outline" type="ionicon" size={20} />
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) setStartDate(selectedDate); setEndDate(addDays(selectedDate ?? new Date(), 1))
          }}
        />
        </View>
      </>
    ) : (
      <>
      <View className='flex flex-col gap-2'>
        <View className='flex flex-row items-center gap-3'>
      <Icon name="time-outline" type="ionicon" size={20} />
        <DateTimePicker
          value={startTime}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) setStartTime(selectedDate);
          }}
        /></View>
        <View className='flex flex-row items-center gap-3'>
        <Icon name="time-outline" type="ionicon" size={20} />
        <DateTimePicker
          value={endTime}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) setEndTime(selectedDate);
          }}
        /></View>
         </View>
      </>
    )}
  </>
) : (
  <View className='flex flex-row items-center'>
      <Icon name="time-outline" type="ionicon" size={20} />
  <Text style={styles.detailText}>
  {isAllDay ? (
    `${startDate.toDateString()}`
  ) : startDate.toDateString() === endDate.toDateString() ? (
    `${startDate.toDateString()} · ${startTime.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })} – ${endTime.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })}`
  ) : (
    `${startTime.toLocaleString()} – ${endTime.toLocaleString()}`
  )}
</Text></View>

)}







          </View>

          {/* Repetition */}
          {/* <View style={styles.detailBox}>
            <Icon name="repeat-outline" type="ionicon" size={20} />
            {isEditing ? (
              <View style={{ flex: 1, marginLeft: 15, zIndex: 1000 }}>
             <DropDownPicker
  open={isRepeatOpen}
  setOpen={setIsRepeatOpen}
  value={repeatValue}
  setValue={(val) => setRepeatValue(val())}
  items={[
    { label: 'None', value: 'None' },
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value:'Weekly' },
    { label: 'Biweekly', value: 'Biweekly'  },
    { label: 'Monthly', value: 'Monthly'  },
    { label: 'Yearly', value: 'Yearly'  },
  ]}
  zIndex={3000}
  zIndexInverse={1000}
  style={{ borderColor: '#ccc' }}
  dropDownContainerStyle={{ borderColor: '#ccc' }}
/>



              </View>
            ) : (
              <Text style={styles.detailText}>
                {{
                  None: 'Does Not Repeat',
                  Daily: 'Repeats Every Day',
                  Weekly: getFrequencyLabel('weekly', days ?? [], startDate, isAllDay),
                  Biweekly: getFrequencyLabel('biweekly', days ?? [], startDate, isAllDay),
                  Monthly: getFrequencyLabel('monthly', days ?? [], startDate, isAllDay),
                  Yearly: getFrequencyLabel('yearly', days ?? [], startDate, isAllDay),
                }[repeatValue]}
              </Text>
            )}
          </View>
      
          {isEditing && (repeatValue === 'Weekly' || repeatValue ==="Biweekly") && (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => {
      //const isStartDay = idx === startDate.getDay();
      const selected = days?.includes(idx);

      return (
        <TouchableOpacity
          key={idx}
          onPress={() => {
            if (idx === selectedDay) return; // Prevent unselecting the start day
            setDays((prev) =>
              selected
                ? prev?.filter((d) => d !== idx)
                : [...(prev || []), idx]
            );
          }}
          style={{
            padding: 7,
            borderRadius: 10,
            margin: 4,
            backgroundColor: selected ? '#add8e6' : '#e3e3e3',
            opacity: selectedDay === idx ? 0.5 : 1, // optional: dim start day for clarity
          }}
        >
          <Text>{day}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
)}
 */}

        {/* Location
<View style={{ zIndex: 10 }} className="flex flex-row items-center mt-1">
  <Icon name="location-outline" type="ionicon" size={20} />

  {isEditing ? (
    <LocationSearch
      setTempLocation={setTempLocation}
      tempLocation={location} // pass current location for initial value
    />
  ) : location ? (
    <Text style={styles.detailText}>{location}</Text>
  ) : (
    <Text style={{...styles.detailText, color: '#888'}}>No location set</Text>
  )}
</View> */}

{/* Location
<View style={{ zIndex: 4000 }} className="flex flex-row items-center mt-1">
  <Icon name="location-outline" type="ionicon" size={20} />
  {isEditing ? (
    <LocationSearch
      setTempLocation={setTempLocation}
      tempLocation={location}
    />
  ) : location ? (
    <Text style={styles.detailText}>{location}</Text>
  ) : (
    <Text style={{ ...styles.detailText, color: '#888' }}>No location set</Text>
  )}
</View> */}



{/* Repeat Dropdown (opens downward) - higher on screen */}
<View style={{...styles.detailBox, zIndex: isRepeatOpen ? 4000 : 1000}}>
   <Icon name="repeat-outline" type="ionicon" size={20} />
   {isEditing ? (
      <View style={{ flex: 1, marginLeft: 15}}>
    
      <DropDownPicker
        open={isRepeatOpen}
        setOpen={setIsRepeatOpen}
        value={repeatValue}
        setValue={(val) => setRepeatValue(val())}
        items={[
          { label: 'None', value: 'None' },
          { label: 'Daily', value: 'Daily' },
          { label: 'Weekly', value: 'Weekly' },
          { label: 'Biweekly', value: 'Biweekly' },
          { label: 'Monthly', value: 'Monthly' },
          { label: 'Yearly', value: 'Yearly' },
        ]}
        zIndex={isRepeatOpen ? 4000 : 1000}
        zIndexInverse={isRepeatOpen ? 1000 : 4000}
        style={{ borderColor: '#ccc' }}
        dropDownContainerStyle={{ borderColor: '#ccc' }}
      />
      </View>
    ) : ( <Text style={styles.detailText}>
      {{
        None: 'Does Not Repeat',
        Daily: 'Repeats Every Day',
        Weekly: getFrequencyLabel('weekly', days ?? [], startDate, isAllDay),
        Biweekly: getFrequencyLabel('biweekly', days ?? [], startDate, isAllDay),
        Monthly: getFrequencyLabel('monthly', days ?? [], startDate, isAllDay),
        Yearly: getFrequencyLabel('yearly', days ?? [], startDate, isAllDay),
      }[repeatValue]}
    </Text>
    )}
</View>


{isEditing && (repeatValue === 'Weekly' || repeatValue ==="Biweekly") && (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => {
      //const isStartDay = idx === startDate.getDay();
      const selected = days?.includes(idx);

      return (
        <TouchableOpacity
          key={idx}
          onPress={() => {
            if (idx === selectedDay) return; // Prevent unselecting the start day
            setDays((prev) =>
              selected
                ? prev?.filter((d) => d !== idx)
                : [...(prev || []), idx]
            );
          }}
          style={{
            padding: 7,
            borderRadius: 10,
            margin: 4,
            backgroundColor: selected ? '#add8e6' : '#e3e3e3',
            opacity: selectedDay === idx ? 0.5 : 1, // optional: dim start day for clarity
          }}
        >
          <Text>{day}</Text>
        </TouchableOpacity>
      );
    })}
  </View>)}
  
{/* Location Search (opens upward) - lower on screen */}
<View style={{ zIndex: !isRepeatOpen ? 4000 : 1000 }} className="flex flex-row items-center mt-1">
  <Icon name="location-outline" type="ionicon" size={20} />
  {isEditing ? (
    <LocationSearch
      setTempLocation={setTempLocation}
      tempLocation={location}
    />
  ) : location ? (
    <Text style={styles.detailText}>{location}</Text>
  ) : (
    <Text style={{ ...styles.detailText, color: '#888' }}>No location set</Text>
  )}
</View>



<View style={styles.detailBox}>


  </View>


          {/* Color Picker */}
          {isEditing && (
            <View style={styles.colorRow}>
              {["#FFD700", "#87CEFA", "#FF69B4", "#98FB98", "#FFA07A"].map((c, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setColor(c)}
                  style={[styles.colorDot, { backgroundColor: c, borderWidth: c === color ? 2 : 0 }]}
                />
              ))}
            </View>
          )}

<View style={styles.detailBox}>
  <Text style={{ marginRight: 10 }}>All Day</Text>
  <Switch
    value={isAllDay}
    onValueChange={isEditing ? setIsAllDay : () => {}}
    disabled={!isEditing}
  />
</View>



          {/* Category Selection */}
          {isEditing && (
            <View style={styles.categoryPicker}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Add Categories:</Text>
              <ScrollView horizontal>
                {allCategories.map((cat, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => toggleCategory(cat)}
                    style={[styles.tag, { backgroundColor: categories.includes(cat) ? '#add8e6' : '#eee' }]}>
                    <Text>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

{!isEditing && (
  <View style={{ marginTop: 10 }}>
    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Categories:</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Text style={{ fontSize: 16 }}>
        {categories.join(', ')}
      </Text>
    </ScrollView>
  </View>
)}

        </View>
      </View>
    </Modal>
  );
}

const getFrequencyLabel = (frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly', days: number[], date: Date, allDay: boolean) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (frequency === 'daily') return 'Repeats Daily';
  if (frequency === 'weekly') return `Weekly on ${days?.sort().map(d => dayNames[d]).join(', ')}`;
  if (frequency === 'biweekly') return `Every Other Week on ${days?.sort().map(d => dayNames[d]).join(', ')}`;
  if (frequency === 'monthly') return `Repeats Monthly`;
  if (frequency === 'yearly') return `Repeats Yearly`;
  return '';
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
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
  },dateGroup: {
    marginVertical: 6,
  },
  
  dateLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  dateLabel: {
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 16,
  },dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  
  icon: {
    marginRight: 10,
  },
  
  datePicker: {
    flex: 1,
  },dateContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  
  iconRow: {
    width: 30,
    alignItems: 'center',
    marginTop: 6,
  },
  
  pickerWrapper: {
    flex: 1,
  },
  
  
  
});
