// app/_layout.tsx
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
// import { AudioPlayerProvider } from '@/contexts/AudioPlayerContext'; // <<-- REMOVA ESTA LINHA

// IMPORTAÇÕES DO REDUX
import { Provider } from 'react-redux';
import { store } from '@/src/redux/store'; // Ajuste o caminho conforme onde você colocou a pasta src/redux
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '@/src/redux/store';
import { Audio } from 'expo-av'; // Para configurar o modo de áudio globalmente
import { getAudioManager } from '@/src/utils/audioManager'; // Para descarregar o áudio ao sair

export {
  ErrorBoundary,
} from 'expo-router';
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

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
          //interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID.DO_NOT_MIX, // ✅ corrigido aqui
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        console.log("Audio mode configured.");
      } catch (e) {
        console.error("Failed to set audio mode", e);
      }
    };
    configureAudioMode();

    // Limpeza: descarregar o AudioManager quando o componente RootLayout for desmontado
    // (o que geralmente acontece apenas quando o app é fechado)
    return () => {
      getAudioManager().unload();
    };
  }, []); // Executa apenas uma vez na montagem

  if (!loaded) {
    return null;
  }

 return (
  <Provider store={store}>
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
          {/* Adicione sua PlayerBar aqui para que ela apareça em todo o aplicativo,
            inclusive sobre os modais, se desejar. */}
          {/* Você pode usar um View ou um componente personalizado para a PlayerBar aqui */}
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
    </ThemeProvider>
  );
}