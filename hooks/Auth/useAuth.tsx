// hooks/useAuth.ts
import React, { useState, useEffect, useContext, useMemo } from 'react';
// Importe AsyncStorage se for usá-lo para persistência de token
// import AsyncStorage from '@react-native-async-storage/async-storage'; 

// 🛑 NOVOS IMPORTS DO REDUX
import { useAppDispatch } from '@/src/redux/hooks';
import { setAuthSession, logoutUser } from '@/src/redux/userSessionAndCurrencySlice';
import { UserProfile } from '@/src/types/contentType'; // Para tipagem da API


// =========================================================================
// 1. DEFINIÇÃO DA INTERFACE DO CONTEXTO
// =========================================================================
export interface AuthUserData { // Crie uma interface para o payload de dados do usuário
  userId: string;
  locale: string;
  currencyCode: string;
  accountRegion: string; // <--- CORREÇÃO 1: Adicione accountRegion aqui
}


export interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  // O signIn agora pode receber dados mais complexos, como a resposta da API, além do token.
  signIn: (token: string, userData: AuthUserData) => Promise<void>;
  signOut: () => Promise<void>;
}

// =========================================================================
// 2. CRIAÇÃO DO CONTEXTO
// =========================================================================

const AuthContext = React.createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  signIn: async () => { },
  signOut: async () => { },
});

// =========================================================================
// 3. HOOK PARA CONSUMIR O CONTEXTO
// =========================================================================
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

// =========================================================================
// 4. PROVEDOR DE AUTENTICAÇÃO
// =========================================================================
export function AuthProvider({ children }: { children: React.ReactNode }) {

  // **INTEGRAÇÃO REDUX**
  const dispatch = useAppDispatch(); // 🛑 Obter o Dispatch

  // **ESTADOS**
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // **FUNÇÕES DE AUTENTICAÇÃO**

  // 🛑 CORREÇÃO 3: O parâmetro 'userData' agora é do tipo AuthUserData
  const signIn = async (token: string, userData: AuthUserData) => {
    console.log("Usuário logado. Token:", token);

    // 🛑 ENVIAR DADOS DE SESSÃO, MOEDA E REGIÃO PARA O REDUX
    dispatch(setAuthSession({
      userId: userData.userId,
      locale: userData.locale,
      currencyCode: userData.currencyCode,
      accountRegion: userData.accountRegion, // <--- CORREÇÃO 4: PASSANDO A REGIÃO
    }));

    setIsLoggedIn(true);
  };

  const signOut = async () => {
    // 1. Lógica real: Remover token do AsyncStorage
    console.log("Usuário deslogado.");
    // await AsyncStorage.removeItem('userToken');

    // 2. 🛑 LIMPAR A SESSÃO E REDEFINIR MOEDA NO REDUX
    dispatch(logoutUser());

    // 3. Definir o estado de login
    setIsLoggedIn(false);
  };

  // **EFEITO PARA CARREGAMENTO E VERIFICAÇÃO INICIAL**
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // MOCK para simular o tempo de verificação (500ms)
        await new Promise(resolve => setTimeout(resolve, 500));

        // MOCK: Lógica para verificar token persistido
        const persistedToken = true; // Mude para false para testar o fluxo de deslogado

        if (persistedToken) {
          // 🛑 SIMULAÇÃO DOS DADOS DE MOEDA VINDO DA SESSÃO/TOKEN
          const mockUserId = 'user-123'; //Mock de contexto de conta (usuario logado isso vira do back-end)

          //Estas linhas devem ser atualizadas corretamene para que a moeda seja definida corretamente
          const mockLocale = 'cy-CY'; //IDIOMA PARA DEFINIR A MOEDA
          const mockCurrencyCode = 'AOA' //  Código da moeda (ISO)
          const mockAccountRegion = 'AO'; // MOCK PARA REGIÃO DA CONTA

          {/** EXEMPLO DE CODIGOS PARA TROCAR A MOED
           pt-AO, AOA
           pt-PT, EUR
           pt-BR, BRL
           en-US, USD
           en-GB, GBP
           ja-JP, JPY

           
          'AT': 'de-AT', // 🇦🇹 Áustria — Alemão (Áustria)
          'BE': 'nl-BE', // 🇧🇪 Bélgica — Neerlandês (Bélgica)
          'CY': 'el-CY', // 🇨🇾 Chipre — Grego (Chipre)
          'EE': 'et-EE', // 🇪🇪 Estónia — Estoniano
          'FI': 'fi-FI', // 🇫🇮 Finlândia — Finlandês
          'FR': 'fr-FR', // 🇫🇷 França — Francês
          'DE': 'de-DE', // 🇩🇪 Alemanha — Alemão
          'GR': 'el-GR', // 🇬🇷 Grécia — Grego
          'IE': 'en-IE', // 🇮🇪 Irlanda — Inglês (Irlanda)
          'IT': 'it-IT', // 🇮🇹 Itália — Italiano
          'LV': 'lv-LV', // 🇱🇻 Letónia — Letão
          'LT': 'lt-LT', // 🇱🇹 Lituânia — Lituano
          'LU': 'fr-LU', // 🇱🇺 Luxemburgo — Francês (Luxemburgo)
          'MT': 'mt-MT', // 🇲🇹 Malta — Maltês
          'NL': 'nl-NL', // 🇳🇱 Países Baixos — Neerlandês
          'PT': 'pt-PT', // 🇵🇹 Portugal — Português (Portugal)
          'SK': 'sk-SK', // 🇸🇰 Eslováquia — Eslovaco
          'SI': 'sl-SI', // 🇸🇮 Eslovénia — Esloveno
          'ES': 'es-ES', // 🇪🇸 Espanha — Espanhol (Espanha)
          'HR': 'hr-HR', // 🇭🇷 Croácia — Croata

           const mockLocale = 'pt-AO'; // Ex: IDIOMA PARA DEFINIR A MOEDA
          const mockCurrencyCode = 'AOA'; // Ex: REGIÃO PARA DEFINIR A MOEDA, O IDIOMA E A REGIA SAO COMBINADOS PARA DEFINIR A MOEDA
          */}

          // 🛑 ENVIAR DADOS DE SESSÃO E MOEDA PARA O REDUX (no carregamento inicial)
          dispatch(setAuthSession({
            userId: mockUserId,
            locale: mockLocale,
            currencyCode: mockCurrencyCode,
            accountRegion: mockAccountRegion, // <--- CORREÇÃO 6: PASSANDO A REGIÃO NO MOCK
          }));

          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }

      } catch (error) {
        console.error("Erro ao verificar status de autenticação:", error);
        dispatch(logoutUser()); // Garantir limpeza em caso de erro
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
    // NOTA: Adicione 'dispatch' às dependências se estiver usando React 18+
  }, [dispatch]);


  const value = useMemo(() => ({
    isLoggedIn,
    isLoading,
    signIn,
    signOut
  }), [isLoggedIn, isLoading, signIn, signOut]);


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Exporte a interface para ser usada em outros lugares (como no seu RootLayout)
// O export de cima já garante isso: export interface AuthContextType