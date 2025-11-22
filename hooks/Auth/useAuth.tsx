// hooks/useAuth.tsx
import React, { useState, useEffect, useContext, useMemo } from 'react';
// NOVOS IMPORTS DO REDUX
import { useAppDispatch } from '@/src/redux/hooks';
import { setAuthSession, logoutUser, setUser } from '@/src/redux/userSessionAndCurrencySlice';
import { UserProfile } from '@/src/types/contentType'; // Para tipagem da API
import { useUserLocation } from '@/hooks/localization/useUserLocalization'; // IMPORTA O HOOK
import { mockUserProfile } from '@/src/types/contentServer';

import { tokenStorage } from "@/src/utils/tokenStorage";
import { authApi, userApi } from '@/src/api';


// =========================================================================
// 1. DEFINIÇÃO DA INTERFACE DO CONTEXTO
// =========================================================================
export interface AuthUserData { // Crie uma interface para o payload de dados do usuário
  userId: string;
  locale: string;
  currencyCode: string;
  accountRegion: string; //<--- CORREÇÃO 1: Adicione accountRegion aqui
}

export interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
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
  const signIn = async (email: string, password: string) => {
    try {
      // 1️⃣ Chama o login no backend
      const { token } = await authApi.signIn({ email, password,});

      // 2️⃣ Salva token localmente
      await tokenStorage.setToken(token);

      // 3️⃣ Busca dados reais do usuário com token salvo
      const user = await userApi.getMe();

      // 4️⃣ Atualiza Redux com dados reais do usuário
      dispatch(setAuthSession({
        userId: user.id,
        locale: user.locale || "en-US",
        currencyCode: user.currencyCode || "USD",
        accountRegion: user.accountRegion || "US",
      }));
      dispatch(setUser(user));

      // 5️⃣ Atualiza estado local
      setIsLoggedIn(true);

    } catch (error) {
      console.error("Erro de login:", error);
      throw error;
    }
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
      if (locationLoading) return;

      try {
        const token = await tokenStorage.getToken();

        if (!token) {
          setIsLoggedIn(false);
          setIsLoading(false);
          return;
        }

        // Validar token chamando back-end (opcional)
        const user = await userApi.getMe(); // rota /auth/me no backend

        dispatch(setAuthSession({
          userId: user.id,
          locale: user.locale || "en-US",
          currencyCode: user.currencyCode || "USD",
          accountRegion: user.accountRegion || "US",
        }));

        dispatch(setUser(user));
        setIsLoggedIn(true);

      } catch (error) {
        console.error("Token inválido:", error);
        await tokenStorage.removeToken();
        dispatch(logoutUser());
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [locationLoading]);


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