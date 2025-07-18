// app/contentCardLibraryScreens/ep-details/[id].tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';

export default function EpDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // NO FUTURO: Aqui você buscará os detalhes completos do EP e suas faixas
  const mockedEpDetails = {
    id: id as string,
    title: `EP: ${id}`,
    artist: 'Vibes Perfeitas',
    cover: `https://placehold.co/400x400/32CD32/FFFFFF?text=EP+${id}`,
    description: `Coleção de faixas do EP com ID: ${id}. Ideal para uma escuta rápida e cativante.`,
    releaseDate: '2024-03-22',
    tracks: [ // Exemplo de faixas no EP
      { id: 'ep_t1', title: 'Intro Vibe', artist: 'Vibes Perfeitas', duration: '2:15' },
      { id: 'ep_t2', title: 'Batida Leve', artist: 'Vibes Perfeitas', duration: '3:05' },
      { id: 'ep_t3', title: 'Momento Relax', artist: 'Vibes Perfeitas', duration: '2:50' },
    ],
  };

  if (!id) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Detalhes do EP" }} />
        <Text style={styles.errorText}>ID do EP não encontrado.</Text>
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
      <Stack.Screen options={{ title: mockedEpDetails.title, headerBackTitle: 'Voltar' }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: mockedEpDetails.cover }} style={styles.coverImage} />
        <Text style={styles.title}>{mockedEpDetails.title}</Text>
        <Text style={styles.subtitle}>{mockedEpDetails.artist}</Text>
        <Text style={styles.description}>{mockedEpDetails.description}</Text>
        <Text style={styles.infoText}>Lançamento: {mockedEpDetails.releaseDate}</Text>

        <TouchableOpacity style={styles.button} onPress={() => { /* Lógica para tocar o EP */ }}>
          <Text style={styles.buttonText}>Tocar EP</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Faixas do EP</Text>
        <FlatList
          data={mockedEpDetails.tracks}
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
  infoText: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 20,
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