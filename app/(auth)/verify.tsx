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
    Platform,
    ScrollView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons'; // Importação do Ionicons
import { GradientButton } from '@/components/uiGradientButton/GradientButton'; // Assumindo o caminho
import { authApi } from '@/src/api';

export default function VerifyScreen() {
    const [code, setCode] = useState('');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleVerifyCode = async () => {
        setIsLoading(true);
        try {
            await authApi.verifyEmail(code);
            router.replace('/sign-in');
        } catch (error: any) {
            console.error("Erro ao verificar código:", error);
            alert(error.message || "Falha na verificação.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Bloco do ÍCONE e TÍTULO */}
                    <View style={styles.contentBlock}>
                        {/* 🛑 ÍCONE: Usamos um ícone relacionado à segurança ou e-mail */}
                        <Ionicons
                            name="lock-closed"
                            size={80} // Ícone ligeiramente menor que o do perfil (120px)
                            color="#ff00ff" // Usando a cor magenta do gradiente para destaque
                            style={styles.verifyIcon}
                        />

                        <Text style={styles.title}>Verify Your Account</Text>
                        <Text style={styles.subtitle}>
                            We sent a 6-digit code to your email. Please enter the code below to continue.
                        </Text>
                    </View>

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
                        title={isLoading ? "Verifying..." : "Verify Code"}
                        onPress={handleVerifyCode}
                        disabled={isLoading}
                    />

                    {/* REENVIAR CÓDIGO */}
                    <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>Didn't receive the code? </Text>
                        <TouchableOpacity onPress={() => console.log('Resend code logic')}>
                            <Text style={styles.resendLink}>Resend</Text>
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
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 25,
        justifyContent: 'center',
        paddingVertical: 40,
    },
    // 🛑 Novo estilo para o ícone
    verifyIcon: {
        marginBottom: 20, // Espaço após o ícone
    },
    contentBlock: {
        marginBottom: 40,
        alignItems: 'center', // Centraliza o ícone e os textos
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5, // Ajustada para aproximar
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40
    },
    resendText: {
        color: '#aaa',
        fontSize: 16
    },
    resendLink: {
        color: '#00ffff',
        fontSize: 16,
        fontWeight: 'bold'
    },
});