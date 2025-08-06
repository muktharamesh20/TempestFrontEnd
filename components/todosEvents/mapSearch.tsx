import React, { useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};

type LocationSearchProps = {
    tempLocation: string;
    setTempLocation: (location: string) => void;
  };
  
  const LocationSearch: React.FC<LocationSearchProps> = ({
    tempLocation,
    setTempLocation,
  }) => {
    const [results, setResults] = useState<NominatimResult[]>([]);
  
    const searchLocation = async (text: string) => {
      setTempLocation(text); // update as user types
      if (text.length < 3) {
        setResults([]);
        return;
      }
  
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            text
          )}`
        );
        const data: NominatimResult[] = await response.json();
        setResults(data);
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
    };
  
    return (
      <View style={styles.wrapper}>
        <View style={styles.inputWrapper}>
        <Autocomplete
  data={results}
  defaultValue={tempLocation}
  onChangeText={(a:string) => {searchLocation(a); setTempLocation(a);}}
  inputContainerStyle={styles.inputContainer}
  containerStyle={{ flex: 1 }}
  placeholder={tempLocation || 'Search location...'} // 👈 Dynamic placeholder
  flatListProps={{
    style: styles.dropdownAbove,
    keyExtractor: (_, index) => index.toString(),
    renderItem: ({ item }) => (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          setTempLocation(item.display_name);
          setResults([]);
        }}
      >
        <Text>{item.display_name}</Text>
      </TouchableOpacity>
    ),
  }}
/>

        </View>
      </View>
    );
  };
  
const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  wrapper: {
    // height: 200,
    marginLeft: 8,
    marginVertical: 0,
    zIndex: 10,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 40,
    backgroundColor: '#fff',
  },
  dropdownAbove: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: SCREEN_WIDTH - 32,
    maxHeight: 120,
    zIndex: 20,
  },
  item: {
    padding: 10,
  },
});

export default LocationSearch;
