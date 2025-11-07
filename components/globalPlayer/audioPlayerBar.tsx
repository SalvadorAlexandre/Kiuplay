// components/globalPlayer/audioPlayerBar.tsx
import React, { useEffect, useCallback, useState, useRef } from 'react';
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
import {
  togglePlayPauseThunk,
  playNextThunk,
  playPreviousThunk,
  seekToThunk,
  updatePlaybackStatus,
  setError,
  toggleExpanded,
  setSeeking,
  toggleShuffle,
  toggleRepeat,
} from '@/src/redux/playerSlice';
import { getAudioManager } from '@/src/utils/audioManager';
import { AVPlaybackStatus } from 'expo-av';

import {
  addFavoriteMusic,
  removeFavoriteMusic,
} from '@/src/redux/favoriteMusicSlice';
import { useTranslation } from '@/src/translations/useTranslation';

const audioManager = getAudioManager();

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

export default function AudioPlayerBar() {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    currentTrack,
    isPlaying,
    positionMillis,
    durationMillis,
    isExpanded,
    isLoading,
    isSeeking,
    error,
    isShuffle,
    isRepeat,
  } = useAppSelector((state) => state.player);

  // Normalize currentTrack fields locally to ensure strings are passed to Text
  const title = currentTrack ? safeText(currentTrack.title) : '';
  const artist = currentTrack ? safeText(currentTrack.artist) : '';
  const genre = currentTrack ? safeText(currentTrack.genre) : '';
  const coverImage =
    currentTrack && typeof currentTrack.cover === 'string' && currentTrack.cover.trim() !== ''
      ? { uri: currentTrack.cover }
      : require('@/assets/images/Default_Profile_Icon/unknown_track.png');
  const artistAvatarSrc =
    currentTrack && typeof currentTrack.artistAvatar === 'string' && currentTrack.artistAvatar.trim() !== ''
      ? { uri: currentTrack.artistAvatar }
      : require('@/assets/images/Default_Profile_Icon/unknown_artist.png');

  const handleOpenComments = useCallback(() => {
    if (currentTrack) {
      router.push({
        pathname: '/commentScreens/musics/[musicId]',
        params: {
          musicId: currentTrack.id,
          musicTitle: currentTrack.title,
          artistName: currentTrack.artist,
          albumArtUrl: currentTrack.cover || '',
          commentCount: '',
        },
      });
    }
  }, [router, currentTrack]);

  const favoritedMusics = useAppSelector((state) => state.favoriteMusic.musics);
  const isCurrentTrackFavorited = currentTrack
    ? favoritedMusics.some((music) => music.id === currentTrack.id)
    : false;

  // Throttle/compare playback status updates to avoid flooding dispatches
  const lastStatusRef = useRef<{ positionMillis?: number; durationMillis?: number; isPlaying?: boolean }>({});

  useEffect(() => {
    const handlePlaybackStatusUpdate = (status: AVPlaybackStatus | any) => {
      // Extract some values safely
      const pos = typeof status?.positionMillis === 'number' ? status.positionMillis : null;
      const dur = typeof status?.durationMillis === 'number' ? status.durationMillis : null;
      const playing = typeof status?.isPlaying === 'boolean' ? status.isPlaying : null;
      const didJustFinish = 'didJustFinish' in status ? status.didJustFinish : false;

      let shouldDispatch = false;

      // If the track just finished - always dispatch so next track can be handled
      if (didJustFinish) {
        shouldDispatch = true;
      } else {
        // Significant change in position (> 500ms)
        if (pos !== null && typeof lastStatusRef.current.positionMillis === 'number') {
          if (Math.abs(pos - (lastStatusRef.current.positionMillis || 0)) > 500) shouldDispatch = true;
        } else if (pos !== null && lastStatusRef.current.positionMillis === undefined) {
          shouldDispatch = true;
        }

        // Duration changed
        if (dur !== null && dur !== lastStatusRef.current.durationMillis) shouldDispatch = true;

        // Playing state changed
        if (playing !== null && playing !== lastStatusRef.current.isPlaying) shouldDispatch = true;
      }

      if (shouldDispatch) {
        // Update ref snapshot
        if (pos !== null) lastStatusRef.current.positionMillis = pos;
        if (dur !== null) lastStatusRef.current.durationMillis = dur;
        if (playing !== null) lastStatusRef.current.isPlaying = playing;

        dispatch(updatePlaybackStatus(status));
        if (didJustFinish) {
          dispatch(playNextThunk());
        }
      }
    };

    audioManager.setPlaybackStatusUpdateCallback(handlePlaybackStatusUpdate);
    return () => {
      audioManager.setPlaybackStatusUpdateCallback(null);
    };
  }, [dispatch]);

  const handleTogglePlayPause = useCallback(() => {
    dispatch(togglePlayPauseThunk());
  }, [dispatch]);

  const handleToggleExpanded = useCallback(() => {
    dispatch(toggleExpanded());
  }, [dispatch]);

  const handleSeekTo = useCallback((v: number) => {
    // Ensure value is a number
    const val = typeof v === 'number' && !isNaN(v) ? v : 0;
    dispatch(seekToThunk(val));
  }, [dispatch]);

  const formatTime = (millis: number | undefined | null): string => {
    if (!millis || typeof millis !== 'number' || isNaN(millis)) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const [sliderValue, setSliderValue] = useState<number>(positionMillis || 0);
  useEffect(() => {
    if (!isSeeking && sliderValue !== positionMillis) {
      setSliderValue(positionMillis || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionMillis, isSeeking]);

  const progress = durationMillis > 0 ? (positionMillis / durationMillis) : 0;

  const handleToggleShuffle = useCallback(() => {
    dispatch(toggleShuffle());
  }, [dispatch]);

  const handleToggleRepeat = useCallback(() => {
    dispatch(toggleRepeat());
  }, [dispatch]);

  const handleToggleFavorite = useCallback(() => {
    if (!currentTrack) return;
    if (isCurrentTrackFavorited) {
      dispatch(removeFavoriteMusic(currentTrack.id));
    } else {
      dispatch(addFavoriteMusic(currentTrack));
    }
  }, [dispatch, currentTrack, isCurrentTrackFavorited]);

  const handleShareMusic = useCallback(() => {
    if (!currentTrack) {
      console.warn(t('audioPlayerBar.noMusicPlaying.'));
      return;
    }
    router.push({
      pathname: '/shareScreens/music/[musicId]',
      params: {
        musicId: currentTrack.id,
        musicTitle: currentTrack.title,
        artistName: currentTrack.artist,
        albumArtUrl: currentTrack.cover || '',
      },
    });
  }, [router, currentTrack, t]);

  // If there's no currentTrack show nothing
  if (!currentTrack) return null;

  return (
    <View
      style={[
        styles.container,
        {
          position: 'absolute',
          left: 0,
          right: 0,
          backgroundColor: '#111',
          ...(isExpanded
            ? {
                top: 0,
                bottom: 0,
                height: '100%',
                width: '100%',
              }
            : {
                bottom: 60,
                height: 68,
              }),
        },
      ]}
    >
      {/* MODO MINIMIZADO */}
      {!isExpanded && (
        <>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.minimizedBar}
            onPress={handleToggleExpanded}
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
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={28}
                  color="#fff"
                />
              )}
            </TouchableOpacity>
          </TouchableOpacity>

          <View style={styles.progressContainer}>
            <View
              style={[styles.progressBar, { width: `${Math.max(0, Math.min(1, progress)) * 100}%` }]}
            />
          </View>
        </>
      )}

      {/* MODO MAXIMIZADO */}
      {isExpanded && (
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
                value={isSeeking ? sliderValue : (positionMillis || 0)}
                onValueChange={(v) => setSliderValue(typeof v === 'number' ? v : 0)}
                onSlidingStart={() => dispatch(setSeeking(true))}
                onSlidingComplete={(v) => {
                  dispatch(setSeeking(false));
                  handleSeekTo(typeof v === 'number' ? v : 0);
                }}
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

                <TouchableOpacity onPress={() => dispatch(playPreviousThunk())}>
                  <Ionicons name="play-skip-back" size={28} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleTogglePlayPause}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons
                      name={isPlaying ? 'pause-circle' : 'play-circle'}
                      size={48}
                      color="#fff"
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => dispatch(playNextThunk())}>
                  <Ionicons name="play-skip-forward" size={28} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleToggleRepeat}>
                  <Ionicons
                    name={isRepeat ? 'repeat-outline' : 'repeat'}
                    size={28}
                    color={isRepeat ? '#1E90FF' : '#fff'}
                  />
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

      {typeof error === 'string' && error.trim() !== '' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{safeText(error)}</Text>
          <TouchableOpacity onPress={() => dispatch(setError(null))}>
            <Ionicons name="close-circle" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#222',
    zIndex: 99,
    elevation: 10,
  },
  minimizedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: 68,
  },
  minimizedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  minimizedCover: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  progressContainer: {
    height: 1,
    backgroundColor: '#333',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1E90FF',
  },
  expandedContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  expandedHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  expandedCover: {
    width: '94%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#222',
    resizeMode: 'stretch'
  },
  slider: {
    width: '100%',
    marginTop: 20,
  },
  timeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    color: '#aaa',
    fontSize: 12,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 14,
  },
  artistName: {
    color: '#ccc',
    fontSize: 12,
  },
  artistMainName: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 1,
  },
  errorContainer: {
    backgroundColor: 'rgba(255,0,0,0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    resizeMode: "cover"
  },
  expandedScrollView: {
    flex: 1,
  },
  expandedScrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  iconActions: {
    width: 25,
    height: 25,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    padding: 30,
  },
});