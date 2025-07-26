// app/contentCardLibraryScreens/artist-profile/[id].tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux'; // NOVO: Importa hooks do Redux
import { RootState } from '@/src/redux/store'; // NOVO: Importa RootState
import { addFollowedArtist, removeFollowedArtist, FollowedArtist } from '@/src/redux/followedArtistsSlice';
import { MOCKED_CLOUD_FEED_DATA } from '@/app/(tabs)/library';
import { ArtistProfile, Album, Single } from '@/src/types/contentType'; // Importado Single também

// NOVO: Defina uma interface mais específica para os itens de conteúdo do artista
interface ArtistContentItem {
  id: string;
  title: string;
  type: 'album' | 'single' | 'ep';
  cover: string;
}

export default function ArtistProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch(); // NOVO: Inicializa useDispatch
  const followedArtists = useSelector((state: RootState) => state.followedArtists.artists); // NOVO: Obtém artistas seguidos do Redux

  // Mock de perfil do artista (isto viria de uma API em um app real)
  const mockedArtistProfile = {
    id: id as string,
    name: `Artista: ${id}`,
    avatar: `https://i.pravatar.cc/200?u=${id}`,
    bio: `Biografia do artista com ID: ${id}. Um talento musical inovador e inspirador, com um som único que cativa a todos.`,
    genres: ['Pop', 'R&B', 'Hip Hop'],
    // NOVO: Vamos mockar os seguidores dinamicamente para cada ID
    followers: `${(Math.floor(Math.random() * 500) + 100) / 100}M`, // Ex: 1.2M, 2.5M
    albums: [
      { id: 'art_alb1_' + id, title: 'Melhores Hits', type: 'album', cover: 'https://placehold.co/100x100/FFD700/000000?text=Alb1' },
      { id: 'art_sing1_' + id, title: 'Single Vencedor', type: 'single', cover: 'https://placehold.co/100x100/FF6347/FFFFFF?text=Sing1' },
      { id: 'art_ep1_' + id, title: 'Mini Coleção EP', type: 'ep', cover: 'https://placehold.co/100x100/ADD8E6/000000?text=EP1' },
    ] as ArtistContentItem[],
  };

  // NOVO: Verifica se o artista atual é seguido
  const isFollowing = followedArtists.some(artist => artist.id === mockedArtistProfile.id);

  // NOVO: Função para alternar o status de seguir
  const handleToggleFollow = () => {
    if (isFollowing) {
      dispatch(removeFollowedArtist(mockedArtistProfile.id));
      console.log(`Deixou de seguir: ${mockedArtistProfile.name}`);
    } else {
      // Cria um objeto FollowedArtist com os dados necessários
      const artistToFollow: FollowedArtist = {
        id: mockedArtistProfile.id,
        name: mockedArtistProfile.name,
        profileImageUrl: mockedArtistProfile.avatar,
        // Adicione outras propriedades se a interface FollowedArtist exigir
      };
      dispatch(addFollowedArtist(artistToFollow));
      console.log(`Começou a seguir: ${mockedArtistProfile.name}`);
    }
  };

  if (!id) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Perfil do Artista" }} />
        <Text style={styles.errorText}>ID do Artista não encontrado.</Text>
      </View>
    );
  }

  const renderContentItem = ({ item }: { item: ArtistContentItem }) => (
    <TouchableOpacity
      style={styles.contentItem}
      onPress={() =>
        router.push({
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

        {/* NOVO: Botão de Seguir/Deixar de Seguir dinâmico */}
        <TouchableOpacity
          style={[styles.button, isFollowing ? styles.buttonFollowing : styles.buttonFollow]}
          onPress={handleToggleFollow}
        >
          <Text style={styles.buttonText}>{isFollowing ? 'Seguindo' : 'Seguir Artista'}</Text>
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 30,
    minWidth: 150, // Garante que o botão tenha um tamanho mínimo
    alignItems: 'center',
    justifyContent: 'center',
  },
  // NOVO: Estilo para quando o botão está no estado "Seguir"
  buttonFollow: {
    backgroundColor: '#1E90FF',
  },
  // NOVO: Estilo para quando o botão está no estado "Seguindo"
  buttonFollowing: {
    backgroundColor: '#333', // Uma cor mais neutra para indicar que já está seguindo
    borderWidth: 1,
    borderColor: '#555',
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