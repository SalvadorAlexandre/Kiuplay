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
export interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  // O signIn agora pode receber dados mais complexos, como a resposta da API, além do token.
  signIn: (token: string, userData: { userId: string, locale: string, currencyCode: string }) => Promise<void>;
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

  // 🛑 MUDANÇA: signIn agora aceita os dados de moeda.
  const signIn = async (token: string, userData: { userId: string, locale: string, currencyCode: string }) => {
    // 1. Lógica real: Salvar token no AsyncStorage
    console.log("Usuário logado. Token:", token);
    // await AsyncStorage.setItem('userToken', token);

    // 2. 🛑 ENVIAR DADOS DE SESSÃO E MOEDA PARA O REDUX
    dispatch(setAuthSession({
      userId: userData.userId,
      locale: userData.locale,
      currencyCode: userData.currencyCode,
    }));

    // 3. Definir o estado de login
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
          const mockUserId = 'user-123';
          const mockLocale = 'en-US'; // Ex: Pode vir do token ou do dispositivo
          const mockCurrencyCode = 'USD'; // Ex: Pode vir do token ou do backend

          // 🛑 ENVIAR DADOS DE SESSÃO E MOEDA PARA O REDUX (no carregamento inicial)
          dispatch(setAuthSession({
            userId: mockUserId,
            locale: mockLocale,
            currencyCode: mockCurrencyCode,
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