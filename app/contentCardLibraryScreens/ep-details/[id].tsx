// app/contentCardLibraryScreens/ep-details/[id].tsx
import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert, // Adicionado para alertas de play
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { setPlaylistAndPlayThunk, } from '@/src/redux/playerSlice';
import { addFavoriteMusic, removeFavoriteMusic } from '@/src/redux/favoriteMusicSlice'; // Adicionado para favoritar EP/faixas
import { Ionicons } from '@expo/vector-icons';
import { MOCKED_CLOUD_FEED_DATA } from '@/app/(tabs)/library';
import { ExtendedPlayEP, Single } from '@/src/types/contentType'; // Importado Single também

// Componente para renderizar cada item da faixa na FlatList
const TrackListItem = ({ track, onPlay, isFavorited, onToggleFavorite }: {
  track: Single; // Uma faixa dentro do EP é tratada como um Single
  onPlay: (track: Single) => void;
  isFavorited: boolean;
  onToggleFavorite: (track: Single) => void;
}) => {
  // Adicione a lógica de conexão e source da imagem AQUI
  const isConnected = useAppSelector((state) => state.network.isConnected);

  const getImageSource = () => {
    if (isConnected === false || !track.cover || track.cover.trim() === '') {
      return require('@/assets/images/Default_Profile_Icon/unknown_track.png');
    }
    return { uri: track.cover };
  };

  const imageSource = getImageSource();

  return (
    <TouchableOpacity style={trackItemStyles.container} onPress={() => onPlay(track)}>
      <Image
        source={imageSource} // <-- Usando a imageSource calculada
        style={trackItemStyles.coverImage}
        resizeMode="cover"
      />
      <View style={trackItemStyles.infoContainer}>
        <Text style={trackItemStyles.title} numberOfLines={1}>{track.title}</Text>
        <Text style={trackItemStyles.artist} numberOfLines={1}>{track.artist}</Text>
      </View>
      <TouchableOpacity onPress={() => onToggleFavorite(track)} style={trackItemStyles.favoriteButton}>
        <Ionicons name={isFavorited ? 'heart' : 'heart-outline'} size={24} color={isFavorited ? '#FF3D00' : '#bbb'} />
      </TouchableOpacity>
      {/* Você pode adicionar um ícone de menu ou mais opções aqui */}
    </TouchableOpacity>
  );
};

// Estilos para os itens da FlatList
const trackItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  artist: {
    color: '#bbb',
    fontSize: 13,
    marginTop: 2,
  },
  favoriteButton: {
    padding: 5,
  },
  coverImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#333',
  },
});


