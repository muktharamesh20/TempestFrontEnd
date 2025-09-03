import { supabase } from '@/constants/supabaseClient';
import { connectGoogleAccount, importFromICal } from '@/services/importCalendars';
import { CalendarSource } from '@/services/utils';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  calendars: CalendarSource[];
  onUpdateCalendars: (newCalendars: CalendarSource[]) => void;
}

import * as types from '@/services/utils';
import { useState } from 'react';
import { Alert, Button, TextInput } from 'react-native';

interface PasteCalendarProps {
  platform: 'canvas' | 'blackboard' | 'ical';
  onAdd: (source: types.CalendarSource) => void;
  color?: string;
}

export const PasteCalendar: React.FC<PasteCalendarProps> = ({ platform, onAdd, color }) => {
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (!value) return Alert.alert('Error', 'Please paste a token or calendar URL.');

    const newSource: types.CalendarSource = {
      id: Date.now().toString(),
      type: platform,
      name: platform.charAt(0).toUpperCase() + platform.slice(1),
      color: color || '#999',
      isEnabled: true,
      authToken: value, // For Canvas/Blackboard: user token. For iCal: URL.
      calendarId: platform === 'ical' ? value : '', 
    };

    onAdd(newSource);
    setValue('');
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <Text>Paste {platform} token or calendar URL:</Text>
      <TextInput
        placeholder="Paste here"
        value={value}
        onChangeText={setValue}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 5, borderRadius: 6 }}
      />
      <Button title={`Add ${platform}`} onPress={handleAdd} />
    </View>
  );
};


export default function ConnectedCalendarsModal({ visible, onClose, calendars, onUpdateCalendars }: Props) {
  const platforms: CalendarSource['type'][] = ['google','canvas','blackboard','gclassroom','ical','supabase','todowork'];

  const handleAddCalendar = async (platform: CalendarSource['type']) => {
    if (platform === 'google') {
      try {
        const user = await supabase.auth.getUser();
        if (!user.data.user) return;
  
        const newSource = await connectGoogleAccount();
  
        //onUpdateCalendars([...calendars, newSource]);
  
        // Fetch events immediately and log them
        try {
          //const events = await importFromSource(newSource);
          //console.log(`Imported events from Google:`, events);
        } catch (err) {
          console.error('Failed to import Google events:', err);
        }
  
      } catch (err) {
        console.error('Failed to connect Google account:', err);
      }
    }
  
    if (platform === 'canvas' || platform === 'blackboard' || platform === 'ical') {
      Alert.prompt(
        `Add ${platform} calendar`,
        platform === 'ical'
          ? 'Paste iCal URL'
          : 'Paste Canvas/Blackboard token',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Add',
            onPress: async (value) => {
              if (!value) return;
  
              const newSource: CalendarSource = {
                id: Date.now().toString(),
                type: platform,
                name: platform.charAt(0).toUpperCase() + platform.slice(1),
                color: platform === 'ical' ? '#999' : '#ff6f61',
                isEnabled: true,
                authToken: value,
                calendarId: platform === 'ical' ? value : '',
              };
  
              onUpdateCalendars([...calendars, newSource]);
  
              // Immediately fetch events and log them
              try {
                //const events = await importFromSource(newSource);
                const events = await importFromICal(newSource);
                console.log(`Imported events from ${platform}:`, events);
              } catch (err) {
                console.error(`Failed to import ${platform} events:`, err);
                console.log(newSource)
              }
            },
          },
        ],
        'plain-text'
      );
    }
  };
  
  

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white w-11/12 p-4 rounded max-h-3/4">
          <Text className="text-xl font-bold mb-2">Connected Calendars</Text>
          <ScrollView>
            {platforms.map(platform => {
              const platformCalendars = calendars.filter(c => c.type === platform);
              return (
                <View key={platform} className="mb-4">
                  <Text className="font-semibold mb-1">{platform.toUpperCase()}</Text>
                  {platformCalendars.map(cal => (
                    <Text key={cal.id} className="pl-2">• {cal.name}</Text>
                  ))}
                  <TouchableOpacity onPress={() => handleAddCalendar(platform)} className="mt-1">
                    <Text className="text-blue-500 font-bold">+ Add {platform} calendar</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
          <TouchableOpacity onPress={onClose} className="mt-4">
            <Text className="text-red-500 font-bold text-center">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
