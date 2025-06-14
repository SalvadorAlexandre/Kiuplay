// app/local/index.tsx ou onde estiver LocalMusicScreen
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import useLocalMusic from '@/hooks/audioPlayerHooks/useLocalMusicManager';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';

export default function LocalMusicScreen() {
    const { selectedMusics, handleSelectMusics } = useLocalMusic();
    const { setUri } = useAudioPlayerContext(); // ⬅️ usando contexto global

    const handlePlayMusic = (uri: string) => {
        setUri(uri); // ⬅️ define a URI globalmente
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleSelectMusics} style={styles.button}>
                <Text style={styles.buttonText}>Selecionar músicas</Text>
            </TouchableOpacity>

            <ScrollView style={{ flex: 1 }}>
                {selectedMusics.length === 0 ? (
                    <Text style={styles.empty}>Nenhuma música selecionada</Text>
                ) : (
                    selectedMusics.map((music, index) => (
                        <View key={index} style={styles.musicItemContainer}>
                            <TouchableOpacity onPress={() => handlePlayMusic(music.uri)}>
                                <Text numberOfLines={1} style={styles.musicName}>
                                    {music.name}
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.musicSize}>
                                {music.size ? `${(music.size / (1024 * 1024)).toFixed(2)} MB` : 'Tamanho desconhecido'}
                            </Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#000',
        padding: 10,
    },
    button: {
        backgroundColor: '#1e90ff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    empty: {
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    musicItemContainer: {
        backgroundColor: '#222',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
    },
    musicName: {
        color: 'white',
        fontWeight: 'bold',
    },
    musicSize: {
        color: '#aaa',
        fontSize: 12,
    },
});