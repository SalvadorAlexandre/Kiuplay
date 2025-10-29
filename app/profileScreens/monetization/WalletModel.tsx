import React, { ReactNode } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';

const { height } = Dimensions.get('window');

interface BottomModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function BottomModal({ visible, onClose, children }: BottomModalProps) {
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Fundo escurecido */}
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Botão de fechar */}
          <TouchableOpacity style={styles.closeBar} onPress={onClose} />

          {/* Conteúdo do modal */}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
    backgroundColor: '#111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 5,
  },
  closeBar: {
    width: 45,
    height: 5,
    backgroundColor: '#555',
    alignSelf: 'center',
    borderRadius: 3,
    marginBottom: 10,
  },
  content: {
    paddingHorizontal: 20,
  },
});