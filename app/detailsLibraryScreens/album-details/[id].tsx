// app/detailsLibraryScreens/album-details/[id].tsx
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { Ionicons } from '@expo/vector-icons';

// IMPORTAÇÕES DOS COMPONENTES REUTILIZÁVEIS
import { TrackListItem } from '@/components/TrackListItem';
import { AlbumEpHeader } from '@/components/AlbumEpHeader';

// REDUX E API
import { setPlaylistAndPlayThunk } from '@/src/redux/playerSlice';
// Importação correta do Slice de Álbuns e Singles
import { toggleFavoriteAlbumWithSingles } from '@/src/redux/favoriteAlbumsSlice';
import { toggleFavoriteSingle } from '@/src/redux/favoriteSinglesSlice';
import { getLibraryContentDetails } from '@/src/api/feedApi';
import { useTranslation } from '@/src/translations/useTranslation';
import { Album, Single, ExtendedPlayEP } from '@/src/types/contentType';

export default function AlbumDetailsScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // SELETORES REDUX
  // Nota: Verifique se no seu store o nome é 'favoriteSingles' ou 'favoriteMusic'
  const favoritedMusics = useAppSelector((state) => state.favoriteSingles.items);
  const favoriteAlbums = useAppSelector((state) => state.favoriteAlbums.items);
  const { currentTrack } = useAppSelector((state) => state.player);

  // ESTADOS LOCAIS
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- REATIVIDADE DO CORAÇÃO DO ÁLBUM ---
  const isCurrentAlbumFavorited = useMemo(() =>
    favoriteAlbums.some(album => String(album.id) === String(id)),
    [favoriteAlbums, id]);
 
  useEffect(() => {
    async function fetchAlbum() {
      if (!id) return;
      setLoading(true);
      const result = await getLibraryContentDetails(id as string);

      if (result.success && result.data) {
        // Mapeamento para garantir consistência (seguindo o padrão do seu EP)
        const rawData = result.data as any;
        setCurrentAlbum({
          ...rawData,
          tracks: rawData.tracks.map((it: any) => ({
            ...(it.track || it), // Ajuste dependendo de como a API retorna a track
            source: 'library-albumDetail'
          })),
          category: 'album'
        } as Album);
      } else {
        setError(result.error || t('albumDetails.notFound'));
      }
      setLoading(false);
    }
    fetchAlbum();
  }, [id, t]);

  const handlePlayAlbum = useCallback(() => {
    if (currentAlbum?.tracks) {
      dispatch(setPlaylistAndPlayThunk({
        newPlaylist: currentAlbum.tracks,
        startIndex: 0,
        shouldPlay: true
      }));
    }
  }, [currentAlbum, dispatch]);

  // --- LÓGICA DE FAVORITAR ÁLBUM ---
  const handleToggleFavoriteAlbum = useCallback(() => {
    if (currentAlbum) {
      dispatch(toggleFavoriteAlbumWithSingles(currentAlbum));
    }
  }, [currentAlbum, dispatch]);

  // RENDERIZAÇÃO DE LOADING
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // RENDERIZAÇÃO DE ERRO
  if (error || !currentAlbum) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorIconCircle}>
          <Ionicons name="disc-outline" size={80} color="rgba(255, 255, 255, 0.2)" />
          <Ionicons name="alert-circle" size={30} color="#FF3D00" style={styles.errorAlertBadge} />
        </View>
        <Text style={styles.errorTitle}>{t('albumDetails.errorTitle') || 'Ops!'}</Text>
        <Text style={styles.errorText}>{error || t('albumDetails.notFound')}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.backButtonText}>{t('albumDetails.backButton')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <FlatList
        data={currentAlbum.tracks}
        keyExtractor={(item) => item.id}
        extraData={{ isCurrentAlbumFavorited, currentTrack, favoritedMusics }}
        ListHeaderComponent={() => (
          <AlbumEpHeader
            // Fazemos o cast para ExtendedPlayEP apenas para o componente aceitar, 
            // já que as propriedades visuais são as mesmas
            currentAlbumEp={currentAlbum}
            isFavorited={isCurrentAlbumFavorited}
            onToggleFavorite={handleToggleFavoriteAlbum}
            onPlayEp={handlePlayAlbum}
            router={router}
            t={t}
          />
        )}
        renderItem={({ item }) => (
          <TrackListItem
            track={item}
            onPlay={(track) => dispatch(setPlaylistAndPlayThunk({
              newPlaylist: currentAlbum.tracks,
              startIndex: currentAlbum.tracks.findIndex(tx => tx.id === track.id),
              shouldPlay: true
            }))}
            isFavorited={favoritedMusics.some(fav => fav.id === item.id)}
            onToggleFavorite={(track) => dispatch(toggleFavoriteSingle(track))}
            isCurrent={currentTrack?.id === item.id}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>{t('albumDetails.emptyList')}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#191919' },
  loadingContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, backgroundColor: '#191919', justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorIconCircle: { marginBottom: 20, justifyContent: 'center', alignItems: 'center' },
  errorAlertBadge: { position: 'absolute', bottom: 0, right: 0 },
  errorTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  errorText: { color: '#bbb', fontSize: 16, textAlign: 'center', marginBottom: 24 },
  backButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25 },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  emptyText: { color: '#bbb', textAlign: 'center', marginTop: 40 }
});