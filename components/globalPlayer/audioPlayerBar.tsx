// components/globalPlayer/audioPlayerBar.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { Audio } from 'expo-av';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const Player = () => {
  const { uri, isExpanded, setIsExpanded } = useAudioPlayerContext();
  const soundRef = useRef<Audio.Sound | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);

  let interval: any;

  // 🔁 Você pode adaptar isso depois com base na sua lógica de playlist
  const hasNextTrack = false; // se true, deve avançar para próxima faixa

  useEffect(() => {
    if (!uri) return;

    const loadSound = async () => {
      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
          async (status) => {
            if (status.isLoaded) {
              setIsLoaded(true);
              setDuration(status.durationMillis ?? 1);
              setPosition(status.positionMillis ?? 0);

              // 🔁 Ao finalizar
              if (status.didJustFinish && !status.isLooping) {
                if (!hasNextTrack) {
                  setPosition(0);
                  setIsPlaying(false);
                }
              }
            }
          }
        );

        soundRef.current = sound;
        setIsPlaying(true);
      } catch (error) {
        console.error('Erro ao carregar o som:', error);
      }
    };

    loadSound();

    return () => {
      soundRef.current?.unloadAsync();
      clearInterval(interval);
    };
  }, [uri]);

  useEffect(() => {
    if (!isPlaying || !soundRef.current) return;

    interval = setInterval(async () => {
      const status = await soundRef.current?.getStatusAsync();
      if (status?.isLoaded) {
        setPosition(status.positionMillis ?? 0);
        setDuration(status.durationMillis ?? 1);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying]);

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
      setPosition(0);
    }
  };

  const handleSeek = async (value: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(value);
      setPosition(value);
    }
  };

  const handlePrevious = () => {
    console.log('Voltar para a faixa anterior');
  };

  const handleNext = () => {
    console.log('Avançar para a próxima faixa');
  };

  if (!uri || !isLoaded) return null;

  return (
    <Pressable
      onPress={() => {
        if (!isExpanded) setIsExpanded(true);
      }}
      style={[
        styles.container,
        isExpanded ? styles.expanded : styles.minimized,
      ]}
    >
      <View style={styles.header}>
        {isExpanded && (
          <Pressable onPress={() => setIsExpanded(false)}>
            <Text style={styles.close}>Fechar</Text>
          </Pressable>
        )}
        <Text style={styles.title} numberOfLines={1}>
          {isExpanded ? 'Tocando agora (Expandido)' : 'Tocando agora'}
        </Text>
        <Text style={styles.status}>{isPlaying ? 'Reproduzindo' : 'Pausado'}</Text>
      </View>

      {/* Barra de progresso */}
      {isExpanded && (
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          minimumTrackTintColor="#1E90FF"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#1E90FF"
          onSlidingComplete={handleSeek}
        />
      )}

      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePrevious} style={styles.controlButton}>
          <Ionicons name="play-skip-back" size={35} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
          <Ionicons
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={50}
            color="#ccc"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
          <Ionicons name="play-skip-forward" size={35} color="#ccc" />
        </TouchableOpacity>
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
