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
    Platform,
    ScrollView, // 🛑 Adicionado ScrollView
} from 'react-native';
import { Stack, Link, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons'; // 🛑 Importação do Ionicons
import { GradientButton } from '@/components/uiGradientButton/GradientButton'; // Assumindo o caminho
import { useAuth } from '@/hooks/Auth/useAuth';

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignUp = async () => {
        // Lógica de cadastro real com a API aqui
        console.log('Attempting sign up with:', name, email);

        // Redireciona para a nova tela de verificação
        router.replace('/verify');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* 🛑 Mudança 1: Container principal para o KeyboardAvoidingView */}
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* 🛑 Mudança 2: ScrollView para centralização vertical e rolagem */}
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Bloco do ÍCONE e TÍTULO */}
                    <View style={styles.contentBlock}>
                        {/* 🛑 Substituição da Imagem pelo Ionicons */}
                        <Ionicons
                            name="person-circle-outline"
                            size={120}
                            color="#ff00ff"
                            style={styles.profileIcon}
                        />

                        <Text style={styles.title}>Create Kiuplay Account</Text>
                        <Text style={styles.subtitle}>Sign up and Start Listening</Text>
                    </View>

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
    // 🛑 Estilo para centralizar e dar padding ao conteúdo
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 25,
        justifyContent: 'center', // Centraliza verticalmente
        //paddingVertical: 40,
    },
    contentBlock: {
        marginBottom: 20, // Aproxima o bloco dos inputs
        alignItems: 'center',
    },
    // 🛑 Novo estilo para o ícone
    profileIcon: {
        marginBottom: 10, // Aproxima o ícone do título
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5, // Diminuída
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 30, // Ajustada para diminuir o espaço
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
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 50
    },
    signInText: {
        color: '#aaa',
        fontSize: 16
    },
    signInLink: {
        color: '#00ffff',
        fontSize: 16,
        fontWeight: 'bold'
    },
});