// app/contentCardLibraryScreens/artist-profile/[id].tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';

// NOVO: Defina uma interface mais específica para os itens de conteúdo do artista
interface ArtistContentItem {
  id: string;
  title: string;
  type: 'album' | 'single' | 'ep'; // NOVO: Tipos explícitos permitidos
  cover: string;
  // Você pode adicionar outras propriedades se necessário, como 'duration' para singles
}

export default function ArtistProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const mockedArtistProfile = {
    id: id as string,
    name: `Artista: ${id}`,
    avatar: `https://i.pravatar.cc/200?u=${id}`,
    bio: `Biografia do artista com ID: ${id}. Um talento musical inovador e inspirador, com um som único que cativa a todos.`,
    genres: ['Pop', 'R&B', 'Hip Hop'],
    followers: '1.2M',
    // ALTERADO: Use a nova interface ArtistContentItem para o array 'albums'
    albums: [
      { id: 'art_alb1', title: 'Melhores Hits', type: 'album', cover: 'https://placehold.co/100x100/FFD700/000000?text=Alb1' },
      { id: 'art_sing1', title: 'Single Vencedor', type: 'single', cover: 'https://placehold.co/100x100/FF6347/FFFFFF?text=Sing1' },
      // Exemplo de EP, se você quiser adicionar:
      // { id: 'art_ep1', title: 'Mini Coleção', type: 'ep', cover: 'https://placehold.co/100x100/ADD8E6/000000?text=EP1' },
    ] as ArtistContentItem[], // NOVO: Cast para o tipo Array de ArtistContentItem
  };

  if (!id) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Perfil do Artista" }} />
        <Text style={styles.errorText}>ID do Artista não encontrado.</Text>
      </View>
    );
  }

  // ALTERADO: Use a nova interface ArtistContentItem para o 'item'
  const renderContentItem = ({ item }: { item: ArtistContentItem }) => (
    <TouchableOpacity
      style={styles.contentItem}
      onPress={() =>
        router.push({
          // ALTERADO: O pathname agora é inferido corretamente pelo TypeScript
          pathname: `/contentCardLibraryScreens/${item.type}-details/[id]`,
          params: { id: item.id },
        })
      }
    >
      <Image source={{ uri: item.cover }} style={styles.contentCover} />
      <Text style={styles.contentTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.contentType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: mockedArtistProfile.name, headerBackTitle: 'Voltar' }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: mockedArtistProfile.avatar }} style={styles.artistAvatar} />
        <Text style={styles.artistName}>{mockedArtistProfile.name}</Text>
        <Text style={styles.artistFollowers}>{mockedArtistProfile.followers} Seguidores</Text>
        <Text style={styles.artistGenres}>Gêneros: {mockedArtistProfile.genres.join(', ')}</Text>
        <Text style={styles.artistBio}>{mockedArtistProfile.bio}</Text>

        <TouchableOpacity style={styles.button} onPress={() => { /* Lógica para seguir/deixar de seguir */ }}>
          <Text style={styles.buttonText}>Seguir Artista</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Conteúdo do Artista</Text>
        <FlatList
          data={mockedArtistProfile.albums}
          keyExtractor={(item) => item.id}
          renderItem={renderContentItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentList}
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
  artistAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#1E90FF',
  },
  artistName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  artistFollowers: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 5,
  },
  artistGenres: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 15,
    textAlign: 'center',
  },
  artistBio: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  contentList: {
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  contentItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 120,
  },
  contentCover: {
    width: 100,
    height: 100,
    borderRadius: 4,
    marginBottom: 8,
  },
  contentTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  contentType: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
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