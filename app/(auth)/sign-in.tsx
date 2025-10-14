// app/(auth)/sign-in.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView, // 🛑 Adicionado ScrollView para melhor manuseio de conteúdo
} from 'react-native';
import { Stack, Link, useRouter } from 'expo-router';
import { GradientButton } from '@/components/uiGradientButton/GradientButton'; // Assumindo o caminho
import { useAuth } from '@/hooks/Auth/useAuth';
import { Ionicons } from '@expo/vector-icons';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    // ⚠️ Implementar lógica de autenticação real aqui ⚠️
    console.log('Attempting login with:', email, password);

    // Simulação de sucesso (deve ser chamada após sucesso da API)
    await signIn('mock_token_123');

    // Redireciona para a home e remove login da pilha
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* 🛑 Mudança 1: Removendo flex: 1 do container e envolvendo tudo em um ScrollView 
                 para melhor layout em telas menores e centralização vertical. */}
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* 🛑 Mudança 2: Imagem e Texto como um bloco */}
          <View style={styles.contentBlock}>
            <Ionicons
              name="person-circle"
              size={120}
              color="#ff00ff"
              style={styles.profileIcon}
            />

            <Text style={styles.title}>Welcome to Kiuplay!</Text>
            <Text style={styles.subtitle}>Log in to continue...</Text>
          </View>

          {/* 1. INPUT DE EMAIL */}
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          {/* 2. INPUT DE SENHA */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* 3. BOTÃO DE LOGIN GRADIENTE */}
          <GradientButton
            title="Log In"
            onPress={handleLogin}
          />

          {/* 4. ESQUECEU A SENHA */}
          <Link href="/forgot-password" asChild>
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </Link>

          {/* 5. LINK PARA CADASTRO */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <Link href="/sign-up" asChild>
              <TouchableOpacity>
                <Text style={styles.signUpLink}>Sign up</Text>
              </TouchableOpacity>
            </Link>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  // Novo container para a KeyboardAvoidingView
  keyboardContainer: {
    flex: 1,
  },
  // 🛑 Estilo para centralizar e dar padding ao conteúdo
  scrollContent: {
    flexGrow: 1, // Permite que o ScrollView cresça
    paddingHorizontal: 25,
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    //paddingVertical: 10, // Adiciona um padding para o topo e base
  },
  contentBlock: {
    marginBottom: 20, // 🛑 Diminui a margem inferior para aproximar dos inputs
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5, // Diminuída
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 30, // 🛑 Ajustada para diminuir o espaço
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#1c1c1c',
    color: '#fff',
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 15,
    marginBottom: 40,
  },
  forgotPasswordText: {
    color: '#aaa',
    fontSize: 14,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50,
  },
  signUpText: {
    color: '#aaa',
    fontSize: 16,
  },
  signUpLink: {
    color: '#00ffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileIcon: {
    marginBottom: 10, // Aproxima o ícone do título
  },
});