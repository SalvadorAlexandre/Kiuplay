// components/AuthCard.tsx

// components/AuthCard.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useAuth } from '@/hooks/useAuth';

interface AuthCardProps {
  type: 'login' | 'register';
}

const SocialButton = ({ icon, color }: { icon: 'google' | 'facebook' | 'apple'; color: string }) => {
  let IconComponent: React.ComponentType<any> = AntDesign;
  let iconName: string = icon;

  if (icon === 'google') iconName = 'google';
  else if (icon === 'facebook') {
    IconComponent = FontAwesome;
    iconName = 'facebook';
  } else if (icon === 'apple') {
    IconComponent = FontAwesome;
    iconName = 'apple';
  }

  return (
    <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert(`${icon} login não implementado`)}>
      <IconComponent name={iconName} size={24} color={color} />
    </TouchableOpacity>
  );
};

export default function AuthCard({ type }: AuthCardProps) {
  const { isLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLogin = type === 'login';

  const title = isLogin ? 'Entrar com Kiuplay' : 'Criar conta Kiuplay';
  const subtitle = isLogin
    ? 'Acesse suas músicas, beats e castings.'
    : 'Cadastre-se e comece a criar, ouvir e compartilhar suas faixas.';
  const buttonText = isLogin ? 'Entrar' : 'Cadastrar';

  // Função de validação simples
  const validateInputs = () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Digite um email válido.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    return true;
  };

  // Mock de autenticação
  const handleAuth = () => {
    if (!validateInputs()) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Mock: qualquer login é aceito
      Alert.alert('Sucesso', `Bem-vindo(a), ${email}!`);
      // Aqui você chamaria useAuth ou API real para autenticar
      // Exemplo:
      // login(email, password);
    }, 1000);
  };

  return (
    <View style={styles.cardWrapper}>
      <BlurView intensity={30} tint="light" style={styles.cardContainer}>
        {/* Ícone de seta */}
        <View style={styles.iconCircle}>
          <Ionicons name="arrow-forward-outline" size={24} color="#000" />
        </View>

        {/* Título */}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {/* Inputs */}
        <View style={styles.inputGroup}>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Senha"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity style={styles.passwordToggle} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Ionicons name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Esqueci a senha */}
        {isLogin && (
          <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => Alert.alert('Esqueci minha senha', 'Funcionalidade não implementada')}>
            <Text style={styles.forgotPasswordText}>Esqueci minha senha?</Text>
          </TouchableOpacity>
        )}

        {/* Botão principal */}
        <TouchableOpacity style={styles.mainButton} onPress={handleAuth} disabled={loading}>
          <Text style={styles.mainButtonText}>{loading ? 'Carregando...' : buttonText}</Text>
        </TouchableOpacity>

        {/* Divisor */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Ou entre com</Text>
          <View style={styles.divider} />
        </View>

        {/* Botões sociais */}
        <View style={styles.socialButtonsContainer}>
          <SocialButton icon="google" color="#4285F4" />
          <SocialButton icon="facebook" color="#1877F2" />
          <SocialButton icon="apple" color="#000" />
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
      android: { elevation: 10 },
    }),
    marginHorizontal: 'auto', // centraliza web
  },
  cardContainer: {
    padding: 30,
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  title: { fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30, lineHeight: 20 },
  inputGroup: { width: '100%', marginBottom: 20 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: Platform.OS === 'android' ? 0 : 15,
  },
  passwordInput: { paddingRight: 10 },
  passwordToggle: { padding: 5 },
  forgotPasswordButton: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotPasswordText: { color: '#444', fontSize: 13, fontWeight: '500' },
  mainButton: {
    width: '100%',
    backgroundColor: '#333333',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  mainButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 25 },
  divider: { flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.1)' },
  dividerText: { marginHorizontal: 15, fontSize: 13, color: '#888', fontWeight: '500' },
  socialButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 },
  socialButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
});