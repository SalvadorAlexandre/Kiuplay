// app/contentCardLibraryScreens/single-details/[id].tsx
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { addFavoriteMusic, removeFavoriteMusic } from '@/src/redux/favoriteMusicSlice';
import { Track, setPlaylistAndPlayThunk } from '@/src/redux/playerSlice';

// Importe MOCKED_CLOUD_FEED_DATA
import { MOCKED_CLOUD_FEED_DATA } from '@/app/(tabs)/library'; // Ajuste o caminho conforme necessário

export default function SingleDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // 1. Encontrar o single correspondente nos dados mockados
  // Filtramos para garantir que é um 'single' e fazemos o type assertion
  const singleData = MOCKED_CLOUD_FEED_DATA.find(
    (item) => item.id === id && item.type === 'single'
  ) as Track | undefined; // 'as Track | undefined' para tipar corretamente

  // Se o single não for encontrado, mostramos uma mensagem de erro
  if (!id || !singleData) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Detalhes do Single" }} />
        <Text style={styles.errorText}>Single com ID "{id}" não encontrado.</Text>
      </View>
    );
  }

  // Agora, `singleData` é o seu `mockedSingleDetails` real
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

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: currentSingle.title, headerBackTitle: 'Voltar' }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: currentSingle.cover}} style={styles.coverImage} />
        <Text style={styles.title}>{currentSingle.title}</Text>
        <Text style={styles.subtitle}>{currentSingle.artist}</Text>
        <Text style={styles.description}>{currentSingle.description || 'Nenhuma descrição disponível.'}</Text>
        <Text style={styles.infoText}>Data de Lançamento: {currentSingle.releaseDate || 'N/A'}</Text>

        <TouchableOpacity style={styles.button} onPress={handlePlaySingle}>
          <Text style={styles.buttonText}>Tocar Single</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
          <Ionicons
            name={isCurrentSingleFavorited ? 'heart' : 'heart-outline'}
            size={30}
            color={isCurrentSingleFavorited ? '#FF3D00' : '#fff'}
          />
          <Text style={styles.favoriteButtonText}>
            {isCurrentSingleFavorited ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ... seus estilos existentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  coverImage: {
    width: 250,
    height: 250,
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1E90FF', // DodgerBlue
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    gap: 10,
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#1E90FF',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});