// components/globalPlayer/audioPlayerBar.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';

const { height } = Dimensions.get('window');

const Player = () => {
  const { uri, isExpanded, setIsExpanded } = useAudioPlayerContext();
  const soundRef = useRef<Audio.Sound | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!uri) return;

    const loadSound = async () => {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        (status) => setIsLoaded(status?.isLoaded ?? false)
      );

      soundRef.current = sound;
      setIsPlaying(true);
    };

    loadSound();

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, [uri]);

  const togglePlayPause = async () => {
    if (!soundRef.current) return;

    const status = await soundRef.current.getStatusAsync();
    if (!status.isLoaded) return;

    if (status.isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const stop = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      setIsPlaying(false);
    }
  };

  if (!uri || !isLoaded) return null;

  return (
    <Pressable
      onPress={() => {
        if (!isExpanded) setIsExpanded(true);
      }}
      style={[styles.container, isExpanded ? styles.expanded : styles.minimized]}
    >
      <View style={styles.header}>
        {isExpanded && (
          <Pressable onPress={() => setIsExpanded(false)}>
            <Text style={styles.close}>Fechar</Text>
          </Pressable>
        )}
        <Text style={styles.title}>{isExpanded ? 'Tocando agora (Expandido)' : 'Tocando agora'}</Text>
        <Text style={styles.status}>{isPlaying ? 'Reproduzindo' : 'Pausado'}</Text>
      </View>

      <View style={styles.controls}>
        <Pressable onPress={togglePlayPause} style={styles.controlButton}>
          <Text style={styles.controlText}>{isPlaying ? '⏸' : '▶'}</Text>
        </Pressable>
        <Pressable onPress={stop} style={styles.controlButton}>
          <Text style={styles.controlText}>⏹</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

export default Player;

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
    height: 70,
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
    gap: 30,
  },
  controlButton: {
    padding: 12,
  },
  controlText: {
    fontSize: 32,
    color: '#fff',
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
