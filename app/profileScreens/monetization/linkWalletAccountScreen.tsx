//profileScreens/monetization/linkWalletAccountScreen'); 
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAppSelector, useAppDispatch} from '@/src/redux/hooks';
import { selectUserAccountRegion } from '@/src/redux/userSessionAndCurrencySlice';

// Importa as telas regionais
import LinkWalletAO from './regions/LinkWalletAO';
import LinkWalletMZ from './regions/LinkWalletMZ';
import LinkWalletBR from './regions/LinkWalletBR';
import LinkWalletEU from './regions/LinkWalletEU';
import LinkWalletUS from './regions/LinkWalletUS';

import { EUROZONE_COUNTRIES, LUSOPHONE_COUNTRIES } from "@/src/constants/regions";

export default function LinkWalletAccountScreen() {
  const region = useAppSelector(selectUserAccountRegion);

  if (!region) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // Renderização condicional baseada na região detectada
  switch (region) {
    case 'AO':
      return <LinkWalletAO />;
    case 'MZ':
      return <LinkWalletMZ />;
    case 'BR':
      return <LinkWalletBR />;
    default:
      // Detectar países da zona do euro
      if (EUROZONE_COUNTRIES.includes(region)) return <LinkWalletEU />;
      return <LinkWalletUS />;
  }
}