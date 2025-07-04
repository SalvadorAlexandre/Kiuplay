// components/commentScreens/BottomHalfModal.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
  Text,
  Easing,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height: screenHeight } = Dimensions.get('window');

interface BottomHalfModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  heightPercentage?: number;
}

const BottomHalfModal: React.FC<BottomHalfModalProps> = ({
  isVisible,
  onClose,
  children,
  heightPercentage = 0.6,
}) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const modalHeight = screenHeight * heightPercentage;
  const finalPosition = screenHeight - modalHeight;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy + finalPosition);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > screenHeight * 0.15 || gestureState.vy > 0.5) {
          Animated.timing(slideAnim, {
            toValue: screenHeight,
            duration: 250,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          Animated.spring(slideAnim, {
            toValue: finalPosition,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: finalPosition,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, finalPosition]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              height: modalHeight,
              transform: [{ translateY: slideAnim }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handleBar} />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#555" />
          </TouchableOpacity>
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    padding: 5,
  },
  content: {
    flex: 1,
    width: '100%',
    paddingBottom: 20,
  },
});

export default BottomHalfModal;