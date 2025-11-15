// /profileScreens/monetization/regions/LinkWalletBankEUR.tsx

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

// Este componente é o formulário para vincular a conta bancária Euro (SEPA) para saques (Payouts).

export default function LinkWalletBankEU() {
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [iban, setIban] = useState(''); 
    const [endereco, setEndereco] = useState('');
    const [cidade, setCidade] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async () => {
        // 💡 VALIDAÇÃO: Verifica se todos os campos estão preenchidos
        if (!nomeCompleto || !iban || !endereco || !cidade || !codigoPostal) {
            Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        setIsProcessing(true);
        // Os dados a serem enviados para o seu backend para processar o saque (via Stripe Payouts)
        console.log("Enviando dados para o backend (Saque - Zona Euro):", { 
            nomeCompleto, 
            iban, 
            endereco, 
            cidade, 
            codigoPostal 
        });

        try {
            // Simulação da chamada API (Stripe Payout para EUR)
            await new Promise(resolve => setTimeout(resolve, 2000)); 
            
            // Simulação de Sucesso
            Alert.alert("Sucesso", "Conta SEPA vinculada com sucesso!");
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
                    title: 'Vincular Conta - Zona Euro',
                    headerStyle: { backgroundColor: "#0e0e0e" },
                    headerTintColor: '#fff',
                    headerShown: true,
                }}
            />
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Vincular Conta Bancária SEPA (€)</Text>
                <Text style={styles.subtitle}>
                    Use o seu IBAN para receber saques (retiradas) em Euros (€) em qualquer país da Zona Euro.
                </Text>

                {/* Campo 1: Nome Completo */}
                <Text style={styles.label}>Nome Completo (Titular da Conta)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Stefan Müller"
                    placeholderTextColor="#666"
                    value={nomeCompleto}
                    onChangeText={setNomeCompleto}
                />

                {/* Campo 2: IBAN (SEPA Standard) */}
                <Text style={styles.label}>IBAN (International Bank Account Number)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: DE89 3704 0044 0532 0130 00"
                    placeholderTextColor="#666"
                    keyboardType="default"
                    value={iban}
                    onChangeText={setIban}
                />
                
                {/* 🚨 CAMPOS DE ENDEREÇO (Necessário para KYC Stripe/EU) */}
                <Text style={styles.titleSmall}>Endereço de Faturação e Residência</Text>
                <Text style={styles.label}>Endereço Completo</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Rua, Número, Apartamento"
                    placeholderTextColor="#666"
                    value={endereco}
                    onChangeText={setEndereco}
                />
                
                <View style={styles.row}>
                    <View style={styles.rowItem}>
                        <Text style={styles.label}>Cidade</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Berlim"
                            placeholderTextColor="#666"
                            value={cidade}
                            onChangeText={setCidade}
                        />
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.label}>Código Postal</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 10115"
                            placeholderTextColor="#666"
                            keyboardType="default"
                            value={codigoPostal}
                            onChangeText={setCodigoPostal}
                        />
                    </View>
                </View>

                <View style={styles.infoBox}>
                    <Ionicons name="business-outline" size={20} color="#fff" />
                    <Text style={styles.infoText}>
                        O IBAN e o Endereço são essenciais para cumprir as regulamentações SEPA e os requisitos de KYC do Stripe.
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
                        <Text style={styles.submitText}>Vincular Conta Bancária SEPA</Text>
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
    titleSmall: { // Novo estilo para separar a secção de endereço
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 25,
        marginBottom: 5,
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
    row: { // Estilo para colocar Cidade e Código Postal lado a lado
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    rowItem: {
        flex: 1,
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