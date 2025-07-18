// app/contentCardLibraryScreens/single-details/[id].tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
// Você pode precisar importar o tipo Track de playerSlice ou types/library
// import { Track } from '@/src/redux/playerSlice'; // Ou de '@/src/types/library'

export default function SingleDetailsScreen() {
  const { id } = useLocalSearchParams(); // Pega o ID da URL (ex: single-details/single-1)
  const router = useRouter();

  // NO FUTURO: Aqui você buscará os detalhes completos do single usando 'id'
  // Por enquanto, usaremos dados mockados para exibição
  const mockedSingleDetails = {
    id: id as string,
    title: `Single: ${id}`,
    artist: 'Artista Desconhecido',
    cover: `https://placehold.co/400x400/FF6347/FFFFFF?text=Single+${id}`,
    description: `Detalhes completos para o single com ID: ${id}. Esta é uma faixa única de um artista.`,
    releaseDate: '2024-01-01',
    // ...outras propriedades de um single (duração, URI, etc.)
  };

  if (!id) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Detalhes do Single" }} />
        <Text style={styles.errorText}>ID do Single não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Configura o cabeçalho da tela */}
      <Stack.Screen options={{ title: mockedSingleDetails.title, headerBackTitle: 'Voltar' }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: mockedSingleDetails.cover }} style={styles.coverImage} />
        <Text style={styles.title}>{mockedSingleDetails.title}</Text>
        <Text style={styles.subtitle}>{mockedSingleDetails.artist}</Text>
        <Text style={styles.description}>{mockedSingleDetails.description}</Text>
        <Text style={styles.infoText}>Data de Lançamento: {mockedSingleDetails.releaseDate}</Text>

        <TouchableOpacity style={styles.button} onPress={() => { /* Lógica para tocar o single */ }}>
          <Text style={styles.buttonText}>Tocar Single</Text>
        </TouchableOpacity>

        {/* Adicione mais informações ou botões aqui (ex: adicionar à playlist, favoritar) */}

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