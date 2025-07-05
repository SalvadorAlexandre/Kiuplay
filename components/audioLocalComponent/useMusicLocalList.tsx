import React, { useEffect } from 'react'; // Adicionado useEffect
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid'; // Importe uuid para gerar IDs únicos
import { parseBlob } from 'music-metadata';
// Importe Track e as thunks do seu playerSlice
import {
    Track,
    setPlaylistAndPlayThunk,
    playTrackThunk,
    setCoverImage,
} from '@/src/redux/playerSlice'; // Ajuste o caminho conforme seu projeto
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks'; // Seus hooks personalizados para Redux
import useLocalMusicPicker from '@/hooks/audioPlayerHooks/useLocalMusicLoader'; // Seu hook para selecionar arquivos

// Remova a interface 'Music' local, vamos usar 'Track' de playerSlice.ts
interface MusicItemProps {
    music: Track; // Agora usa a interface Track
    isCurrent: boolean;
    onPress: () => void;
    index: number;
}

// Componente para exibir uma música na lista
const MusicItem = ({ music, isCurrent, onPress, index }: MusicItemProps) => (
    <TouchableOpacity
        // key deve usar o ID único da Track
        // key={music.id} // Usamos music.id aqui
        style={[
            styles.musicItemContainer,
            isCurrent && styles.currentMusicItem,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        testID={`music-item-${index}`}
    >
        <Text numberOfLines={1} style={styles.musicName}>
            {isCurrent ? '▶ ' : ''}{music.title} {/* Exibe o título da Track */}
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
    //let coverUri: string
    const dispatch = useAppDispatch(); // Hook para despachar ações
    const {
        // currentTrack,
        currentIndex: reduxCurrentIndex, // Renomeado para evitar conflito com currentIndex local
        playlist,
    } = useAppSelector((state) => state.player); // Pega o estado do player do Redux

    const { musics: selectedLocalFiles, pickMusics } = useLocalMusicPicker();

    // Define a imagem da capa (fallback para uma imagem padrão se não houver)
    // const coverImage = currentTrack?.cover ? { uri: currentTrack.cover } : require('@/assets/images/Default_Profile_Icon/unknown_track.png');
    // Use selectedLocalFiles como a fonte de dados principal, sem mockMusicList
    // const mockMusicList: Music[] = [...]; // Remover mockMusicList

    // Função para lidar com a seleção e reprodução de músicas
    const handleSelectAndPlayMusics = async () => {
        // Dispara o picker para o usuário selecionar os arquivos
        await pickMusics();

        // No useEffect, vamos detectar quando selectedLocalFiles muda para processá-los
        // Não chame setPlaylistAndPlayThunk diretamente aqui, pois pickMusics é assíncrono
        // e selectedLocalFiles só será atualizado APÓS o picker ser fechado.
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

                    // Inicializa coverUri indefinido
                    let coverUri: string | undefined = undefined;

                    // Log para depuração
                    console.log("Metadata picture:", metadata.common.picture);

                    // Se tiver capa embutida
                    if (metadata.common.picture && metadata.common.picture.length > 0) {
                        const picture = metadata.common.picture[0];
                        const coverBlob = new Blob([picture.data], { type: picture.format });
                        coverUri = URL.createObjectURL(coverBlob);
                        console.log("Cover URI:", coverUri);
                    }

                    processedTracks.push({
                        id: uuidv4(),
                        uri: String(file.uri),
                        name: file.name,
                        title,
                        artist,
                        cover: coverUri ?? 'https://via.placeholder.com/150', // Fallback correto
                        size: file.size,
                        mimeType: file.mimeType,
                        duration: metadata.format.duration
                            ? Math.round(metadata.format.duration * 1000)
                            : undefined,
                    });
                }

                // Atualiza a capa global
                dispatch(setCoverImage(processedTracks[0]?.cover ?? 'https://via.placeholder.com/150'));

                // Atualiza playlist
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
    }, [selectedLocalFiles, dispatch]);;// Dependências: reage quando selectedLocalFiles muda

    const handlePlaySpecificMusic = (index: number) => {
        // Dispara a thunk para tocar uma música específica da playlist do Redux
        dispatch(playTrackThunk(index));
    };

    return (
        <View style={{ flex: 1, paddingHorizontal: 13, }}>
            <TouchableOpacity
                onPress={handleSelectAndPlayMusics} // Chamada para abrir o picker
                style={styles.button}
                testID="select-music-button"
            >
                <Text style={styles.buttonText}>Selecionar músicas</Text>
            </TouchableOpacity>

            {playlist.length === 0 ? ( // Verifica a playlist do Redux
                <Text style={styles.empty}>Nenhuma música na playlist. Selecione para começar!</Text>
            ) : (
                <FlatList
                    data={playlist} // Usa a playlist do Redux
                    // keyExtractor deve usar o `id` da Track
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <MusicItem
                            music={item}
                            index={index}
                            // Compara o currentIndex do Redux para destacar a música atual
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