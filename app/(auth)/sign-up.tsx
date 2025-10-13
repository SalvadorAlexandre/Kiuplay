// app/(auth)/sign-up.tsx
// app/(auth)/sign-up.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Stack, Link, useRouter } from 'expo-router';
import { GradientButton } from '@/components/uiGradientButton/GradientButton'; // Assumindo o caminho
import { useAuth } from '@/hooks/Auth/useAuth';

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    // const { signIn } = useAuth(); // Se quiser logar automaticamente após o cadastro

    const handleSignUp = async () => {
        // ⚠️ Implementar lógica de cadastro real com a API aqui ⚠️
        console.log('Attempting sign up with:', name, email);

        // Simulação: Após o cadastro bem-sucedido, redireciona o usuário para a tela principal
        // ou para uma tela de verificação de e-mail (dependendo do seu backend).

        // Exemplo: Se o cadastro logar o usuário diretamente:
        // await signIn('new_user_token'); 
        // router.replace('/'); 

        // Exemplo: Se o cadastro exigir verificação de e-mail:
        router.replace('/verify'); // Redireciona para a nova tela de verificação
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <Text style={styles.title}>Sign Up</Text>
                <Text style={styles.subtitle}>Sign up and Start Listening</Text>

                {/* INPUT NOME */}
                <TextInput
                    style={styles.input}
                    placeholder="Your Name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                />

                {/* INPUT EMAIL */}
                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />

                {/* INPUT SENHA */}
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {/* BOTÃO DE CADASTRO GRADIENTE */}
                <GradientButton
                    title="Sign Up"
                    onPress={handleSignUp}
                />

                {/* LINK PARA LOGIN */}
                <View style={styles.signInContainer}>
                    <Text style={styles.signInText}>Already have an account? </Text>
                    <Link href="/sign-in" asChild>
                        <TouchableOpacity>
                            <Text style={styles.signInLink}>Log In</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// Reutilizamos os estilos de dark mode da tela de login
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#000' },
    container: { flex: 1, paddingHorizontal: 25, justifyContent: 'center' },
    title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
    subtitle: { fontSize: 16, color: '#aaa', marginBottom: 40 },
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
    signInContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 50 },
    signInText: { color: '#aaa', fontSize: 16 },
    signInLink: { color: '#00ffff', fontSize: 16, fontWeight: 'bold' },
});