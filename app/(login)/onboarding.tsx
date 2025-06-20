import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text } from 'react-native';

const Onboarding = () => {
  return (
    <LinearGradient
      colors={['#4f8cff', '#a6ffcb']} // Change these to your desired colors
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={{ color: 'white', fontSize: 24 }}>onboarding</Text>
    </LinearGradient>
  );
};

export default Onboarding;