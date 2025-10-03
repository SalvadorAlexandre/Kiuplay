// app/_layout.tsx
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react'; // Já está aqui, mas é importante!
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
// import { AudioPlayerProvider } from '@/contexts/AudioPlayerContext'; // <<-- REMOVA ESTA LINHA

// IMPORTAÇÕES DO REDUX
import { Provider } from 'react-redux';
import { store } from '@/src/redux/store'; // Ajuste o caminho conforme onde você colocou a pasta src/redux
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '@/src/redux/store'; // A persistor é exportada do store
import { Audio } from 'expo-av'; // Para configurar o modo de áudio globalmente
import { getAudioManager } from '@/src/utils/audioManager'; // Para descarregar o áudio ao sair

// NOVO: Importações para o status da rede
import NetInfo from '@react-native-community/netinfo'; // Importa NetInfo
import { setNetworkStatus } from '@/src/redux/networkSlice'; // Importa a ação para definir o status da rede
import { Card } from 'react-native-paper';


export {
  ErrorBoundary,
} from 'expo-router';
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Impede que a tela de splashscreen seja ocultada automaticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Configuração do modo de áudio no início do aplicativo
  useEffect(() => {
    const configureAudioMode = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          // interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID.DO_NOT_MIX, // Corrigido
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        console.log("Audio mode configured.");
      } catch (e) {
        console.error("Failed to set audio mode", e);
      }
    };
    configureAudioMode();

    // Limpeza para o AudioManager
    return () => {
      getAudioManager().unload();
    };
  }, []); // Executa apenas uma vez na montagem


  // NOVO useEffect para o listener de status da rede
  useEffect(() => {
    // Inicia a escuta por mudanças no status da rede
    const unsubscribe = NetInfo.addEventListener(state => {
      // Despacha o status de conexão para o Redux store
      // state.isConnected pode ser true, false ou null (quando o estado é desconhecido)
      store.dispatch(setNetworkStatus(state.isConnected));
    });

    // Retorna uma função de limpeza para desinscrever o listener quando o componente for desmontado
    return () => {
      unsubscribe(); // Remove o listener
    };
  }, []); // O array de dependências vazio garante que este efeito seja executado apenas uma vez.


  if (!loaded) {
    return null;
  }

  return (
    // Envolve toda a sua árvore de componentes com o Provider do Redux
    <Provider store={store}>
      {/* PersistGate aguarda o estado ser reidratado do armazenamento persistente */}
      <PersistGate loading={null} persistor={persistor}>
        <RootLayoutNav />
      </PersistGate>
    </Provider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Você pode adicionar telas modais ou outras aqui */}
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        {/* Adicione suas telas de detalhes que você já tinha */}
        <Stack.Screen name="contentCardLibraryScreens/single-details/[id]" options={{ title: "Detalhes do Single" }} />
        <Stack.Screen name="contentCardLibraryScreens/album-details/[id]" options={{ title: "Detalhes do Álbum" }} />
        <Stack.Screen name="contentCardLibraryScreens/ep-details/[id]" options={{ title: "Detalhes do EP" }} />
        <Stack.Screen name="contentCardLibraryScreens/artist-profile/[id]" options={{ title: "Perfil do Artista" }} />
        <Stack.Screen name="contentCardLibraryScreens/playlist-details/[id]" options={{ title: "Detalhes da Playlist" }} />
      </Stack>
    </ThemeProvider>
  );
}