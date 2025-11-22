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
    ActivityIndicator,
} from 'react-native';
import { Stack, Link, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons'; // 🛑 Importação do Ionicons
import { GradientButton } from '@/components/uiGradientButton/GradientButton'; // Assumindo o caminho
import { authApi } from '@/src/api';

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignUpScreen() {

    const router = useRouter();

    const signUpSchema = z.object({
        name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
        username: z.string()
            .min(3, "O username deve ter pelo menos 3 caracteres")
            .regex(/^[a-zA-Z0-9_]+$/, "Apenas letras, números e underscore são permitidos"),
        email: z.string().email("E-mail inválido"),
        password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres")
    });

    type SignUpFormData = z.infer<typeof signUpSchema>;

    // Dentro do componente
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema)
    });

    const onSubmit = async (data: SignUpFormData) => {
        try {
           const response = await authApi.signUp({
                name: data.name,
                username: data.username,
                email: data.email,
                password: data.password
            });
             console.log('Resposta da api', response)
            router.replace("/verify");
        } catch (error: any) {
            console.error("Erro no cadastro:", error);
            alert(error.message || "Falha no cadastro.");
        }
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
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { value, onChange, onBlur } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Your Name"
                                placeholderTextColor="#999"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                autoCapitalize="words"
                            />
                        )}
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

                    {/* INPUT USERNAME */}
                    <Controller
                        control={control}
                        name="username"
                        render={({ field: { value, onChange, onBlur } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="@Username"
                                placeholderTextColor="#999"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                autoCapitalize="none"
                            />
                        )}
                    />
                    {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

                    {/* INPUT EMAIL */}
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { value, onChange, onBlur } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                autoCapitalize="none"
                            />
                        )}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                    {/* INPUT SENHA */}
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { value, onChange, onBlur } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#999"
                                secureTextEntry
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                            />
                        )}
                    />
                    {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                    {/* BOTÃO DE CADASTRO GRADIENTE */}
                    <GradientButton
                        title={isSubmitting ? "Signing Up..." : "Sign Up"}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
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
    errorText: {
        color: '#ff0000', // vermelho para erro
        fontSize: 13,
        marginBottom: 3,
        marginLeft: 4,
    },
});