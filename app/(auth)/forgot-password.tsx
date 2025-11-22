// app/(auth)/forgot-password.tsx
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
    ScrollView, // Adicionado ScrollView
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons'; // Importação do Ionicons
import { GradientButton } from '@/components/uiGradientButton/GradientButton'; // Assumindo o caminho
import { authApi } from '@/src/api';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSendResetLink = async () => {
        setIsLoading(true);
        try {
            await authApi.forgotPassword(email);
            alert("Check your email for the reset link.");
            router.replace('/verify');
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Falha ao enviar o link.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Container principal para o KeyboardAvoidingView */}
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* ScrollView para centralização vertical e rolagem */}
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Bloco do ÍCONE e TÍTULO */}
                    <View style={styles.contentBlock}>
                        {/* 🛑 ÍCONE: Chave para redefinição de senha */}
                        <Ionicons
                            name="key"
                            size={80}
                            color="#ff00ff" // Usando a cor magenta para destaque
                            style={styles.authIcon}
                        />

                        <Text style={styles.title}>Forgot Password</Text>
                        <Text style={styles.subtitle}>
                            Enter your email address below. We will send you a password reset email.
                        </Text>
                    </View>

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
                        title={isLoading ? "Sending..." : "Send Password Reset"}
                        onPress={handleSendResetLink}
                        disabled={isLoading}
                    />

                    {/* LINK PARA LOGIN */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.replace('/sign-in')}>
                            <Text style={styles.loginLink}>Log In</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000'
    },
    keyboardContainer: {
        flex: 1,
    },
    // Estilo para centralizar e dar padding ao conteúdo
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 25,
        justifyContent: 'center', // Centraliza verticalmente
        paddingVertical: 40,
    },
    contentBlock: {
        marginBottom: 40,
        alignItems: 'center', // Centraliza o ícone e os textos
    },
    // 🛑 Novo estilo para o ícone
    authIcon: {
        marginBottom: 20, // Espaço após o ícone
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5, // Aproxima o título do subtítulo
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 30, // 🛑 Margem ajustada para aproximar do input
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 50
    },
    loginText: {
        color: '#aaa',
        fontSize: 16
    },
    loginLink: {
        color: '#00ffff',
        fontSize: 16,
        fontWeight: 'bold'
    },
});