// app/(auth)/verify.tsx
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
import { Stack, useRouter } from 'expo-router';
import { GradientButton } from '@/components/uiGradientButton/GradientButton'; // Assumindo o caminho

export default function VerifyScreen() {
    const [code, setCode] = useState('');
    const router = useRouter();

    const handleVerifyCode = async () => {
        // ⚠️ Lógica real: Chamar a API para verificar o código ⚠️
        console.log('Verifying code:', code);

        // Simulação: Após a verificação (seja de cadastro ou de senha), 
        // redireciona para a tela de login.
        router.replace('/sign-in');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <Text style={styles.title}>Verify Your Account</Text>
                <Text style={styles.subtitle}>
                    We sent a 6-digit code to your email. Please enter the code below to continue.
                </Text>

                {/* INPUT CÓDIGO */}
                <TextInput
                    style={styles.input}
                    placeholder="Enter 6-digit code"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    maxLength={6}
                    value={code}
                    onChangeText={setCode}
                    textAlign="center"
                />

                {/* BOTÃO GRADIENTE */}
                <GradientButton
                    title="Verify Code"
                    onPress={handleVerifyCode}
                />

                {/* REENVIAR CÓDIGO */}
                <TouchableOpacity style={styles.resendContainer}>
                    <Text style={styles.resendText}>Didn't receive the code? </Text>
                    <Text style={styles.resendLink}>Resend</Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#000' },
    container: { flex: 1, paddingHorizontal: 25, justifyContent: 'center' },
    title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 10, textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#aaa', marginBottom: 40, textAlign: 'center' },
    input: {
        backgroundColor: '#1c1c1c',
        color: '#fff',
        height: 55,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 24, // Código maior
        fontWeight: 'bold',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    resendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
    resendText: { color: '#aaa', fontSize: 16 },
    resendLink: { color: '#00ffff', fontSize: 16, fontWeight: 'bold' }, // Usando a cor magenta
});