import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  ActivityIndicator,
  Platform,
  ScrollView,

} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import Animated, { useSharedValue, useAnimatedStyle, } from 'react-native-reanimated';
import { playerStyles as styles } from './playerStyles';
// ZUSTAND
import { usePlayerStore } from '@/src/zustand/usePlayerStore';
import { AudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { toggleFavoriteSingle } from '@/src/redux/favoriteSinglesSlice';
import { useTranslation } from '@/src/translations/useTranslation';

type Props = {
  player: AudioPlayer;
};
/**
 * 1. COMPONENTE FILHO (Onde a mágica acontece)
 * Recebe o 'player' como prop obrigatória (garantido pelo pai)
 */
export function AudioPlayerContent({ player }: Props ) {
  //const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    //player,
    currentTrack,
    isPlaying,
    isExpanded,
    isShuffle,
    repeatMode,
    togglePlay,
    playNext,
    playPrevious,
    toggleShuffle,
    setRepeatMode,
    toggleExpanded,
    seekTo
  } = usePlayerStore();

  // 1. CHAME TODOS OS HOOKS NO TOPO (Sempre, sem exceção)
  //if (!player) return null
  const status = useAudioPlayerStatus(player);
  const progressShared = useSharedValue(0);
  const favoritedSingles = useAppSelector((state) => state.favoriteSingles.items ?? []);

  // 2. TRATE OS DADOS (Use o status do hook, não do store para a UI imediata)
  //const positionMillis = status?.currentTime ?? 0;
  //const durationMillis = status?.duration ?? 0;
  //const isActuallyPlaying = status?.playing ?? false; // Use isso para o ícone
  //const isLoading = status?.isBuffering || false;

  const trackId = currentTrack?.id ?? null;

  const positionMillis = status?.currentTime ?? 0;
  const durationMillis = status?.duration ?? 0;
  const isActuallyPlaying = status?.playing ?? false;
  const isLoading = status?.isBuffering ?? false;

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressShared.value * 100}%`,
    };
  });

  /* =========================================================
   * 3. EFFECTS
   * ======================================================= */
  useEffect(() => {
    if (durationMillis > 0) {
      progressShared.value = positionMillis / durationMillis;
    }
  }, [positionMillis, durationMillis]);

  /* =========================================================
   * 4. DERIVED STATE
   * ======================================================= */
  const isCurrentTrackFavorited =
    trackId !== null &&
    favoritedSingles.some((single) => single?.id === trackId);

  /* =========================================================
   * 5. GUARD – SÓ DEPOIS DOS HOOKS
   * ======================================================= */
  if (!currentTrack) {
    return null;
  }

  /* =========================================================
   * 6. HELPERS
   * ======================================================= */
  function safeText(value: any): string {
    if (value === undefined || value === null) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  }

  const title = safeText(currentTrack.title);
  const artist = safeText(currentTrack.artist);
  const genre = safeText(currentTrack.genre);

  const coverImage =
    typeof currentTrack.cover === 'string' && currentTrack.cover.trim() !== ''
      ? { uri: currentTrack.cover }
      : require('@/assets/images/Default_Profile_Icon/unknown_track.png');

  const artistAvatarSrc =
    typeof currentTrack.artistAvatar === 'string' && currentTrack.artistAvatar.trim() !== ''
      ? { uri: currentTrack.artistAvatar }
      : require('@/assets/images/Default_Profile_Icon/unknown_artist.png');

  /* =========================================================
   * 7. CALLBACKS
   * ======================================================= */
  const handleOpenComments = useCallback(() => {
    router.push({
      pathname: '/commentScreens/musics/[musicId]',
      params: {
        musicId: trackId!,
        musicTitle: currentTrack.title,
        artistName: currentTrack.artist,
        albumArtUrl: currentTrack.cover || '',
        commentCount: '',
      },
    });
  }, [router, trackId, currentTrack]);

  const handleTogglePlayPause = useCallback(() => {
    togglePlay();
  }, [togglePlay]);

  const handleToggleExpanded = useCallback(() => {
    toggleExpanded();
  }, [toggleExpanded]);

  const handleSeekTo = useCallback((v: number) => {
    seekTo(v);
  }, [seekTo]);

  const formatTime = (value?: number | null): string => {
    if (!value || isNaN(value)) return '0:00';

    const totalMillis =
      value < 10000 && durationMillis < 10000 ? value * 1000 : value;

    const totalSeconds = Math.floor(totalMillis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleToggleShuffle = useCallback(() => {
    toggleShuffle();
  }, [toggleShuffle]);

  const handleToggleRepeat = useCallback(() => {
    const modes: ('off' | 'track' | 'all')[] = ['off', 'track', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  }, [repeatMode, setRepeatMode]);

  const handleToggleFavorite = useCallback(() => {
    if (currentTrack.category !== 'single') return;
    dispatch(toggleFavoriteSingle(currentTrack));
  }, [dispatch, currentTrack]);

  const getRepeatIcon = () =>
    repeatMode === 'off' ? 'repeat-outline' : 'repeat';

  const getRepeatColor = () =>
    repeatMode === 'off' ? '#fff' : '#1E90FF';

  const handleShareMusic = useCallback(() => {
    router.push({
      pathname: '/shareScreens/music/[musicId]',
      params: {
        musicId: trackId!,
        musicTitle: currentTrack.title,
        artistName: currentTrack.artist,
        albumArtUrl: currentTrack.cover || '',
      },
    });
  }, [router, trackId, currentTrack]);

  // If there's no currentTrack show nothing
  if (!currentTrack) return null;

  return (
    <View style={[styles.container, isExpanded ? styles.expandedContainer : styles.minimizedContainer]}>

      {!isExpanded ? ( //MODO MINIMIZADO
        <>
          <TouchableOpacity activeOpacity={0.9} style={styles.minimizedBar} onPress={handleToggleExpanded}
          >
            <View style={styles.minimizedLeft}>
              <Image source={coverImage} style={styles.minimizedCover} />
              <View style={{ marginLeft: 8, flexShrink: 1 }}>
                <Text style={styles.trackTitle} numberOfLines={1}>{safeText(title)}</Text>
                <Text style={styles.artistName} numberOfLines={1}>{safeText(artist)}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleTogglePlayPause} style={{ padding: 10 }}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name={isActuallyPlaying ? 'pause' : 'play'} size={28} color="#fff" />
              )}
            </TouchableOpacity>
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <Animated.View style={[styles.progressBar, animatedProgressStyle]} />
          </View>
        </>
      ) : (  //MODO MAXIMIZADO
        <ImageBackground
          source={coverImage}
          blurRadius={Platform.OS === 'android' ? 5 : 0}
          style={styles.imageBackground}
        //resizeMode="cover"
        >
          <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
            <ScrollView
              contentContainerStyle={styles.expandedScrollContent}
              style={styles.expandedScrollView}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.expandedHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <Image source={artistAvatarSrc} style={styles.profileImage} />
                  <Text style={styles.artistMainName} numberOfLines={1}>
                    {safeText(artist)}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity onPress={handleToggleExpanded} style={{ marginLeft: 8 }}>
                    <Ionicons name="chevron-down" size={28} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>

              <Image
                source={coverImage}
                style={styles.expandedCover}
              //resizeMode="cover"
              />

              <Text style={[styles.trackTitle, { fontSize: 20, marginTop: 16 }]} numberOfLines={1}>
                {safeText(title)}
              </Text>
              <Text style={styles.artistName} numberOfLines={1}>{safeText(artist)}</Text>
              <Text style={styles.artistName} numberOfLines={1}>{safeText(genre)}</Text>

              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={durationMillis > 0 ? durationMillis : 1}
                value={positionMillis}
                //onValueChange={(v) => setSliderValue(typeof v === 'number' ? v : 0)}
                //onSlidingStart={() => dispatch(setSeeking(true))}
                onSlidingComplete={handleSeekTo}
                minimumTrackTintColor="#1E90FF"
                maximumTrackTintColor="#444"
                thumbTintColor="#fff"
                disabled={isLoading || durationMillis === 0}
              />

              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
                <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
              </View>

              <View style={styles.controls}>
                <TouchableOpacity onPress={handleToggleShuffle}>
                  <Ionicons
                    name="shuffle"
                    size={28}
                    color={isShuffle ? '#1E90FF' : '#fff'}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={playPrevious}>
                  <Ionicons name="play-skip-back" size={28} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleTogglePlayPause}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons
                      name={isActuallyPlaying ? 'pause-circle' : 'play-circle'}
                      size={48}
                      color="#fff"
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={playNext}>
                  <Ionicons name="play-skip-forward" size={28} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleToggleRepeat} style={{ padding: 5 }}>
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons
                      name={getRepeatIcon()}
                      size={28}
                      color={getRepeatColor()}
                    />
                    {/* Se estiver no modo 'track', renderiza um "1" pequeno sobre o ícone */}
                    {repeatMode === 'track' && (
                      <View style={styles.repeatBadge}>
                        <Text style={styles.repeatBadgeText}>1</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={handleToggleFavorite}>
                  <Ionicons
                    name={isCurrentTrackFavorited ? 'heart' : 'heart-outline'}
                    size={24}
                    color={isCurrentTrackFavorited ? '#FF3D00' : '#fff'}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleOpenComments}>
                  <Image
                    source={require('@/assets/images/audioPlayerBar/icons8_sms_120px.png')}
                    style={styles.iconActions}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleShareMusic}>
                  <Ionicons name="share-social-outline" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </BlurView>
        </ImageBackground>
      )}
    </View>
  );  
}