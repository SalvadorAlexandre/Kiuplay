import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

// Interface para tipagem da música
interface Music {
    uri: string | number;
    name: string;
    size?: number;
}

interface MusicItemProps {
    music: Music;
    isCurrent: boolean;
    onPress: () => void;
    index: number;
}

// Componente para exibir uma música na lista
const MusicItem = ({ music, isCurrent, onPress, index }: MusicItemProps) => (
    <TouchableOpacity
        key={String(music.uri)}
        style={[
            styles.musicItemContainer,
            isCurrent && styles.currentMusicItem,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        testID={`music-item-${index}`}
    >
        <Text numberOfLines={1} style={styles.musicName}>
            {isCurrent ? '▶ ' : ''}{music.name}
        </Text>
        <Text style={styles.musicSize}>
            {music.size
                ? `${(music.size / (1024 * 1024)).toFixed(2)} MB`
                : 'Tamanho desconhecido'}
        </Text>
    </TouchableOpacity>
);

// Componente principal da tela de músicas locais
export default function LocalMusicScreen() {
    const [selectedMusics, setSelectedMusics] = useState<Music[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);

    const mockMusicList: Music[] = [
        { uri: 'track1.mp3', name: 'Música 1', size: 4000000 },
        { uri: 'track2.mp3', name: 'Música 2', size: 3000000 },
        { uri: 'track3.mp3', name: 'Música 3', size: 5000000 },
    ];

    const handleSelectMusics = () => {
        // Simula seleção de músicas
        setSelectedMusics(mockMusicList);
    };

    const handlePlayMusic = (index: number) => {
        const music = selectedMusics[index];
        if (!music) return;

        if (currentIndex === index) {
            console.log(`Música ${music.name} já está tocando.`);
            return;
        }

        setCurrentIndex(index);
        console.log(`Tocando agora: ${music.name} (${music.uri})`);
        // Aqui você pode integrar com o AVPlayback ou outro player local
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <TouchableOpacity
                onPress={handleSelectMusics}
                style={styles.button}
                testID="select-music-button"
            >
                <Text style={styles.buttonText}>Selecionar músicas</Text>
            </TouchableOpacity>

            {selectedMusics.length === 0 ? (
                <Text style={styles.empty}>Nenhuma música selecionada</Text>
            ) : (
                <FlatList
                    data={selectedMusics}
                    keyExtractor={item => String(item.uri)}
                    renderItem={({ item, index }) => (
                        <MusicItem
                            music={item}
                            index={index}
                            isCurrent={index === currentIndex}
                            onPress={() => handlePlayMusic(index)}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </KeyboardAvoidingView>
    );
}

// Estilos visuais
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
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
    currentMusicItem: {
        borderColor: '#1e90ff',
        backgroundColor: '#2a2a2a',
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