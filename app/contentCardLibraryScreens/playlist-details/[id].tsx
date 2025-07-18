// app/contentCardLibraryScreens/playlist-details/[id].tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';

export default function PlaylistDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // NO FUTURO: Aqui você buscará os detalhes completos da playlist e suas faixas
  const mockedPlaylistDetails = {
    id: id as string,
    name: `Playlist: ${id}`,
    creator: 'Kiuplay Music',
    cover: `https://placehold.co/400x400/DAA520/000000?text=Playlist+${id}`,
    description: `Uma compilação cuidadosamente selecionada de músicas para a playlist com ID: ${id}. Perfeita para qualquer momento!`,
    tracks: [ // Exemplo de faixas na playlist
      { id: 'pl_t1', title: 'Faixa da Playlist 1', artist: 'Artista A', duration: '3:20' },
      { id: 'pl_t2', title: 'Outra Faixa', artist: 'Artista B', duration: '4:00' },
      { id: 'pl_t3', title: 'Música Incrível', artist: 'Artista C', duration: '3:55' },
      { id: 'pl_t4', title: 'Batida Relax', artist: 'Artista D', duration: '2:40' },
    ],
  };

  if (!id) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Detalhes da Playlist" }} />
        <Text style={styles.errorText}>ID da Playlist não encontrado.</Text>
      </View>
    );
  }

  const renderTrackItem = ({ item }: { item: { id: string; title: string; artist: string; duration: string } }) => (
    <TouchableOpacity style={styles.trackItem} onPress={() => { /* Lógica para tocar a faixa */ }}>
      <Text style={styles.trackTitle}>{item.title}</Text>
      <Text style={styles.trackArtist}>{item.artist}</Text>
      <Text style={styles.trackDuration}>{item.duration}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: mockedPlaylistDetails.name, headerBackTitle: 'Voltar' }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: mockedPlaylistDetails.cover }} style={styles.coverImage} />
        <Text style={styles.title}>{mockedPlaylistDetails.name}</Text>
        <Text style={styles.subtitle}>Criado por: {mockedPlaylistDetails.creator}</Text>
        <Text style={styles.description}>{mockedPlaylistDetails.description}</Text>

        <TouchableOpacity style={styles.button} onPress={() => { /* Lógica para tocar a playlist */ }}>
          <Text style={styles.buttonText}>Tocar Playlist</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Faixas da Playlist</Text>
        <FlatList
          data={mockedPlaylistDetails.tracks}
          keyExtractor={(item) => item.id}
          renderItem={renderTrackItem}
          scrollEnabled={false}
        />

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

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
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  trackItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  trackArtist: {
    color: '#aaa',
    fontSize: 14,
    marginRight: 10,
  },
  trackDuration: {
    color: '#bbb',
    fontSize: 14,
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