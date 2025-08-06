import { images } from '@/constants/images';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';


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

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={[styles.card, { borderLeftColor: color }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" type="ionicon" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Icon name="create-outline" type="ionicon" />
            </TouchableOpacity>
          </View>

          {/* Title */}
          {isEditing ? (
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
            />
          ) : (
            <Text style={styles.title}>{title}</Text>
          )}

          {/* Tags */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagContainer}>
            {categories.map((tag, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Avatars */}
          <View style={styles.avatarGroup}>
            {avatars.map((src, idx) => (
              <Image key={idx} source={src} style={styles.avatar} />
            ))}
            <View style={styles.moreAvatar}><Text style={styles.moreText}>35+</Text></View>
          </View>

          {/* Time */}
          <View style={styles.detailBox}>
            <Icon name="time-outline" type="ionicon" size={20} />
            {isEditing ? (
              <>
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <TimePickerDropdown time={startTime} setTime={setStartTime} />
  <Text style={{ marginHorizontal: 5 }}>–</Text>
  <TimePickerDropdown time={endTime} setTime={setEndTime} />
</View>

              </>
            ) : (
              <Text style={styles.detailText}>{`Wed, Jun 9 • ${startTime} – ${endTime}`}</Text>
            )}
          </View>

          {/* Repetition */}
          <View style={styles.detailBox}>
            <Icon name="repeat-outline" type="ionicon" size={20} />
            {isEditing ? (
              <Picker
              selectedValue={repetition}
              style={{ flex: 1 }}
              onValueChange={(value) => setRepetition(value)}
            >
              {['None', 'Daily', 'Weekly', 'Biweekly', 'Monthly', 'Yearly'].map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
            
            ) : (
              <Text style={styles.detailText}>{repetition}</Text>
            )}
          </View>

          {/* Location */}
          <View style={styles.detailBox}>
            <Icon name="location-outline" type="ionicon" size={20} />
            {isEditing ? (
              <TextInput
                style={styles.detailText}
                value={location}
                onChangeText={setLocation}
              />
            ) : (
              <Text style={styles.detailText}>{location}</Text>
            )}
          </View>

          {/* Color Picker */}
          {isEditing && (
            <View style={styles.colorRow}>
              {["#FFD700", "#87CEFA", "#FF69B4", "#98FB98", "#FFA07A"].map((c, idx) => (
                <TouchableOpacity key={idx} onPress={() => setColor(c)} style={[styles.colorDot, { backgroundColor: c, borderWidth: c === color ? 2 : 0 }]} />
              ))}
            </View>
          )}

          {/* Category Selection */}
          {isEditing && (
            <View style={styles.categoryPicker}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Add Categories:</Text>
              <ScrollView horizontal>
                {allCategories.map((cat, idx) => (
                  <TouchableOpacity key={idx} onPress={() => toggleCategory(cat)} style={[styles.tag, { backgroundColor: categories.includes(cat) ? '#add8e6' : '#eee' }]}>
                    <Text>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
