import { numbers } from '@/constants/numbers';
import React, { useRef } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BUTTON_SIZE = 60;
const MARGIN = 30;
const DRAG_MARGIN_VERTICAL = 100000; // vertical margin above and below button to activate drag
const DRAG_MARGIN_HORIZONTAL = 100000; // horizontal margin around button to activate drag

const DraggablePlusButton = () => {
  // Start button at bottom right
  const pan = useRef(new Animated.ValueXY({ x: SCREEN_WIDTH - BUTTON_SIZE - MARGIN, y: 0 })).current;

  // Keep track of current pan.x value to compare touch position
  const panX = useRef(SCREEN_WIDTH - BUTTON_SIZE - MARGIN);
  pan.addListener(({ x }) => {
    panX.current = x;
  });

  // Check if touch is horizontally near button (within margin)
  const isTouchNearButton = (touchX: number) => {
    return (
      touchX >= panX.current - DRAG_MARGIN_HORIZONTAL &&
      touchX <= panX.current + BUTTON_SIZE + DRAG_MARGIN_HORIZONTAL
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => {
        return isTouchNearButton(gestureState.x0);
      },
      onMoveShouldSetPanResponder: (e, gestureState) => {
        return isTouchNearButton(gestureState.x0);
      },
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: (e, gestureState) => {
        pan.setValue({ x: gestureState.dx, y: 0 });
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
        pan.stopAnimation((finalPosition) => {
          const snapLeft = finalPosition.x < (SCREEN_WIDTH - BUTTON_SIZE) / 2;
          Animated.spring(pan.x, {
            toValue: snapLeft ? MARGIN : SCREEN_WIDTH - BUTTON_SIZE - MARGIN,
            useNativeDriver: false,
            bounciness: 8,
          }).start();
        });
      },
    })
  ).current;

  const handlePress = () => {
    console.log('Plus button pressed!');
  };

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.touchArea,
        { bottom: MARGIN - DRAG_MARGIN_VERTICAL, left: 0 },
      ]}
      pointerEvents="box-none" // Allow touches to pass through except children that handle them
    >
      <Animated.View
        style={[
          styles.button,
          pan.getLayout(),
          { top: DRAG_MARGIN_VERTICAL }, // push button down inside wrapper
        ]}
      >
        <TouchableOpacity onPress={handlePress} style={styles.touchable} activeOpacity={0.7}>
          <Text style={styles.text}>＋</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  touchArea: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: BUTTON_SIZE + DRAG_MARGIN_VERTICAL * 2,
    zIndex: 999,
  },
  button: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
  },
  touchable: {
    backgroundColor: numbers.secondaryColor,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default DraggablePlusButton;
