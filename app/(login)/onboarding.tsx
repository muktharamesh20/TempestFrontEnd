import { images } from '@/constants/images';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipCard: {
    backfaceVisibility: 'hidden',
    // perspective: 1000, // improves the 3D effect on Android
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  typeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  
});

const TypewriterTextRotator = () => {
  const texts = [
    'lets you be your authentic self',
    'celebrates your everyday effort — not just the highlights',
    'shows the true you — you are what you check off',
    'motivates you to accomplish your goals',
    'allows you to share your day like never before'
  ];

  const colors = [
    '#FFCD7C',
    '#86FFB1',
    '#FF6A76',
    '#DC97FF',
    '#FFF197'

  ]

  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (charIndex < texts[index].length) {
        setDisplayText((prev) => prev + texts[index][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          // Wait before clearing and moving to next
          setDisplayText('');
          setCharIndex(0);
          setIndex((prev) => (prev + 1) % texts.length);
        }, 2000);
      }
    }, 60); // typing speed

    return () => clearInterval(typingInterval);
  }, [charIndex, index]);

  // Cursor blink
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <View style={{ marginTop: -5, alignItems: 'center', width: '80%' }}>
      <Text style={[styles.typeText, { color: colors[index] }]}>
        {displayText}
        <Text style={{ opacity: showCursor ? 1 : 0 }}>|</Text>
      </Text>
    </View>
  );
};

import { TextStyle } from 'react-native';

const baseTextStyle: TextStyle = {
  color: 'white',
  textAlign: 'center',
  fontFamily: 'System', // or your custom font if used elsewhere
};

const Onboarding = () => {
  const router = useRouter();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#3897F2', '#14354E']}
      style={{ flex: 1, alignItems: 'center' }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {isFocused ? <StatusBar style="light" /> : null}

      {/* Help button in upper right */}
      <View style={{
        position: 'absolute',
        top: insets.top + 20,
        right: 20,
        zIndex: 10,
      }}>
        <TouchableOpacity>
          <Text className='text-primary text-lg font-semibold'>Help</Text>
        </TouchableOpacity>
      </View>

      {/** Entire start block */}
      <View
        className="w-full items-center"
        style={{ marginTop: insets.top + 130 }}
      >
        <Image
          source={images.lightening}
          style={{ width: '25%', height: 110, resizeMode: 'contain' }}
        />
        <Image
          source={images.tempest}
          style={{ width: '60%', height: 100, resizeMode: 'contain' }}
        />

        <Text className="py-4 font-bold text-[20px] text-primary w-full text-center">
              The first social media app that
        </Text>
        <TypewriterTextRotator/>
        </View>

        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: insets.bottom + 30,
            alignItems: 'center',
            zIndex: 20,
          }}
        >
          <Link href={'/login'} asChild>
            <TouchableOpacity style={{ width: '80%', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{
                paddingVertical: 16,
                backgroundColor: '#F9F8F5',
                borderRadius: 16,
                fontWeight: 'bold',
                fontSize: 20,
                color: '#14354E',
                width: '100%',
                textAlign: 'center'
              }}>
                Get Started
              </Text>
            </TouchableOpacity>
          </Link>

          {/* Top text */}
          <Text style={{ ...baseTextStyle, fontSize: 18, marginTop: 10, marginBottom: 8, fontWeight: 600 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ textDecorationLine: 'underline', color: 'white', fontWeight: 'bold' }}>
              Log in
            </Link>
          </Text>

          {/* Bottom text */}
          <Text style={{ ...baseTextStyle, fontSize: 9, marginHorizontal: 16, marginTop: 25, width: 200}}>
            By continuing, you agree to the Tempest{' '}
            <Link href="https://google.com" style={{ textDecorationLine: 'underline', color: 'white', fontWeight: 'bold' }}>
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="https://google.com" style={{ textDecorationLine: 'underline', color: 'white', fontWeight: 'bold' }}>
              Privacy Policy
            </Link>
          </Text>
        </View>
      
    </LinearGradient>
  );
};

export default Onboarding;