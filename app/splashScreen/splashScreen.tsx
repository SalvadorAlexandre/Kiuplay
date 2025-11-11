import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreenApp({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    // Mantém a splash por 2 segundos e depois chama onFinish
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" /> 
      <Text style={styles.text}>Kiuplay starting...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // tela preta
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#007AFF', // azul do texto
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
});