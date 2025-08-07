import { numbers } from '@/constants/numbers'
import { supabase } from '@/constants/supabaseClient'
import { signOut } from '@/services/auth'
import { Router, useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SettingsHeader from './settingsHeader'

type SettingOption = {
  label: string
  icon: string
  section: string,
  pressFunction: (router: Router) => void;
}

const settingsData: SettingOption[] = [
  // Activity
  {
    label: 'Saved',
    icon: 'bookmark-outline',
    section: 'Your Activity',
    pressFunction: (router) => router.push('/settings/saved'),
  },
  {
    label: 'Liked',
    icon: 'heart-outline',
    section: 'Your Activity',
    pressFunction: (router) => router.push('/settings/liked'),
  },
  {
    label: 'Archived',
    icon: 'archive-outline',
    section: 'Your Activity',
    pressFunction: (router) => router.push('/settings/archived'),
  },
  {
    label: 'Recently Viewed',
    icon: 'time-outline',
    section: 'Your Activity',
    pressFunction: (router) => router.push('/settings/recentlyViewed'),
  },

  // Categories
  {
    label: 'Manage Categories',
    icon: 'albums-outline',
    section: 'Categories',
    pressFunction: () => console.log('Manage Categories pressed'),
  },
  {
    label: 'View Categories',
    icon: 'eye-outline',
    section: 'Categories',
    pressFunction: () => console.log('View Categories pressed'),
  },

  // Account & Privacy
  {
    label: 'Notification Settings',
    icon: 'notifications-outline',
    section: 'Account & Privacy',
    pressFunction: () => console.log('Notification Settings pressed'),
  },
  {
    label: 'Account Privacy',
    icon: 'lock-closed-outline',
    section: 'Account & Privacy',
    pressFunction: () => console.log('Account Privacy pressed'),
  },
  {
    label: 'Close Friends',
    icon: 'people-outline',
    section: 'Account & Privacy',
    pressFunction: () => console.log('Close Friends pressed'),
  },
  {
    label: 'Blocked Users',
    icon: 'remove-circle-outline',
    section: 'Account & Privacy',
    pressFunction: () => console.log('Blocked Users pressed'),
  },
  {
    label: 'Account Center',
    icon: 'settings-outline',
    section: 'Account & Privacy',
    pressFunction: () => console.log('Account Center pressed'),
  },

  // Support
  {
    label: 'Help',
    icon: 'help-circle-outline',
    section: 'Support',
    pressFunction: () => console.log('Help pressed'),
  },

  // Danger Zone
  {
    label: 'Sign Out',
    icon: 'log-out-outline',
    section: 'Danger Zone',
    pressFunction: (router) =>
      signOut(supabase)
  },
  {
    label: 'Delete Account',
    icon: 'trash-outline',
    section: 'Danger Zone',
    pressFunction: () => console.log('Delete Account pressed'),
  },
]




const Settings = () => {
  const [search, setSearch] = useState('')
  const router = useRouter();

  const filteredSettings = settingsData.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  )

  const groupedSettings = filteredSettings.reduce<Record<string, SettingOption[]>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = []
    acc[item.section].push(item)
    return acc
  }, {})

  return (
    <View style={styles.container}>
      {/* Header */}

      <SettingsHeader headerName='Settings' />
      {/* <Text style={styles.header}>Settings</Text> */}

      {/* Search Input */}
      {/* Search Input with Divider */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search settings..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.searchDivider} />
      </View>


      {/* Scrollable Settings List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {Object.keys(groupedSettings).map((section) => (
          <View key={section}>
            <Text style={styles.sectionTitle}>{section}</Text>
            {groupedSettings[section].map(({ label, icon, pressFunction }) => (
              <TouchableOpacity key={label} style={styles.item} onPress={() => pressFunction(router)}>
                <Ionicons name={icon} size={20} color="#444" style={styles.icon} />
                <Text style={styles.itemText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: numbers.primaryColor,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    color: '#222',
  },
  searchInput: {
    marginHorizontal: 16,
    //marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: numbers.secondaryColor,
    fontSize: 15,
    color: '#ffffff',
  },
  scrollContent: {
    marginTop: -2,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
    color: '#555',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  icon: {
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  itemText: {
    fontSize: 15,
    color: '#000',
  }, searchWrapper: {
    //marginHorizontal: 16,
    marginTop: 12,
  },
  searchDivider: {
    height: 1,
    backgroundColor: '#e4e4e4', // or numbers.dividerColor if you have it
    marginTop: 4,
  },

})

export default Settings
