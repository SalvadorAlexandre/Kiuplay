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
  ScrollView,
} from 'react-native';
import { Stack, Link, useRouter } from 'expo-router';
import { GradientButton } from '@/components/uiGradientButton/GradientButton';
import { useAuth } from '@/hooks/Auth/useAuth'; // Onde o signIn foi atualizado
import { Ionicons } from '@expo/vector-icons';
import { Input, Icon, Button } from 'react-native-elements'

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false)
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    console.log('Attempting login with:', email, password);

    // =========================================================================
    // 🛑 LÓGICA DE LOGIN COM INFORMAÇÕES DE MOEDA
    // =========================================================================
    try {
      // 1. CHAME SUA API DE LOGIN AQUI
      await signIn(email, password);

      // 4. Redireciona para a home e remove login da pilha
      router.replace('/beatstore');

    } catch (error) {
      console.error("Login failed:", error);
      // Mostrar erro na tela
      alert("Falha no login. Verifique suas credenciais.");
    }
  };
  // =========================================================================

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />

        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>

            <View style={styles.contentBlock}>
              <Text style={styles.title}>Welcome to Kiuplay!</Text>
              <Text style={styles.subtitle}>Log in to continue...</Text>
            </View>

            {/* 1. INPUT DE EMAIL */}
            <Input
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#999"
              inputStyle={{
                outline: "none",
                color: "#fff"   // muda a cor do texto do input
              }}
              leftIcon={
                <Icon
                  type="ionicon"
                  name="mail"
                  size={22}
                  color="#999"
                />
              }

            />

            {/* 2. INPUT DE SENHA */}
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}  // importante: inverte o estado
              inputStyle={{
                outline: "none",
                color: "#fff"   // muda a cor do texto do input
              }}
              rightIcon={
                <Icon
                  type="ionicon"
                  name={passwordVisible ? "eye-off" : "eye"} // muda o ícone
                  color="#999"
                  onPress={() => setPasswordVisible(!passwordVisible)} // alterna visibilidade
                />
              }
              leftIcon={
                <Icon
                  type="ionicon"
                  name="person"
                  size={22}
                  color="#999"
                />
              }
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
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  contentBlock: {
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 30,
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
    marginBottom: 10,
  },
});


{/**
   2. INPUT DE SENHA 
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />


            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
  */}