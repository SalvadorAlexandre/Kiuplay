//profileScreens/monetization/linkWalletAccountScreen'); 

// /profileScreens/monetization/linkWalletAccountScreen.tsx (Versão Simplificada)
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAppSelector } from '@/src/redux/hooks';
import { selectUserAccountRegion } from '@/src/redux/userSessionAndCurrencySlice';

// Importa as telas regionais
import LinkWalletBR from './regions/LinkWalletBR'; // BRL (Pix)
import LinkWalletEU from './regions/LinkWalletEU'; // EUR (SEPA)
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
}