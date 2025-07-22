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
  Share,
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

  // FUNÇÃO DE COMENTÁRIOS: Agora usa o caminho exato e não passa commentCount de viewsNumber
  const handleOpenComments = useCallback(() => {
    router.push({
      pathname: '/commentScreens/musics/[musicId]', // Caminho exato
      params: {
        musicId: currentSingle.id,
        musicTitle: currentSingle.title,
        artistName: currentSingle.artist,
        albumArtUrl: currentSingle.cover || '', // Garante string vazia se undefined
        // Removido: commentCount: currentSingle.viewsNumber ? currentSingle.viewsNumber.toString() : '0',
      },
    });
  }, [router, currentSingle]);

  // FUNÇÃO DE COMPARTILHAR: Agora navega para a tela customizada
  const handleShareSingle = useCallback(() => {
    if (!currentSingle) {
      console.warn("Nenhuma música para compartilhar.");
      return;
    }
    router.push({
      pathname: '/shareScreens/music/[musicId]', // Caminho exato da sua tela de compartilhamento
      params: {
        musicId: currentSingle.id,
        musicTitle: currentSingle.title,
        artistName: currentSingle.artist,
        albumArtUrl: currentSingle.cover || '',
      },
    });
  }, [router, currentSingle]);


  const artistAvatarSrc =
    currentSingle.artistAvatar
      ? { uri: currentSingle.artistAvatar }
      : require('@/assets/images/Default_Profile_Icon/unknown_artist.png');

  // Usar 'require' para imagem padrão se currentSingle.cover não estiver disponível
  const coverSource = currentSingle.cover
    ? { uri: currentSingle.cover }
    : require('@/assets/images/Default_Profile_Icon/unknown_track.png'); // Imagem padrão

  return (
    <ImageBackground
      source={coverSource} // Usando a variável coverSource
      blurRadius={Platform.OS === 'android' ? 10 : 0}
      style={styles.imageBackground}
      resizeMode="cover"
    >
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
        <SafeAreaView style={styles.safeArea}>
          <Stack.Screen options={{ headerShown: false }} />

          {/* Barra superior com botão de voltar e perfil do artista - POSICIONADA ABSOLUTAMENTE */}
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={30} color="#fff" />
            </TouchableOpacity>
            <View style={styles.artistInfo}>
              <Image source={artistAvatarSrc} style={styles.profileImage} />
              <Text style={styles.artistMainName} numberOfLines={1}>
                {currentSingle.artist}
              </Text>
            </View>
            {/* Espaçador para empurrar o botão de voltar para a esquerda e o info para o centro-direita */}
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.coverContainer}>
              <Image source={coverSource} style={styles.coverImage} />
            </View>

            <Text style={styles.title}>{currentSingle.title}</Text>
            <Text style={styles.subtitle}>{currentSingle.artist}</Text>
            <Text style={styles.description}>Visualizações: {currentSingle.viewsNumber || 'N/A'}</Text>
            <Text style={styles.infoText}>Lançamento: {currentSingle.releaseDate || 'N/A'}</Text>

            <View style={styles.actionButtonsRow}>
              <View style={styles.playButtonWrapper}> {/* Wrapper para o botão de play */}
                <TouchableOpacity style={styles.playButtonFixed} onPress={handlePlaySingle}>
                  <Ionicons name="play" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Ouvir</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.secondaryActionsRow}> {/* NOVO: Container para curtir, comentar, compartilhar */}
                <TouchableOpacity style={styles.transparentIconButton} onPress={handleToggleFavorite}>
                  <Ionicons
                    name={isCurrentSingleFavorited ? 'heart' : 'heart-outline'}
                    size={24}
                    color={isCurrentSingleFavorited ? '#FF3D00' : '#fff'}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleOpenComments} style={styles.transparentIconButton}>
                  <Image
                    source={require('@/assets/images/audioPlayerBar/icons8_sms_120px.png')}
                    style={styles.iconActions}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleShareSingle} style={styles.transparentIconButton}>
                  <Ionicons name="share-social-outline" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
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
  // NOVO: Estilo para a barra superior (botão de voltar + info do artista)
  headerBar: {
    position: 'absolute', // MUITO IMPORTANTE: para não empurrar o conteúdo
    top: Platform.OS === 'android' ? 10 : 40, // Ajuste para ficar visível na SafeArea
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Espalha os itens na linha
    paddingHorizontal: 15,
    zIndex: 10, // Garante que esteja acima de outros elementos
  },
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1, // Permite que ele cresça e centralize melhor se a tela for larga
    paddingHorizontal: 15,
    //justifyContent: 'center', // Centraliza o conteúdo dentro do artistInfo
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15, // Metade da largura/altura para ser um círculo perfeito
    resizeMode: 'cover',
  },
  artistMainName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold', // Deixei em negrito para destacar
    flexShrink: 1, // Permite que o texto encolha se for muito longo
  },
  scrollContent: {
    //alignItems: 'center', // Centraliza o conteúdo principal (capa, texto, botões)
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 80 : 120, // AUMENTADO: Espaço para a nova barra superior fixa
  },
  coverContainer: {
    width: '100%',
    //alignItems: 'center', // Centraliza a imagem da capa dentro do seu container
    marginBottom: 20, // Aumentado o espaçamento da capa para o título
  },
  coverImage: {
    width: 200, // Aumentado o tamanho da capa para destaque
    height: 200, // Capa quadrada para manter proporção
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
    //textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    //textAlign: 'center',
    marginBottom: 5, // Um pouco mais de espaço
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    //textAlign: 'center',
    marginBottom: 5,
    lineHeight: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 5, // Espaçamento para os botões de ação
    //textAlign: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    width: '90%', // Ajuste para ocupar mais espaço horizontalmente
    justifyContent: 'space-between', // Distribui o botão de play e os ícones
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    // Removido 'gap' daqui, pois os grupos têm 'gap' e 'space-between' lida com o espaçamento principal
  },
  playButtonWrapper: { // NOVO: Wrapper para o botão de play para controlar o flex
    flex: 1, // Permite que o botão de play ocupe o espaço principal
    marginRight: 15, // Espaçamento entre o botão de play e os ícones de ação
  },
  playButtonFixed: {
    backgroundColor: '#1E90FF',
    paddingVertical: 8, // Ajuste de padding para um visual mais agradável
    paddingHorizontal: 20, // Ajuste de padding
    borderRadius: 30,
    // Removido 'width: 100%' para que o 'flex: 1' do wrapper controle
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17, // Ligeiramente menor para caber melhor
    fontWeight: 'bold',
  },
  // NOVO: Container para os botões de ação secundária (curtir, comentar, compartilhar)
  secondaryActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15, // Espaçamento entre os ícones de ação
  },
  // NOVO: Estilo para os botões de curtir, comentar e compartilhar (fundo transparente)
  transparentIconButton: {
    backgroundColor: 'transparent', // Fundo transparente
    padding: 5, // Aumenta a área de toque do ícone
    borderRadius: 20, // Suavemente arredondado, ou 0 para quadrado
    alignItems: 'center',
    justifyContent: 'center',
    // Opcional: borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' para uma borda sutil
  },
  iconActions: {
    width: 24, // Tamanho consistente com Ionicons size
    height: 24, // Tamanho consistente
    resizeMode: 'contain',
  },
  backButton: { // Estilo para o botão de voltar na tela de erro
    marginTop: 20,
    padding: 10,
  },
  backButtonText: { // Estilo para o texto do botão de voltar na tela de erro
    color: '#1E90FF',
    fontSize: 16,
  },
});