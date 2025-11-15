// /profileScreens/monetization/regions/LinkWalletBankMZ.tsx

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

// Este componente é o formulário para vincular a conta bancária moçambicana para saques (Payouts).

export default function LinkWalletBankMZ() {
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [numeroConta, setNumeroConta] = useState(''); // Número de Conta MZN
    const [nomeBanco, setNomeBanco] = useState('');
    const [nuit, setNuit] = useState(''); // NUIT ou BI para KYC
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async () => {
        // 💡 VALIDAÇÃO: Verifica se todos os campos estão preenchidos
        if (!nomeCompleto || !numeroConta || !nomeBanco || !nuit) {
            Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        setIsProcessing(true);
        // Os dados a serem enviados para o seu backend para processar o saque (via Flutterwave)
        console.log("Enviando dados para o backend (Saque - Banco Moçambicano):", { 
            nomeCompleto, 
            numeroConta, 
            nomeBanco, 
            nuit 
        });

        try {
            // Simulação da chamada API (Flutterwave Payout para MZN)
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
                    placeholder="Ex: Maria João da Silva"
                    placeholderTextColor="#666"
                    value={nomeCompleto}
                    onChangeText={setNomeCompleto}
                />

                {/* Campo 2: Número da Conta Bancária (Nacional) */}
                <Text style={styles.label}>Número da Conta Bancária (para Saques)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: 1234567890123"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={numeroConta}
                    onChangeText={setNumeroConta}
                />
                
                {/* Campo 3: Nome do Banco */}
                <Text style={styles.label}>Nome do Banco (Millennium, BCI, etc.)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Millennium BIM"
                    placeholderTextColor="#666"
                    value={nomeBanco}
                    onChangeText={setNomeBanco}
                />
                
                {/* Campo 4: NUIT/BI (KYC) */}
                <Text style={styles.label}>NUIT ou N.º do BI ou Passaporte</Text>
                <TextInput
                    style={styles.input}
                    placeholder="N.º de Identificação Fiscal (NUIT) ou BI para KYC"
                    placeholderTextColor="#666"
                    keyboardType="default"
                    value={nuit}
                    onChangeText={setNuit}
                />

                <View style={styles.infoBox}>
                    <Ionicons name="lock-closed" size={20} color="#fff" />
                    <Text style={styles.infoText}>
                        Os dados bancários são usados apenas para transferir os fundos das suas vendas para si em segurança.
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