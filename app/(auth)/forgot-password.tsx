// app/(auth)/forgot-password.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { GradientButton } from '@/components/uiGradientButton/GradientButton'; // Assumindo o caminho

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleSendResetLink = async () => {
        // ⚠️ Lógica real: Chamar a API para enviar o link/código para o e-mail ⚠️
        console.log('Sending reset link to:', email);

        // Simulação: Após o envio bem-sucedido, redireciona para a tela de verificação
        router.replace('/verify');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>Enter your email address below. We will send you a password reset email.</Text>

                {/* INPUT EMAIL */}
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email address"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />

                {/* BOTÃO GRADIENTE */}
                <GradientButton
                    title="Send Password Reset"
                    onPress={handleSendResetLink}
                />

                {/* LINK PARA LOGIN */}
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.replace('/sign-in')}>
                        <Text style={styles.loginLink}>Log In</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

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
    loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 50 },
    loginText: { color: '#aaa', fontSize: 16 },
    loginLink: { color: '#00ffff', fontSize: 16, fontWeight: 'bold' },
});