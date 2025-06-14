// components/globalPlayer/audioPlayerBar.tsx
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
});