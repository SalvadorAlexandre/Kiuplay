import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, ActivityIndicator, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { playerStyles as styles } from './playerStyles';
import { usePlayerStore } from '@/src/zustand/usePlayerStore';
import { AudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { toggleFavoriteSingle } from '@/src/redux/favoriteSinglesSlice';
import { useTranslation } from '@/src/translations/useTranslation';

/**
 * 1. COMPONENTE FILHO (Onde a mágica acontece)
 * Recebe o 'player' como prop obrigatória (garantido pelo pai)
 */
function AudioPlayerContent({ player }: { player: AudioPlayer }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    currentTrack,
    isExpanded,
    repeatMode,
    togglePlay,
    toggleShuffle,
    setRepeatMode,
    toggleExpanded,
    seekTo,
  } = usePlayerStore();

  // Agora o TypeScript não reclama, pois 'player' não é null aqui
  const status = useAudioPlayerStatus(player);
  const progressShared = useSharedValue(0);
  const favoritedSingles = useAppSelector((state) => state.favoriteSingles.items ?? []);

  const positionMillis = status?.currentTime ?? 0;
  const durationMillis = status?.duration ?? 0;
  const isActuallyPlaying = status?.playing ?? false;
  const isLoading = status?.isBuffering ?? false;

  const trackId = currentTrack?.id ?? null;

  // Efeito para a barra de progresso
  useEffect(() => {
    if (durationMillis > 0) {
      progressShared.value = positionMillis / durationMillis;
    }
  }, [positionMillis, durationMillis]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressShared.value * 100}%`,
  }));

  if (!currentTrack) return null;

  /* --- HELPERS E CALLBACKS --- */
  function safeText(value: any): string {
    return (value === undefined || value === null) ? '' : String(value);
  }

  const handleTogglePlayPause = useCallback(() => togglePlay(), [togglePlay]);
  const handleToggleExpanded = useCallback(() => toggleExpanded(), [toggleExpanded]);

  const coverImage = currentTrack.cover 
    ? { uri: currentTrack.cover } 
    : require('@/assets/images/Default_Profile_Icon/unknown_track.png');

  // Renderização do JSX (Minimizado ou Expandido)
  return (
    <View style={[styles.container, isExpanded ? styles.expandedContainer : styles.minimizedContainer]}>
      {!isExpanded ? (
        <>
          <TouchableOpacity activeOpacity={0.9} style={styles.minimizedBar} onPress={handleToggleExpanded}>
            <View style={styles.minimizedLeft}>
              <Image source={coverImage} style={styles.minimizedCover} />
              <View style={{ marginLeft: 8, flexShrink: 1 }}>
                <Text style={styles.trackTitle} numberOfLines={1}>{safeText(currentTrack.title)}</Text>
                <Text style={styles.artistName} numberOfLines={1}>{safeText(currentTrack.artist)}</Text>
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
      ) : (
        <ImageBackground source={coverImage} blurRadius={Platform.OS === 'android' ? 5 : 0} style={styles.imageBackground}>
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
                {/* Aqui vai o restante do seu código do modo Expandido */}
                <Text style={{color: '#fff', marginTop: 100, textAlign: 'center'}}>Player Expandido</Text>
                <TouchableOpacity onPress={handleToggleExpanded}><Text style={{color: '#fff', textAlign: 'center'}}>Fechar</Text></TouchableOpacity>
            </BlurView>
        </ImageBackground>
      )}
    </View>
  );
}

/**
 * 2. COMPONENTE PRINCIPAL (O Guardião)
 */
export default function AudioPlayerBar() {
  const { player, currentTrack } = usePlayerStore();

  // Se não houver player ou música, não renderiza nada e não ativa os hooks do filho
  if (!player || !currentTrack) {
    return null;
  }

  // Aqui o player é enviado com segurança para o filho
  return <AudioPlayerContent player={player} />;
}
