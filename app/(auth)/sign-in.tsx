// app/(auth)/sign-in.tsx
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthCard from '@/components/AuthCard'; // Ajuste o caminho conforme sua estrutura

// IMPORTANTE: Adicione a sua imagem de fundo. 
// Exemplo: crie um arquivo 'cloud-bg.jpg' em 'assets/'
const BACKGROUND_IMAGE = require('../../assets/images/background-login.jpg'); 

export default function SignInScreen() {
  const isWeb = Platform.OS === 'web';
  const insets = useSafeAreaInsets(); // Obtém insets para evitar sobreposição em telas mobile

  return (
    <ImageBackground
      source={BACKGROUND_IMAGE}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" />
      
      {/* 1. Camada de Blur/Overlay (Ocupa a tela inteira) */}
      {isWeb ? (
        // Para Web/PWA, usamos uma View simples com transparência (o blur nativo é complexo)
        <View style={styles.blurOverlayWeb} />
      ) : (
        // Para iOS/Android, usamos o expo-blur nativo
        <BlurView intensity={50} style={StyleSheet.absoluteFill} />
      )}
      
      {/* 2. Container Principal (Simula SafeAreaView e Centraliza) */}
      <View style={[styles.mainContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          
          {/* Cabeçalho com Logo (ajustado para Web/Mobile) */}
          <View style={styles.header}>
            <Text style={styles.logoText}>⚡ Ebolt</Text>
          </View>
          
          {/* Container para Centralizar o Cartão */}
          <View style={styles.cardContainer}>
            <AuthCard type="login" />
          </View>

      </View>
      
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // Fundo deve ocupar 100% da tela/viewport em todos os dispositivos
  background: {
    flex: 1, 
    width: '100%',
    height: '100%',
  },
  // Overlay de blur para web/PWA
  blurOverlayWeb: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Platform.OS === 'web' ? 50 : 20, // Maior padding em telas maiores
    paddingTop: Platform.OS === 'web' ? 20 : 10,
    marginBottom: Platform.OS === 'web' ? 40 : 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center',     // Centraliza horizontalmente
    paddingHorizontal: 20,
  },
});