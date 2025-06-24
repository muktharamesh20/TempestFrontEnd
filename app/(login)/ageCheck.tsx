import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AgeCheck = ({closeFunction}: {closeFunction: Dispatch<SetStateAction<boolean>>}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [day, setDay] = React.useState('1');
  const [month, setMonth] = React.useState('1');
  const [year, setYear] = React.useState('2010');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isOldEnough = (d: number, m: number, y: number) => {
    const today = new Date();
    const birthDate = new Date(y, m - 1, d);
    const age = today.getFullYear() - birthDate.getFullYear();
    const mDiff = today.getMonth() - birthDate.getMonth();
    if (mDiff < 0 || (mDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 13;
    }
    return age >= 13;
  };

  const handleContinue = async () => {
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);

    if (!isOldEnough(d, m, y)) {
      Alert.alert('You must be at least 13 years old to use this app.');
      return;
    }

    // try {
    //   await AsyncStorage.setItem('birthday', JSON.stringify({ day: d, month: m, year: y }));
    //   //onClose(); // Close modal
      closeFunction(false);
      router.navigate('/signUp');
    // } catch (e) {
    //   Alert.alert('Error', 'Failed to save birthday.');
    // }
  };

  const renderPickerItems = (range: number[]) =>
    range.map((val) => <Picker.Item key={val} label={val.toString()} value={val.toString()} />);

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.6)', opacity: fadeAnim, justifyContent: 'center', alignItems: 'center', zIndex: 20 }]}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '90%', borderRadius: 20, overflow: 'hidden' }}>
        <LinearGradient
          colors={['#3897F2', '#14354E']}
          style={{
            justifyContent: 'flex-end',
            paddingBottom: 30,
            paddingTop: 30,
            paddingLeft: 20,
            paddingRight: 20,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="flex-row justify-center items-center gap-3">
            <Text style={styles.title}>Please Enter Your Birthdate</Text>
            <FontAwesome name="birthday-cake" size={20} color="#F9F8F5" style={{ marginBottom: 22 }} />
          </View>

          <View style={styles.dropdownRow}>
            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={month}
                style={styles.dropdown}
                itemStyle={styles.dropdownItem}
                onValueChange={(itemValue) => setMonth(itemValue)}
                mode="dropdown"
              >
                {renderPickerItems([...Array(12).keys()].map((i) => i + 1))}
              </Picker>
            </View>

            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={day}
                style={styles.dropdown}
                itemStyle={styles.dropdownItem}
                onValueChange={(itemValue) => setDay(itemValue)}
                mode="dropdown"
              >
                {renderPickerItems([...Array(31).keys()].map((i) => i + 1))}
              </Picker>
            </View>

            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={year}
                style={styles.dropdown}
                itemStyle={styles.dropdownItem}
                onValueChange={(itemValue) => setYear(itemValue)}
                mode="dropdown"
              >
                {renderPickerItems([...Array(100).keys()].map((i) => new Date().getFullYear() - i))}
              </Picker>
            </View>
          </View>

          <View className="w-[100%] items-center justify-center">
            <TouchableOpacity
              style={{ width: '80%', alignItems: 'center', justifyContent: 'center' }}
              onPress={handleContinue}>
              <Text style={{
                paddingVertical: 12,
                backgroundColor: '#F9F8F5',
                borderRadius: 16,
                fontWeight: 'bold',
                fontSize: 20,
                color: '#14354E',
                width: '100%',
                textAlign: 'center'
              }}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>

          <View className="w-[100%] items-center justify-center">
            <TouchableOpacity
              style={{ width: '80%', alignItems: 'center', justifyContent: 'center' }}
              onPress={(()=>closeFunction(false))}>
              <Text style={{
                paddingVertical: 12,
                marginTop:12,
                backgroundColor: '#F9F8F5',
                borderRadius: 16,
                fontWeight: 'bold',
                fontSize: 20,
                color: '#14354E',
                width: '100%',
                textAlign: 'center'
              }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: '#F9F8F5',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  dropdownWrapper: {
    flex: 1,
    marginHorizontal: 2,
    backgroundColor: '#1A466B',
    borderRadius: 10,
    overflow: 'hidden',
  },
  dropdown: {
    height: 100,
    color: '#F9F8F5',
    justifyContent: 'center',
  },
  dropdownItem: {
    fontSize: 16,
    color: '#F9F8F5',
  },
});

export default AgeCheck;
