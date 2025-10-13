// app/_layout.tsx
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
// 🛑 IMPORTAÇÃO CORRIGIDA: Incluímos 'Redirect'
import { Stack, Redirect, useSegments, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

// IMPORTAÇÕES DO REDUX
import { Provider } from 'react-redux';
import { store, persistor } from '@/src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';

// IMPORTAÇÕES DE ÁUDIO/REDE
import { Audio } from 'expo-av';
import { getAudioManager } from '@/src/utils/audioManager';
import NetInfo from '@react-native-community/netinfo';
import { setNetworkStatus } from '@/src/redux/networkSlice';

// IMPORTAÇÕES DE AUTENTICAÇÃO
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { View } from 'react-native';

export {
  ErrorBoundary,
} from 'expo-router';

// O grupo (auth) agora é a rota inicial Padrão.
export const unstable_settings = {
  initialRouteName: '(auth)',
};

// Impede que a tela de splashscreen seja ocultada automaticamente
SplashScreen.preventAutoHideAsync();

// =========================================================================
// 1. ROOT LAYOUT (Configurações Globais: Fonts, Redux, Providers)
// =========================================================================
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // --- EFEITOS (Não alterados) ---
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const configureAudioMode = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (e) {
        console.error("Failed to set audio mode", e);
      }
    };
    configureAudioMode();

    return () => {
      getAudioManager().unload();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      store.dispatch(setNetworkStatus(state.isConnected));
    });
    return () => {
      unsubscribe();
    };
  }, []);
  // ------------------------------

  if (!loaded) {
    return null;
  }

  // Envolvimento principal com Redux, PersistGate e AuthProvider
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

function LoadingScreen() {
  return <View style={{ flex: 1, backgroundColor: 'black' }} />;
}

// =========================================================================
// 2. ROOT LAYOUT NAV (Lógica de Autenticação e Navegação Principal)
// =========================================================================
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isLoggedIn, isLoading } = useAuth();

  // 🛑 Para navegação condicional, é melhor usar o useSegments para saber onde estamos.
  const segments = useSegments();
  const inAuthGroup = useMemo(() => segments[0] === '(auth)', [segments]);

  // TRATAMENTO DE CARREGAMENTO INICIAL
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 🛑 CORREÇÃO PRINCIPAL: Redirecionamento forçado se não estiver logado.
  // Se o usuário não está logado E não estamos no grupo (auth), redireciona.
  if (!isLoggedIn && !inAuthGroup) {
    // Redireciona para a rota inicial do grupo de autenticação
    return <Redirect href="/(auth)/sign-in" />;
  }

  // 🛑 CORREÇÃO PRINCIPAL: Redirecionamento forçado se estiver logado.
  // Se o usuário está logado E estamos no grupo (auth), redireciona para a home.
  if (isLoggedIn && inAuthGroup) {
    // Redireciona para a rota inicial das abas
    return <Redirect href="/" />;
  }

  // Se a lógica acima não for aplicada (ou seja, estamos na rota correta:
  // (logado E na área principal) OU (deslogado E na área de auth) ),
  // então renderizamos a pilha de navegação principal.
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppStack />
    </ThemeProvider>
  );
}

// =========================================================================
// 3. APP STACK (Rotas para Usuários Logados E Deslogados)
// =========================================================================
// Renomeei para AppStack e unifiquei a Stack, mas mantive o nome AppStack
// pois você tem muitas rotas de detalhe.
function AppStack() {
  return (
    <Stack>
      {/* 🛑 SOLUÇÃO 1: Oculta o cabeçalho 'Stack' que envolve o Tab Bar. */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* 🛑 SOLUÇÃO 2: Oculta o cabeçalho 'Stack' que envolve o grupo de autenticação.
          Isso remove o botão "Voltar" indesejado quando o usuário está no login. */}
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />

      {/* Suas telas de detalhes existentes (continuarão a ter o cabeçalho Stack) */}
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="contentCardLibraryScreens/single-details/[id]" options={{ title: "Detalhes do Single" }} />
      <Stack.Screen name="contentCardLibraryScreens/album-details/[id]" options={{ title: "Detalhes do Álbum" }} />
      <Stack.Screen name="contentCardLibraryScreens/ep-details/[id]" options={{ title: "Detalhes do EP" }} />
      <Stack.Screen name="contentCardLibraryScreens/artist-profile/[id]" options={{ title: "Perfil do Artista" }} />
      <Stack.Screen name="contentCardLibraryScreens/playlist-details/[id]" options={{ title: "Detalhes da Playlist" }} />

      {/* Tela Not Found (erro 404) */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

// 🛑 REMOVIDO: A função AuthStack foi removida, pois a navegação é unificada no AppStack.