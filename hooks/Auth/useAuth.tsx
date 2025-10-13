// hooks/useAuth.ts
import React, { useState, useEffect, useContext, useMemo } from 'react';
// Importe AsyncStorage se for usá-lo para persistência de token
// import AsyncStorage from '@react-native-async-storage/async-storage'; 

// =========================================================================
// 1. DEFINIÇÃO DA INTERFACE DO CONTEXTO
// =========================================================================
export interface AuthContextType {
  isLoggedIn: boolean;
  // 🛑 MELHORIA 1: Adicionando isLoading
  isLoading: boolean;
  // Adicione as funções de autenticação aqui
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// =========================================================================
// 2. CRIAÇÃO DO CONTEXTO
// =========================================================================

// Definindo valores padrões para o contexto. 
// O estado inicial mais seguro é: isLoggedOut e is_loading.
const AuthContext = React.createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true, // Começa como true
  signIn: async () => { }, // Funções vazias
  signOut: async () => { }, // Funções vazias
});

// =========================================================================
// 3. HOOK PARA CONSUMIR O CONTEXTO
// =========================================================================
// Você pode simplificar a verificação de uso aqui:
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

  // **ESTADOS**
  const [isLoggedIn, setIsLoggedIn] = useState(false);// <- AQUI esta o estado inicial se esta logado ou não
  const [isLoading, setIsLoading] = useState(true); // 🛑 MELHORIA 2: Começa carregando

  // **FUNÇÕES DE AUTENTICAÇÃO (MOCK)**

  const signIn = async (token: string) => {
    // Lógica real: Salvar token no AsyncStorage, chamar a API, etc.
    console.log("Usuário logado. Token:", token);
    // await AsyncStorage.setItem('userToken', token);
    setIsLoggedIn(true);
  };

  const signOut = async () => {
    // Lógica real: Remover token do AsyncStorage, chamar API de logout, etc.
    console.log("Usuário deslogado.");
    // await AsyncStorage.removeItem('userToken');
    setIsLoggedIn(false);
  };

  // **EFEITO PARA CARREGAMENTO E VERIFICAÇÃO INICIAL**
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 🛑 Lógica real:
        // 1. Tentar ler o token persistido (ex: AsyncStorage.getItem('userToken'))
        // 2. Se o token existir, validar (opcionalmente chamando a API) e definir isLoggedIn(true)

        // MOCK para simular o tempo de verificação (500ms)
        await new Promise(resolve => setTimeout(resolve, 500));

        // MOCK: Defina o estado de login como false (para exibir o login)
        const persistedToken = null; // Mude para um valor se quiser testar o AppStack
        if (persistedToken) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }

      } catch (error) {
        console.error("Erro ao verificar status de autenticação:", error);
        setIsLoggedIn(false);
      } finally {
        // 🛑 O mais importante: Marcar o carregamento como concluído
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);


  const value = useMemo(() => ({
    isLoggedIn,
    isLoading, // 🛑 MELHORIA 3: Retornando isLoading no valor do contexto
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