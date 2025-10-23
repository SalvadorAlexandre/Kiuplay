// hooks/useAuth.ts
import React, { useState, useEffect, useContext, useMemo } from 'react';
// Importe AsyncStorage se for usá-lo para persistência de token
// import AsyncStorage from '@react-native-async-storage/async-storage'; 

// 🛑 NOVOS IMPORTS DO REDUX
import { useAppDispatch } from '@/src/redux/hooks';
import { setAuthSession, logoutUser } from '@/src/redux/userSessionAndCurrencySlice';
import { UserProfile } from '@/src/types/contentType'; // Para tipagem da API
import { useUserLocation } from '@/hooks/localization/useUserLocalization'; // ✅ IMPORTA O HOOK


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

  // ✅ Usa o hook de localização aqui
  const { countryCode, locale, currency, loading: locationLoading } = useUserLocation();


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
      // Espera a localização estar pronta
      if (locationLoading) return;

      try {
        await new Promise(resolve => setTimeout(resolve, 300));

        const persistedToken = true; // MOCK temporário

        if (persistedToken) {
          const mockUserId = 'user-123';
          const accountRegion = countryCode || 'US';
          const userLocale = locale || 'en-US';
          const userCurrency = currency || 'USD';

          dispatch(setAuthSession({
            userId: mockUserId,
            locale: userLocale,
            currencyCode: userCurrency,
            accountRegion,
          }));

          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Erro ao verificar status de autenticação:", error);
        dispatch(logoutUser());
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
    // 🔥 REMOVE 'dispatch' e 'currency' das dependências diretas
  }, [countryCode, locale, locationLoading]);


  const value = useMemo(() => ({
    isLoggedIn,
    isLoading,
    signIn,
    signOut
  }), [isLoggedIn, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
// Exporte a interface para ser usada em outros lugares (como no seu RootLayout)
// O export de cima já garante isso: export interface AuthContextType