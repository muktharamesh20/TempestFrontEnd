import { images } from '@/constants/images';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Image, Modal, StyleSheet, Text, TouchableOpacity, View
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
    'celebrates your everyday — not just the highlights',
    'shows the true you — you are what you check off',
    'motivates you to accomplish your goals',
    'allows you to share your day like never before',
    'gives you fine-grain control over your privacy'
  ];

  const colors = [
    '#FFCD7C',
    '#86FFB1',
    '#FF6A76',
    '#DC97FF',
    '#FFF197'
  ];

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
          setDisplayText('');
          setCharIndex(0);
          setIndex((prev) => (prev + 1) % texts.length);
        }, 2000);
      }
    }, 60);
    return () => clearInterval(typingInterval);
  }, [charIndex, index]);

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
import AgeCheck from './ageCheck';

const baseTextStyle: TextStyle = {
  color: 'white',
  textAlign: 'center',
  fontFamily: 'System',
};

const Onboarding = () => {
  const router = useRouter();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [ageCheckVisible, setAgeCheckVisible] = useState(false);

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
        top: insets.top + 15,
        right: 20,
        zIndex: 10,
      }}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text className='text-primary text-lg font-semibold'>Help</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={ageCheckVisible}
        transparent
      >
        <AgeCheck closeFunction={setAgeCheckVisible} />
      </Modal>

      {/* Help Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#F9F8F5',
            padding: 24,
            borderRadius: 20,
            width: '85%',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 12,
              color: '#14354E',
              textAlign: 'center',
            }}>
              Need help?
            </Text>
            <Text style={{
              fontSize: 15,
              color: '#14354E',
              textAlign: 'center',
              marginBottom: 20
            }}>
              Tempest is here to support your journey. If you need assistance, reach out anytime at support@tempest.com.
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{
                color: '#3897F2',
                fontWeight: 'bold',
                fontSize: 16
              }}>
                Got it
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Main content */}
      <View
        className="w-full items-center"
        style={{ marginTop: insets.top + 130 }}
      >
        <Image
          source={images.lightening}
          style={{ width: '25%', height: 110, resizeMode: 'contain' }}
        />
        <Image
          source={images.whiteTempest}
          style={{ width: '60%', height: 100, resizeMode: 'contain' }}
        />

        <Text className="py-4 font-bold text-[20px] text-primary w-full text-center">
          The social media app that
        </Text>
        <TypewriterTextRotator />
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
        {/* <Link href={'/ageCheck'} asChild> */}
        <TouchableOpacity onPress={() => setAgeCheckVisible(true)} style={{ width: '80%', alignItems: 'center', justifyContent: 'center' }}>
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
        {/* </Link> */}

        <Text style={{ ...baseTextStyle, fontSize: 18, marginTop: 10, marginBottom: 8, fontWeight: '600' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ textDecorationLine: 'underline', color: 'white', fontWeight: 'bold' }}>
            Log in
          </Link>
        </Text>

        <Text style={{ ...baseTextStyle, fontSize: 9, marginHorizontal: 16, marginTop: 25, width: 200 }}>
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
