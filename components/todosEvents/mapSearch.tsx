import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
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

const SCREEN_WIDTH = Dimensions.get('window').width;

const LocationSearch: React.FC<LocationSearchProps> = ({
  tempLocation,
  setTempLocation,
}) => {
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [inputText, setInputText] = useState(tempLocation); // for debouncing

  // Debounce effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (inputText.length >= 3) {
        fetchLocation(inputText);
      } else {
        setResults([]);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [inputText]);

  const fetchLocation = async (text: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}`
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
          value={inputText}
          onChangeText={(text: string) => {
            setInputText(text);
            setTempLocation(text); // update shared state
          }}
          inputContainerStyle={styles.inputContainer}
          containerStyle={{ flex: 1 }}
          placeholder={tempLocation || 'Search location...'}
          placeholderTextColor={'#888'}
          flatListProps={{
            style: styles.dropdownAbove,
            keyExtractor: (_, index) => index.toString(),
            renderItem: ({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  setTempLocation(item.display_name);
                  setInputText(item.display_name);
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

const styles = StyleSheet.create({
  wrapper: {
    marginLeft: 12,
    marginRight: 20,
    marginVertical: 0,
    zIndex: 10,
    height: 45,
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
    height: 45,
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
