//components/audioLocalComponente/useMusicLocalList.tsx
// components/audioLocalComponente/useMusicLocalList.tsx
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import useLocalMusic from '@/hooks/audioPlayerHooks/useLocalMusicManager';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';

export default function LocalMusicScreen() {
    const { selectedMusics, handleSelectMusics } = useLocalMusic();

    const {
        setPlaylist,
        setCurrentIndex,
        setIsExpanded,
    } = useAudioPlayerContext();

    const handlePlayMusic = (index: number) => {
        setPlaylist(selectedMusics);
        setCurrentIndex(index);
        setIsExpanded(true);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <TouchableOpacity onPress={handleSelectMusics} style={styles.button}>
                <Text style={styles.buttonText}>Selecionar músicas</Text>
            </TouchableOpacity>

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {selectedMusics.length === 0 ? (
                    <Text style={styles.empty}>Nenhuma música selecionada</Text>
                ) : (
                    selectedMusics.map((music, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.musicItemContainer}
                            onPress={() => handlePlayMusic(index)}
                            activeOpacity={0.7}
                        >
                            <Text numberOfLines={1} style={styles.musicName}>
                                {music.name}
                            </Text>
                            <Text style={styles.musicSize}>
                                {music.size
                                    ? `${(music.size / (1024 * 1024)).toFixed(2)} MB`
                                    : 'Tamanho desconhecido'}
                            </Text>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: '#111',
    },
    button: {
        backgroundColor: '#1e90ff',
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    scrollContainer: {
        flex: 1,
    },
    empty: {
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    musicItemContainer: {
        backgroundColor: '#1f1f1f',
        padding: 14,
        marginBottom: 10,
        borderRadius: 8,
        borderColor: '#333',
        borderWidth: 1,
    },
    musicName: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    musicSize: {
        color: '#aaa',
        fontSize: 13,
        marginTop: 4,
    },
});