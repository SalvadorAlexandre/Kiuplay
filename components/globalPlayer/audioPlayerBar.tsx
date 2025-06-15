// components/globalPlayer/audioPlayerBar.tsx
// components/globalPlayer/audioPlayerBar.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';
import { useAudioPlayer } from '@/hooks/audioPlayerHooks/useAudioPlayer';

const { height } = Dimensions.get('window');

export default function Player() {
  const {
    currentTrack,
    isExpanded,
    setIsExpanded,
    playNext,
    playPrevious,
  } = useAudioPlayerContext();

  const {
    loadAndPlay,
    togglePlayPause,
    isPlaying,
    status,
  } = useAudioPlayer();

  // Reproduz o áudio sempre que a faixa muda
  useEffect(() => {
    if (currentTrack?.uri) {
      loadAndPlay(currentTrack.uri);
    }
  }, [currentTrack?.uri]);

  // Oculta o player se não houver faixa
  if (!currentTrack || !status?.isLoaded) return null;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setIsExpanded(!isExpanded)}
      style={[styles.container, isExpanded ? styles.expanded : styles.minimized]}
    >
      {isExpanded ? (
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <TouchableOpacity onPress={() => setIsExpanded(false)}>
            <Text style={styles.close}>Fechar</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {currentTrack.name}
            </Text>
            <Text style={styles.status}>{isPlaying ? 'Reproduzindo' : 'Pausado'}</Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity onPress={playPrevious} style={styles.controlButton}>
              <Ionicons name="play-skip-back" size={35} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
              <Ionicons
                name={isPlaying ? 'pause-circle' : 'play-circle'}
                size={50}
                color="#ccc"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={playNext} style={styles.controlButton}>
              <Ionicons name="play-skip-forward" size={35} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.minimized}>
          <Text style={[styles.title, { flex: 1 }]} numberOfLines={1}>
            {currentTrack.name}
          </Text>

          <View style={styles.controls}>
            <TouchableOpacity onPress={playPrevious} style={styles.controlButton}>
              <Ionicons name="play-skip-back" size={28} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
              <Ionicons
                name={isPlaying ? 'pause-circle' : 'play-circle'}
                size={38}
                color="#ccc"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={playNext} style={styles.controlButton}>
              <Ionicons name="play-skip-forward" size={28} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#2D2F31',
    borderTopColor: '#333',
    borderTopWidth: 1,
    zIndex: 999,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  minimized: {
    bottom: 59,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expanded: {
    top: 0,
    bottom: 0,
    height: height,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  status: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  close: {
    color: '#999',
    fontSize: 16,
    marginBottom: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
    gap: 25,
  },
  controlButton: {
    padding: 10,
  },
});


{/*
    import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAudioPlayer } from '@/hooks/audioPlayerHooks/useAudioPlayer';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';

const Player = () => {
    const { uri } = useAudioPlayerContext();
    const { loadAndPlay, togglePlayPause, stop, isPlaying, status } = useAudioPlayer();

    useEffect(() => {
        if (uri) loadAndPlay(uri);
    }, [uri]);

    // Oculta o player se nada estiver carregado
    if (!uri || !status?.isLoaded) return null;

    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <Text numberOfLines={1} style={styles.title}>Tocando agora</Text>
                <Text style={styles.status}>{isPlaying ? 'Reproduzindo' : 'Pausado'}</Text>
            </View>

            <View style={styles.right}>
                <Pressable onPress={togglePlayPause} style={styles.controlButton}>
                    <Text style={styles.controlText}>{isPlaying ? '⏸' : '▶'}</Text>
                </Pressable>
                <Pressable onPress={stop} style={styles.controlButton}>
                    <Text style={styles.controlText}>⏹</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default Player;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',     // fixar na tela
        bottom: 59,               // altura da Tab Bar (ajuste conforme o tamanho real)
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: '#1a1a1a',
        borderTopColor: '#333',
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        zIndex: 10,               // garantir que fique acima do conteúdo
    },
    left: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    status: {
        color: '#ccc',
        fontSize: 12,
        marginTop: 2,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    controlButton: {
        marginLeft: 12,
    },
    controlText: {
        fontSize: 22,
        color: '#fff',
    },
});*/}
