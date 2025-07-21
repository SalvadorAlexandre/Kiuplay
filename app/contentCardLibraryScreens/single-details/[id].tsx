// app/contentCardLibraryScreens/single-details/[id].tsx
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { addFavoriteMusic, removeFavoriteMusic } from '@/src/redux/favoriteMusicSlice';
import { Track, setPlaylistAndPlayThunk } from '@/src/redux/playerSlice';
import { BlurView } from 'expo-blur';
import { MOCKED_CLOUD_FEED_DATA } from '@/app/(tabs)/library';

export default function SingleDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const singleData = MOCKED_CLOUD_FEED_DATA.find(
    (item) => item.id === id && item.type === 'single'
  ) as Track | undefined;

  if (!id || !singleData) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>Single com ID "{id}" não encontrado.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentSingle: Track = singleData;

  const favoritedMusics = useAppSelector((state) => state.favoriteMusic.musics);
  const isCurrentSingleFavorited = favoritedMusics.some((music) => music.id === currentSingle.id);

  const handleToggleFavorite = useCallback(() => {
    if (isCurrentSingleFavorited) {
      dispatch(removeFavoriteMusic(currentSingle.id));
    } else {
      dispatch(addFavoriteMusic(currentSingle));
    }
  }, [dispatch, currentSingle, isCurrentSingleFavorited]);

  const handlePlaySingle = useCallback(async () => {
    if (!currentSingle.uri) {
      Alert.alert("Erro", "URI da música não disponível para reprodução.");
      return;
    }
    const singlePlaylist: Track[] = [currentSingle];

    dispatch(setPlaylistAndPlayThunk({
      newPlaylist: singlePlaylist,
      startIndex: 0,
      shouldPlay: true,
    }));
  }, [dispatch, currentSingle]);

  const coverSource = currentSingle.cover
    ? { uri: currentSingle.cover }
    : require('@/assets/images/Default_Profile_Icon/unknown_track.png');

  return (
    <ImageBackground
      source={coverSource}
      blurRadius={Platform.OS === 'android' ? 10 : 0}
      style={styles.imageBackground}
      resizeMode="cover"
    >
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
        <SafeAreaView style={styles.safeArea}>
          <Stack.Screen options={{ headerShown: false }} />

          <TouchableOpacity style={styles.customBackButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={30} color="#fff" />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.coverContainer}>
              <Image source={coverSource} style={styles.coverImage} />
            </View>

            <Text style={styles.title}>{currentSingle.title}</Text>
            <Text style={styles.subtitle}>{currentSingle.artist}</Text>
            <Text style={styles.description}>{currentSingle.description || 'Nenhuma descrição disponível.'}</Text>
            <Text style={styles.infoText}>Data de Lançamento: {currentSingle.releaseDate || 'N/A'}</Text>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.playButtonFixed} onPress={handlePlaySingle}>
                {/* NOVO: Ícone de play */}
                <Ionicons name="play" size={20} color="#fff" />
                <Text style={styles.buttonText}>Ouvir</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.favoriteButtonIcon} onPress={handleToggleFavorite}>
                <Ionicons
                  name={isCurrentSingleFavorited ? 'heart' : 'heart-outline'}
                  size={30}
                  color={isCurrentSingleFavorited ? '#FF3D00' : '#fff'}
                />
              </TouchableOpacity>
            </View>

          </ScrollView>
        </SafeAreaView>
      </BlurView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#191919',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  customBackButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 0 : 20,
    left: 15,
    zIndex: 10,
    padding: 10,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 60 : 80,
  },
  coverContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
  },
  coverImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8, // Ajustado ligeiramente para melhor espaçamento
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 5, // Ajustado ligeiramente para melhor espaçamento
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 5, // Ajustado ligeiramente para melhor espaçamento
    lineHeight: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 5,
    textAlign: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    gap: 15,
  },
  playButtonFixed: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
    width: 180,
    flexDirection: 'row', // Adicionado para alinhar ícone e texto
    alignItems: 'center', // Adicionado para alinhar ícone e texto verticalmente
    justifyContent: 'center', // Centraliza o conteúdo (ícone + texto) horizontalmente
    gap: 8, // Espaçamento entre o ícone e o texto
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    //fontWeight: 'bold',
  },
  favoriteButtonIcon: {
    //backgroundColor: '#333',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#1E90FF',
    fontSize: 16,
  },
});