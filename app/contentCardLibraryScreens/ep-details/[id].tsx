// app/contentCardLibraryScreens/ep-details/[id].tsx
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ImageBackground,
  Platform,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { setPlaylistAndPlayThunk, } from '@/src/redux/playerSlice';
import { addFavoriteMusic, removeFavoriteMusic } from '@/src/redux/favoriteMusicSlice'; // Adicionado para favoritar EP/faixas
import { Ionicons } from '@expo/vector-icons';
import { MOCKED_CLOUD_FEED_DATA } from '@/src/types/contentServer';
import { ExtendedPlayEP, Single } from '@/src/types/contentType'; // Importado Single também
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';


import { useTranslation } from '@/src/translations/useTranslation';

// Componente para renderizar cada item da faixa na FlatList
const TrackListItem = ({ track, onPlay, isFavorited, onToggleFavorite, isCurrent }: { // NOVO: Adicione isCurrent
  track: Single;
  onPlay: (track: Single) => void;
  isFavorited: boolean;
  onToggleFavorite: (track: Single) => void;
  isCurrent: boolean; // NOVO: Tipo para isCurrent
}) => {
  const isConnected = useAppSelector((state) => state.network.isConnected)
  // NOVO: Obtenha o currentTrack do estado do player


  const getImageSource = () => {
    if (isConnected === false || !track.cover || track.cover.trim() === '') {
      return require('@/assets/images/Default_Profile_Icon/unknown_track.png');
    }
    return { uri: track.cover };
  };

  const imageSource = getImageSource();

  return (
    <TouchableOpacity
      style={[
        trackItemStyles.container,
        isCurrent && trackItemStyles.currentTrackItem,
      ]}
      onPress={() => onPlay(track)}
    >
      <Image
        source={imageSource}
        style={trackItemStyles.coverImage}
        
      />
      <View style={trackItemStyles.infoContainer}>
        <Text style={trackItemStyles.title} numberOfLines={1}>
          {isCurrent ? '▶ ' : ''}{track.title}
        </Text>
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
  currentTrackItem: { // NOVO: Estilo para a faixa atual
    //backgroundColor: 'rgba(30, 144, 255, 0.2)', // Exemplo: um fundo azul claro transparente
    borderRadius: 8, // Opcional: bordas arredondadas para o destaque
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
    resizeMode: "cover"
  },
});




export default function EpDetailsScreen() {

  const { t } = useTranslation()

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
        <Text style={styles.errorText}>{t('epDetails.notFound')}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>{t('epDetails.backButton')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const currentEp: ExtendedPlayEP = EpData;

  const favoritedMusics = useAppSelector((state) => state.favoriteMusic.musics);

  
  const { currentTrack } = useAppSelector((state) => state.player);
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


  // NOVO: Componente/Função para o cabeçalho da FlatList
  const ListHeaderComponent = useCallback(() => (
    <View style={styles.headerContentContainer}> {/* Novo estilo para o conteúdo do cabeçalho */}
      <ImageBackground
        source={coverSource}
        blurRadius={Platform.OS === 'android' ? 10 : 0}
        style={styles.imageBackground} // Este estilo vai precisar de ajustes
        
      >
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>

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

          <View style={styles.coverAndDetailsSection}> {/* Novo View para alinhar capa e textos */}
            <Image source={coverSource} style={styles.coverImage} />

            {/* Detalhes do EP (Título, Artista, Produtor, Feat, Ano, Gênero, Plays, Faixas) */}
            <Text style={styles.title}>{currentEp.title}</Text>
            <Text style={styles.artistName}>{currentEp.artist}</Text>

            <Text style={styles.detailText}>
              {`${currentEp.category.charAt(0).toUpperCase() + currentEp.category.slice(1)} • ${currentEp.releaseYear || t('epDetails.unknownYear')} • ${t('epDetails.tracksCount', { count: currentEp.tracks?.length || 0 })}`}
            </Text>

            <Text style={styles.detailText}>
              {currentEp.mainGenre || t('epDetails.unknownGenre')}
            </Text>
          </View>

          {/* *** ADICIONANDO O DEGRADÊ AQUI *** */}
          <LinearGradient
            colors={['transparent', styles.container.backgroundColor || '#191919']}
            style={styles.fadeOverlay}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />

          <View style={styles.playButtonContainer}> {/* Novo estilo para o botão de play */}
            <TouchableOpacity onPress={handlePlayEp}>
              <Ionicons name={'play-circle'} size={48} color="#fff" />
            </TouchableOpacity>
          </View>

        </BlurView>
      </ImageBackground>
    </View>
  ), [currentEp, coverSource, artistAvatarSrc, handlePlayEp, router, isConnected]); // Dependências do useCallback

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* A FlatList agora é o componente principal de rolagem */}
      <FlatList
        data={currentEp.tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrackListItem
            track={item}
            onPlay={handlePlayTrack}
            isFavorited={favoritedMusics.some(favTrack => favTrack.id === item.id)}
            onToggleFavorite={handleToggleFavoriteTrack}
            isCurrent={currentTrack?.id === item.id}
          />
        )}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.trackListContent}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>{t('epDetails.emptyList')}</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919', // Fundo escuro geral
  },
  // NOVO: Estilo para o container do cabeçalho da FlatList
  headerContentContainer: {
    width: '100%',
    // Sem height fixo aqui, pois o ImageBackground e seu conteúdo definirão a altura
    // O flex: 1 no ImageBackground vai fazer com que ele preencha o espaço disponível
    // dentro de ListHeaderComponent, mas precisamos garantir que ele tenha um tamanho.
    // Vamos definir uma altura mínima para ImageBackground.
  },
  imageBackground: {
    width: '100%',
    height: 450, // Ajuste esta altura conforme o desejado para a seção da capa
    justifyContent: 'flex-start', // Alinha o conteúdo ao topo
    paddingHorizontal: 15, // Adicionado padding para o conteúdo interno
    resizeMode: "cover"
  },
  headerBar: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginLeft: 19,
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
  coverAndDetailsSection: { // NOVO: Container para a capa e textos do EP
    alignItems: 'center', // Centraliza a capa e os textos
    marginTop: 20, // Espaço após o headerBar
  },
  coverImage: {
    width: 140,
    height: 140,
    borderRadius: 12, // Adicionado de volta para bordas arredondadas
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    marginBottom: 15, // Espaço entre a capa e o título
  },
  title: {
    fontSize: 24, // Aumentei um pouco para destaque
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
    textAlign: 'center', // Centraliza o título
  },
  artistName: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center', // Centraliza o nome do artista
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center', // Centraliza os detalhes
  },
  playButtonContainer: { // NOVO: Container para o botão de play
    alignSelf: 'flex-end', // Alinha o botão de play à direita
    marginTop: 'auto', // Empurra para o final do ImageBackground
    marginBottom: 20, // Espaço antes do fim do ImageBackground
    paddingHorizontal: 20,
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
  trackListContent: {
    // paddingBottom: 100, // Mantido, para espaço no fundo
  },
  emptyListText: {
    color: '#bbb',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  fadeOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 160, // Ajuste a altura conforme necessário para o efeito desejado
  },
});