//profileScreens/monetization/linkWalletAccountScreen';

import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";

export default function LinkWalletAccountScreen() {
    return (
        <>

            <Stack.Screen
                options={{
                    title: "Wallets",
                    headerTintColor: "#fff",
                    headerStyle: { backgroundColor: '#191919' },
                }}
            />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Selecionar Método de Vinculação</Text>
                {/* Cartões Internacionais */}
                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => router.push("/profileScreens/monetization/wallets/LinkWalletCard")}
                >
                    <Ionicons name="card" size={24} color="#fff" />
                    <Text style={styles.optionText}>Vincular Cartão Internacional</Text>
                </TouchableOpacity>

                {/* SEPA — apenas para quem puder usar */}
                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => router.push("/profileScreens/monetization/wallets/LinkWalletSEPA")}
                >
                    <Ionicons name="cash-outline" size={24} color="#fff" />
                    <Text style={styles.optionText}>Vincular SEPA (Europa)</Text>
                </TouchableOpacity>

            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: "center",
        backgroundColor: '#191919',
        flex: 1
    },
    title: {
        fontSize: 20,
        color: "#fff",
        marginBottom: 20,
        fontWeight: "bold",
    },
    optionButton: {
        width: "100%",
        backgroundColor: "#3b3b3b",
        padding: 15,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    optionText: {
        color: "#fff",
        fontSize: 16,
        marginLeft: 10,
    },
});




























{/**
    
    
    
    import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAppSelector } from '@/src/redux/hooks';
import { selectUserAccountRegion } from '@/src/redux/userSessionAndCurrencySlice';

// Telas regionais atualizadas
import LinkWalletEUR from './regions/LinkWalletEUR';      // Eurozone (SEPA + PayPal + Cartões)
import LinkWalletGlobal from './regions/LinkWalletGlobal'; // Global (PayPal + Cartões)

import { EUROZONE_COUNTRIES } from "@/src/constants/regions";

export default function LinkWalletAccountScreen() {
    const region = useAppSelector(selectUserAccountRegion);

    if (!region) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    // Eurozone = SEPA
    if (EUROZONE_COUNTRIES.includes(region)) {
        return <LinkWalletEUR />;
    }

    // Resto do mundo (incluindo BR) → Global
    return <LinkWalletGlobal />;
}

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAppSelector } from '@/src/redux/hooks';
import { selectUserAccountRegion } from '@/src/redux/userSessionAndCurrencySlice';

// Importa as telas regionais
import LinkWalletBR from './regions/LinkWalletBR'; // BRL (Pix)
import LinkWalletEU from './regions/LinkWalletEUR'; // EUR (SEPA)
import LinkWalletGlobal from './regions/LinkWalletGlobal'; // Renomeado/Ajustado para o GLOBAL (USD)

import { EUROZONE_COUNTRIES } from "@/src/constants/regions";

// 💡 NOTA: Certifique-se de renomear LinkWalletUS para LinkWalletGlobal 
//          e apagar os arquivos LinkWalletAO e LinkWalletMZ, se existirem.

export default function LinkWalletAccountScreen() {
    const region = useAppSelector(selectUserAccountRegion);

    if (!region) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    // Renderização condicional simplificada
    switch (region) {
        case 'BR':
            return <LinkWalletBR />; // Suporte Local (BRL/Pix)
        default:
            // 1. Verificar se a região é um país da Zona Euro (EUR/SEPA)
            if (EUROZONE_COUNTRIES.includes(region)) {
                return <LinkWalletEU />; 
            }
            
            // 2. Todos os outros países (incluindo AO, MZ) usam a modalidade Global (USD)
            //    Isso inclui Angola, Moçambique, Cabo Verde, EUA, etc.
            return <LinkWalletGlobal />; 
    }
} */}

