// /profileScreens/monetization/regions/LinkWalletBankAO.tsx

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";

// Este componente é o formulário para vincular a conta bancária angolana para saques (Payouts).

export default function LinkWalletBankAO() {
    // 💡 ESTADOS: Todos os campos necessários para saques seguros em AOA
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [iban, setIban] = useState('');
    const [numeroConta, setNumeroConta] = useState('');
    const [nomeBanco, setNomeBanco] = useState('');
    const [numeroBI, setNumeroBI] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async () => {
        // 💡 VALIDAÇÃO: Verifica se todos os campos estão preenchidos
        if (!nomeCompleto || !iban || !numeroConta || !nomeBanco || !numeroBI) {
            Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        setIsProcessing(true);
        // Os dados a serem enviados para o seu backend para processar o saque
        console.log("Enviando dados para o backend (Saque - Banco Angolano):", {
            nomeCompleto,
            iban,
            numeroConta,
            nomeBanco,
            numeroBI
        });

        try {
            // Simulação da chamada API para o seu backend (Flutterwave Payout)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simulação de Sucesso
            Alert.alert("Sucesso", "Conta bancária vinculada com sucesso para saques!");
            router.back();

        } catch (error) {
            Alert.alert("Erro", "Falha ao vincular a conta. Tente novamente.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Vincular Conta',
                    headerStyle: { backgroundColor: "#0e0e0e" },
                    headerTintColor: '#fff',
                    headerShown: true,
                }}
            />
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Vincular Conta local</Text>
                <Text style={styles.subtitle}>
                    Para saques e vendas, preencha todos os campos para garantir a máxima segurança e compatibilidade com o sistema bancário.
                </Text>

                {/* Campo 1: Nome Completo */}
                <Text style={styles.label}>Nome Completo (Titular da Conta)</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Ex: João Manuel Silva"
                    placeholderTextColor="#666"
                    value={nomeCompleto}
                    onChangeText={setNomeCompleto}
                />

                {/* Campo 2: Número do BI/Cartão de Residente/Passaporte (KYC) */}
                <Text style={styles.label}>Número do B.I., Cartão de Residente, ou Passaporte</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Documento de Identificação para KYC"
                    placeholderTextColor="#666"
                    keyboardType="default"
                    value={numeroBI} // Mantém o estado como 'numeroBI' para simplicidade
                    onChangeText={setNumeroBI}
                />

                {/* Campo 3: Nome do Banco */}
                <Text style={styles.label}>Nome do Banco (BAI, BFA, BIC, etc.)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Banco Angolano de Investimentos (BAI)"
                    placeholderTextColor="#666"
                    value={nomeBanco}
                    onChangeText={setNomeBanco}
                />

                {/* Campo 4: IBAN (Internacional) */}
                <Text style={styles.label}>IBAN (Identificação Completa da Conta)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: AO06.0000.1234.5678.901"
                    placeholderTextColor="#666"
                    keyboardType="default"
                    value={iban}
                    onChangeText={setIban}
                />

                <View style={styles.infoBox}>
                    <Ionicons name="lock-closed" size={20} color="#fff" />
                    <Text style={styles.infoText}>
                        Os seus dados são confidenciais e usados apenas para processar saques em segurança e validar sua identidade.
                    </Text>
                </View>

                {/* Botão de Submissão */}
                <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleSubmit}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <ActivityIndicator color="#0e0e0e" />
                            <Text style={styles.submitText}>A processar...</Text>
                        </View>
                    ) : (
                        <Text style={styles.submitText}>Vincular Conta Bancária</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0e0e0e",
        padding: 20,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        color: '#ccc',
        fontSize: 16,
        marginBottom: 30,
    },
    label: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 15,
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#1a1a1a',
        color: '#fff',
        fontSize: 16,
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        padding: 15,
        marginTop: 25,
        gap: 10,
    },
    infoText: {
        flex: 1,
        color: '#ccc',
        fontSize: 14,
    },
    submitBtn: {
        marginTop: 30,
        backgroundColor: "#00e676",
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: "center",
    },
    submitText: {
        color: "#0e0e0e",
        fontSize: 18,
        fontWeight: "700",
    },
});