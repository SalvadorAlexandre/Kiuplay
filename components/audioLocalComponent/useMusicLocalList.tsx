// components/audioLocalComponent/useMusicLocalList.tsx
import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { parseBlob } from 'music-metadata';

// Importe Track e as thunks do seu playerSlice
import {
    Track, // ADIÇÃO: Importa a interface Track
    setPlaylistAndPlayThunk,
    playTrackThunk,
} from '@/src/redux/playerSlice';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import useLocalMusicPicker from '@/hooks/audioPlayerHooks/useLocalMusicLoader';

// REMOÇÃO: Removida a interface 'Music' local. Agora usamos 'Track' de playerSlice.ts
interface MusicItemProps {
    music: Track; // ALTERAÇÃO: Agora usa a interface Track do playerSlice
    isCurrent: boolean;
    onPress: () => void;
    index: number;
}

// Componente para exibir uma música na lista
const MusicItem = ({ music, isCurrent, onPress, index }: MusicItemProps) => (
    <TouchableOpacity
        style={[
            styles.musicItemContainer,
            isCurrent && styles.currentMusicItem,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        testID={`music-item-${index}`}
    >
        <Text numberOfLines={1} style={styles.musicName}>
            {isCurrent ? '▶ ' : ''}{music.title} {/* ALTERAÇÃO: Exibe o título da Track */}
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
    const dispatch = useAppDispatch();
    const {
        currentIndex: reduxCurrentIndex,
        playlist,
    } = useAppSelector((state) => state.player);

    const { musics: selectedLocalFiles, pickMusics } = useLocalMusicPicker();

    const handleSelectAndPlayMusics = async () => {
        await pickMusics();
    };

    // UseEffect para lidar com a mudança de 'selectedLocalFiles' após o picker
    useEffect(() => {
        if (selectedLocalFiles && selectedLocalFiles.length > 0) {
            const processFiles = async () => {
                const processedTracks: Track[] = [];

                for (const file of selectedLocalFiles) {
                    const response = await fetch(file.uri);
                    const blob = await response.blob();
                    const metadata = await parseBlob(blob);

                    const title = metadata.common.title || file.name.split('.').slice(0, -1).join('.') || 'Título Desconhecido';
                    const artist = metadata.common.artist || 'Artista Desconhecido';

                    let coverUri: string | undefined = undefined;

                    console.log("Metadata picture:", metadata.common.picture);

                    if (metadata.common.picture && metadata.common.picture.length > 0) {
                        const picture = metadata.common.picture[0];
                        const coverBlob = new Blob([picture.data], { type: picture.format });
                        coverUri = URL.createObjectURL(coverBlob);
                        console.log("Cover URI:", coverUri);
                    }

                    processedTracks.push({
                        id: uuidv4(),
                        uri: String(file.uri),
                        // REMOÇÃO: Removida a propriedade 'name'
                        title,
                        artist,
                        cover: coverUri ?? '', // Fallback correto
                        size: file.size,
                        mimeType: file.mimeType,
                        duration: metadata.format.duration
                            ? Math.round(metadata.format.duration * 1000)
                            : undefined,
                        source: 'library-local', // ADIÇÃO CRUCIAL: Define a origem da música
                        // ✅ ADICIONE ESTES CAMPOS
                        type: "single", // ou outro valor, dependendo do seu enum/interface
                        genre: metadata.common.genre?.[0] || 'Gênero desconhecido',
                    });
                }

                dispatch(
                    setPlaylistAndPlayThunk({
                        newPlaylist: processedTracks,
                        startIndex: 0,
                        shouldPlay: true,
                    })
                );
            };

            processFiles();
        }
    }, [selectedLocalFiles, dispatch]);

    const handlePlaySpecificMusic = (index: number) => {
        dispatch(playTrackThunk(index));
    };

    return (
        <View style={{ flex: 1, paddingHorizontal: 13, }}>
            <TouchableOpacity
                onPress={handleSelectAndPlayMusics}
                style={styles.button}
                testID="select-music-button"
            >
                <Text style={styles.buttonText}>Selecionar músicas</Text>
            </TouchableOpacity>

            {playlist.length === 0 ? (
                <Text style={styles.empty}>Nenhuma música na playlist. Selecione para começar!</Text>
            ) : (
                <FlatList
                    data={playlist}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <MusicItem
                            music={item}
                            index={index}
                            isCurrent={index === reduxCurrentIndex}
                            onPress={() => handlePlaySpecificMusic(index)}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 100, }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

// Estilos visuais (inalterados)
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