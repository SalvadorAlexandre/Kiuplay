// app/contentCardLibraryScreens/ep-details/[id].tsx
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';

// IMPORTAÇÕES DOS NOVOS COMPONENTES
import { TrackListItem } from '@/components/TrackListItem';
import { EpHeader } from '@/components/EpHeader';

import { setPlaylistAndPlayThunk } from '@/src/redux/playerSlice';
import { toggleFavoriteEPWithSingles } from '@/src/redux/favoriteEpSlice';
import { toggleFavoriteSingle } from '@/src/redux/favoriteSinglesSlice';
import { getLibraryContentDetails } from '@/src/api/feedApi';
import { useTranslation } from '@/src/translations/useTranslation';
import { ExtendedPlayEP, Single } from '@/src/types/contentType';

export default function EpDetailsScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const favoritedMusics = useAppSelector((state) => state.favoriteSingles.items);
  const favoriteEPs = useAppSelector((state) => state.favoriteEPs.items);
  const { currentTrack } = useAppSelector((state) => state.player);

  const [currentEp, setCurrentEp] = useState<ExtendedPlayEP | null>(null);
  const [loading, setLoading] = useState(true);

  // Reatividade do Coração (Calculado a cada render do Redux)
  const isCurrentEPFavorited = useMemo(() => 
    favoriteEPs.some(ep => String(ep.id) === String(id)), 
  [favoriteEPs, id]);

  useEffect(() => {
    async function fetchEp() {
      if (!id) return;
      const result = await getLibraryContentDetails(id as string);
      if (result.success && result.data) {
        const rawData = result.data as any;
        setCurrentEp({
          ...rawData,
          tracks: rawData.tracks.map((it: any) => ({ ...it.track, source: 'library-artist' })),
          category: 'ep'
        });
      }
      setLoading(false);
    }
    fetchEp();
  }, [id]);

  const handlePlayEp = useCallback(() => {
    if (currentEp) dispatch(setPlaylistAndPlayThunk({ newPlaylist: currentEp.tracks, startIndex: 0, shouldPlay: true }));
  }, [currentEp]);

  const handleToggleFavoriteEP = useCallback(() => {
    if (currentEp) dispatch(toggleFavoriteEPWithSingles(currentEp));
  }, [currentEp]);

  if (loading) return <View style={{flex:1, backgroundColor:'#000', justifyContent:'center'}}><ActivityIndicator size="large" color="#fff" /></View>;

  return (
    <View style={{ flex: 1, backgroundColor: '#191919' }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <FlatList
        data={currentEp?.tracks}
        keyExtractor={(item) => item.id}
        extraData={{ isCurrentEPFavorited, currentTrack, favoritedMusics }}
        ListHeaderComponent={() => (
          <EpHeader 
            currentEp={currentEp!} 
            isFavorited={isCurrentEPFavorited}
            onToggleFavorite={handleToggleFavoriteEP}
            onPlayEp={handlePlayEp}
            router={router}
            t={t}
          />
        )}
        renderItem={({ item }) => (
          <TrackListItem
            track={item}
            onPlay={(track) => dispatch(setPlaylistAndPlayThunk({ newPlaylist: currentEp!.tracks, startIndex: currentEp!.tracks.findIndex(tx => tx.id === track.id), shouldPlay: true }))}
            isFavorited={favoritedMusics.some(fav => fav.id === item.id)}
            onToggleFavorite={(track) => dispatch(toggleFavoriteSingle(track))}
            isCurrent={currentTrack?.id === item.id}
          />
        )}
      />
    </View>
  );
}


















{/** 
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

  errorIconCircle: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  errorAlertBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  errorTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
  
  */}