export default function EpDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const EpData = MOCKED_CLOUD_FEED_DATA.find(
    (item) => item.id === id && item.category === 'ep'
  ) as ExtendedPlayEP | undefined;

  if (!id || !EpData) {
    return (
      <View style={styles.errorContainer}> {/* Alterado para errorContainer para consistência */}
        <Stack.Screen options={{ headerShown: false }} /> {/* Esconde o cabeçalho padrão */}
        <Text style={styles.errorText}>EP com ID "{id}" não encontrado.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const currentEp: ExtendedPlayEP = EpData;

  const favoritedMusics = useAppSelector((state) => state.favoriteMusic.musics);
  // Verifica se o EP em si é favoritado (se ExtendedPlayEP tiver um ID para favoritar)
  // Ou se qualquer uma das músicas do EP é favoritada

  //Verifica se alguma faixa esta nos favoritos
  //const isAnyTrackFavorited = currentEp.tracks?.some(track =>
    //favoritedMusics.some(favTrack => favTrack.id === track.id)
  //);

  const isConnected = useAppSelector((state) => state.network.isConnected);

  const getDynamicCoverSource = () => {
    if (isConnected === false || !currentEp.cover || currentEp.cover.trim() === '') {
      return require('@/assets/images/Default_Profile_Icon/unknown_track.png');
    }
    return { uri: currentEp.cover };
  };
  const coverSource = getDynamicCoverSource();

  const getDynamicUserAvatar = () => {
    if (isConnected === false || !currentEp.artistAvatar || currentEp.artistAvatar.trim() === '') {
      return require('@/assets/images/Default_Profile_Icon/unknown_artist.png');
    }
    return { uri: currentEp.artistAvatar };
  };
  const artistAvatarSrc = getDynamicUserAvatar();

  const handlePlayEp = useCallback(() => {
    if (!currentEp.tracks || currentEp.tracks.length === 0) {
      Alert.alert("Erro", "Este EP não possui faixas para reproduzir.");
      return;
    }
    dispatch(setPlaylistAndPlayThunk({
      newPlaylist: currentEp.tracks,
      startIndex: 0,
      shouldPlay: true,
    }));
  }, [dispatch, currentEp]);


  //Embaralha e inicia reproducao do EP
  //const handleShufflePlayEp = useCallback(() => {
  //  if (!currentEp.tracks || currentEp.tracks.length === 0) {
  //    Alert.alert("Erro", "Este EP não possui faixas para reproduzir.");
   //   return;
   // }
    
    // Embaralha a lista de faixas
   // const shuffledTracks = [...currentEp.tracks].sort(() => Math.random() - 0.5);
   // dispatch(setPlaylistAndPlayThunk({
   //   newPlaylist: shuffledTracks,
   //   startIndex: 0,
   //   shouldPlay: true,
   // }));
  //}, [dispatch, currentEp]);



  //Inicia reproducao a partir de uma faixa clicada
  const handlePlayTrack = useCallback((track: Single) => {
    if (!track.uri) {
      Alert.alert("Erro", "URI da faixa não disponível para reprodução.");
      return;
    }
    dispatch(setPlaylistAndPlayThunk({
      newPlaylist: currentEp.tracks, // Toca a partir da lista completa do EP
      startIndex: currentEp.tracks.findIndex(t => t.id === track.id), // Encontra o índice da faixa clicada
      shouldPlay: true,
    }));
  }, [dispatch, currentEp]);


  //Adiciona ou remove uma faixa dos favoritos
  const handleToggleFavoriteTrack = useCallback((track: Single) => {
    const isCurrentlyFavorited = favoritedMusics.some(favTrack => favTrack.id === track.id);
    if (isCurrentlyFavorited) {
      dispatch(removeFavoriteMusic(track.id));
      Alert.alert("Removido", `"${track.title}" removida dos favoritos.`);
    } else {
      dispatch(addFavoriteMusic(track));
      Alert.alert("Adicionado", `"${track.title}" adicionada aos favoritos.`);
    }
  }, [dispatch, favoritedMusics]);


  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} /> {/* Garante que o cabeçalho padrão não apareça */}

      <View style={{ paddingHorizontal: 15, width: '100%', marginBottom: 20, }}>

        {/* Header Bar (Voltar e Artista Info) */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={30} color="#fff" />
          </TouchableOpacity>
          <View style={styles.artistInfo}>
            <Image source={artistAvatarSrc} style={styles.profileImage} />
            <Text style={styles.artistMainName} numberOfLines={1}>
              {currentEp.artist}
            </Text>
          </View>
        </View>
          <View>
            
            <Image source={coverSource} style={styles.coverImage} />

            {/* Detalhes do EP (Título, Artista, Produtor, Feat, Ano, Gênero, Plays, Faixas) */}

            <Text style={styles.title}>{currentEp.title}</Text>
            <Text style={styles.artistName}>{currentEp.artist}</Text>

            <Text style={styles.detailText}>
              {currentEp.category.charAt(0).toUpperCase() + currentEp.category.slice(1)} • {currentEp.releaseYear || 'Ano Desconhecido'} • {currentEp.tracks?.length || 0} faixas
            </Text>

            <Text style={styles.detailText}>
              {currentEp.mainGenre || 'Gênero Desconhecido'}
            </Text>

          </View>

          <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>

            <TouchableOpacity onPress={handlePlayEp}>
              <Ionicons name={'play-circle'} size={48} color="#fff" />
            </TouchableOpacity>
          </View>
      </View>

      {/* Lista de Faixas do EP */}
      <FlatList
        data={currentEp.tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrackListItem
            track={item}
            onPlay={handlePlayTrack}
            isFavorited={favoritedMusics.some(favTrack => favTrack.id === item.id)}
            onToggleFavorite={handleToggleFavoriteTrack}
          />
        )}
        contentContainerStyle={styles.trackListContent}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>Nenhuma faixa encontrada neste EP.</Text>
        }
      />
    </View >

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919', // Fundo escuro para a parte da lista
  },
  headerBar: {
    marginTop: 40, // Ajuste para SafeArea
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingHorizontal: 15,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  artistMainName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  coverContainer: {
    width: '100%',
    marginTop: 25,
    paddingHorizontal: 15,
  },
  coverImage: {
    width: 140,
    height: 140,
    //borderRadius: 12,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  detailsContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 15, // Espaço inferior para não colar nas ações
    //backgroundColor: '#fff'
  },
  title: {
    fontSize: 20, // Ligeiramente menor que o single para manter proporção
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  artistName: {
    fontSize: 15, // Ligeiramente menor
    color: '#aaa',
    textAlign: 'left',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 15,
    color: '#bbb',
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
  backButton: {
    marginTop: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#1E90FF',
    fontSize: 16,
  },
  playEpButton: {
    backgroundColor: '#1E90FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
  },
  playEpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transparentIconButton: { // Reutilizado do SingleDetailsScreen
    backgroundColor: 'transparent',
    padding: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  // --- ESTILOS PARA A FLATLIST ---
  trackListContent: {
    paddingBottom: 100, // Para garantir que o último item não seja cortado pelo player de música
  },
  emptyListText: {
    color: '#bbb',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});