// /profileScreens/monetization/regions/LinkWalletBankBR.tsx

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

// 💡 NOVO IMPORT
import DropDownPicker from 'react-native-dropdown-picker';

export default function LinkWalletBankBR() {
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [cpf, setCpf] = useState('');
    const [codigoBanco, setCodigoBanco] = useState('');
    const [numeroAgencia, setNumeroAgencia] = useState('');
    const [numeroConta, setNumeroConta] = useState('');
    
    // 💡 ESTADOS DO DROPDOWN
    const [tipoContaOpen, setTipoContaOpen] = useState(false);
    const [tipoContaValue, setTipoContaValue] = useState(null); // Valor selecionado
    const [tipoContaItems, setTipoContaItems] = useState([
        { label: 'Conta Corrente', value: 'corrente' },
        { label: 'Conta Poupança', value: 'poupança' },
    ]);
    
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async () => {
        // 💡 VALIDAÇÃO ATUALIZADA: Verifica se o valor do Dropdown foi escolhido
        if (!nomeCompleto || !cpf || !codigoBanco || !numeroAgencia || !numeroConta || !tipoContaValue) {
            Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        setIsProcessing(true);
        
        console.log("Enviando dados para o backend (Saque - Brasil):", { 
            nomeCompleto, 
            cpf, 
            codigoBanco, 
            numeroAgencia, 
            numeroConta, 
            tipoConta: tipoContaValue // Usamos o valor (corrente/poupança)
        });

        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); 
            Alert.alert("Sucesso", "Conta bancária vinculada com sucesso!");
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
                    title: 'Vincular Conta - Brasil',
                    headerStyle: { backgroundColor: "#0e0e0e" },
                    headerTintColor: '#fff',
                    headerShown: true,
                }}
            />
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Vincular Conta Bancária (BRL)</Text>
                <Text style={styles.subtitle}>
                    Para saques (retiradas) em Reais (BRL), insira os dados da sua conta brasileira. O CPF é obrigatório.
                </Text>

                {/* Nome e CPF mantidos */}
                <Text style={styles.label}>Nome Completo (Titular da Conta)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: João Ferreira da Costa"
                    placeholderTextColor="#666"
                    value={nomeCompleto}
                    onChangeText={setNomeCompleto}
                />
                <Text style={styles.label}>CPF (Cadastro de Pessoas Físicas)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: 123.456.789-00"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={cpf}
                    onChangeText={setCpf}
                />
                
                <Text style={styles.titleSmall}>Dados Bancários para TED/DOC</Text>
                
                {/* Código do Banco */}
                <Text style={styles.label}>Código do Banco (3 dígitos)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: 001 (Banco do Brasil)"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    maxLength={3}
                    value={codigoBanco}
                    onChangeText={setCodigoBanco}
                />
                
                <View style={styles.row}>
                    <View style={styles.rowItem}>
                        <Text style={styles.label}>Nº da Agência</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 1234"
                            placeholderTextColor="#666"
                            keyboardType="numeric"
                            value={numeroAgencia}
                            onChangeText={setNumeroAgencia}
                        />
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.label}>Nº da Conta (com dígito)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 98765-4"
                            placeholderTextColor="#666"
                            keyboardType="default"
                            value={numeroConta}
                            onChangeText={setNumeroConta}
                        />
                    </View>
                </View>

                {/* 💡 CAMPO SUBSTITUÍDO POR DROPDOWN */}
                <Text style={styles.label}>Tipo de Conta</Text>
                <DropDownPicker
                    open={tipoContaOpen}
                    value={tipoContaValue}
                    items={tipoContaItems}
                    setOpen={setTipoContaOpen}
                    setValue={setTipoContaValue}
                    setItems={setTipoContaItems}
                    placeholder="Selecione o tipo de conta"
                    style={styles.dropdown}
                    textStyle={styles.dropdownText}
                    dropDownContainerStyle={styles.dropdownContainer}
                    theme="DARK" // Usando o tema DARK para melhor compatibilidade com o fundo
                />
                
                {/* O restante do componente permanece igual */}
                <View style={styles.infoBox}>
                    <Ionicons name="business-outline" size={20} color="#fff" />
                    <Text style={styles.infoText}>
                        O CPF é essencial para que o Stripe possa processar transferências (TED/DOC) em conformidade com o Banco Central do Brasil.
                    </Text>
                </View>

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
                <View style={{ height: 70 }} /> {/* Espaço extra para o dropdown */}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    // ... estilos anteriores ...
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
    titleSmall: {
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
    row: { 
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    rowItem: {
        flex: 1,
    },
    // 💡 NOVOS ESTILOS PARA O DROPDOWN
    dropdown: {
        backgroundColor: '#1a1a1a',
        borderColor: '#333',
        borderRadius: 12,
        minHeight: 50,
        paddingHorizontal: 15,
        zIndex: 1000, // Garante que o dropdown fique acima de outros elementos
    },
    dropdownText: {
        color: '#fff',
        fontSize: 16,
    },
    dropdownContainer: {
        backgroundColor: '#1a1a1a',
        borderColor: '#333',
        zIndex: 1000,
    },
    // ... estilos restantes ...
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