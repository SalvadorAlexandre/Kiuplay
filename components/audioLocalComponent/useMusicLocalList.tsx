import React, { useEffect } from 'react'; // Adicionado useEffect
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid'; // Importe uuid para gerar IDs únicos

// Importe Track e as thunks do seu playerSlice
import {
    Track,
    setPlaylistAndPlayThunk,
    playTrackThunk,
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
            // Mapeie os dados do picker para o formato Track completo
            const newPlaylist: Track[] = selectedLocalFiles.map((file) => ({
                id: uuidv4(), // Gere um ID único para cada arquivo
                uri: String(file.uri), // Garanta que uri é string, mesmo se o picker retornar number
                name: file.name, // O nome original do arquivo
                title: file.name.split('.').slice(0, -1).join('.') || 'Título Desconhecido', // Tenta usar o nome do arquivo como título
                artist: 'Artista Desconhecido', // Placeholder
                cover: 'https://via.placeholder.com/150', // Placeholder de capa
                size: file.size,
                mimeType: file.mimeType,
                duration: undefined, // Duração pode ser desconhecida para arquivos locais inicialmente
            }));

            // Despache a thunk para definir a playlist e começar a tocar a primeira música
            dispatch(setPlaylistAndPlayThunk({
                newPlaylist: newPlaylist,
                startIndex: 0,
                shouldPlay: true,
            }));
        }
    }, [selectedLocalFiles, dispatch]); // Dependências: reage quando selectedLocalFiles muda

    const handlePlaySpecificMusic = (index: number) => {
        // Dispara a thunk para tocar uma música específica da playlist do Redux
        dispatch(playTrackThunk(index));
    };

    return (
        <View style ={{flex: 1,  paddingHorizontal: 13,}}>
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
                    contentContainerStyle={{ paddingBottom: 100,}}
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