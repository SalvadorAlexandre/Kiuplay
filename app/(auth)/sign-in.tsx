// app/(auth)/sign-in.tsx
// app/(auth)/sign-in.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, Link, useRouter } from 'expo-router';
import { GradientButton } from '@/components/uiGradientButton/GradientButton'; // Assumindo o caminho
import { useAuth } from '@/hooks/Auth/useAuth';

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
    // Oculta o cabeçalho (apenas para garantir)
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.title}>Welcome to Kiuplay!</Text>
        <Text style={styles.subtitle}>Log in to continue...</Text>

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

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000', // Fundo preto sólido
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#1c1c1c', // Fundo de input escuro
    color: '#fff',
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333', // Borda sutil
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
    color: '#00ffff', // Cor ciano vibrante para o link
    fontSize: 16,
    fontWeight: 'bold',
  },
});