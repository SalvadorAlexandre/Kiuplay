// app/playlistScreens/playlistVideo/[videoId].tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    SafeAreaView, // Usar SafeAreaView para iOS notches
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import VideoItem from '@/components/PlayerVideoComponents/VideoItem'; // Reutilizar o VideoItem

// Importe a mesma interface VideoData e MOCKED_VIDEO_DATA usada em VideoClipesScreen.tsx
// Idealmente, esses dados viriam de uma API, mas para o exemplo, usamos os mockados.
// Certifique-se de que VideoData e MOCKED_VIDEO_DATA são consistentes entre os arquivos.
interface VideoData {
    id: string;
    title: string;
    artist: string;
    artistId: string;
    artistProfileImageUrl?: string;
    thumbnail: string;
    videoUrl: string;
}

// Dados de exemplo (mockados) - TRAGA ESTES MESMOS DADOS DO SEU VideoClipesScreen.tsx
// É crucial que `artistId` esteja presente e seja consistente!
const MOCKED_VIDEO_DATA: VideoData[] = [
    { id: '1', title: 'Minha Música Perfeita', artist: 'Artista A', artistId: 'artist1', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=1', thumbnail: 'https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: '2', title: 'Ritmo da Cidade Noturna', artist: 'Banda B', artistId: 'artist2', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=2', thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: '3', title: 'Noite Estrelada de Verão', artist: 'Cantor C', artistId: 'artist3', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=3', thumbnail: 'https://i.ytimg.com/vi/3y7Kq2l_k6w/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/c.mp4' },
    { id: '4', title: 'Sons da Natureza Selvagem', artist: 'Grupo D', artistId: 'artist4', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=4', thumbnail: 'https://i.ytimg.com/vi/F-glUq_jWv0/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/d.mp4' },
    { id: '5', title: 'Caminhos da Descoberta', artist: 'Artista E', artistId: 'artist5', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=5', thumbnail: 'https://i.ytimg.com/vi/2N7TfX6f4oM/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/a.mp4' },
    { id: '6', title: 'Amanhecer Dourado', artist: 'Solista F', artistId: 'artist6', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=6', thumbnail: 'https://i.ytimg.com/vi/eJk8e8e8e8e/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/b.mp4' },
    { id: '7', title: 'Energia Vibrante', artist: 'DJ G', artistId: 'artist7', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=7', thumbnail: 'https://i.ytimg.com/vi/xM6uD7n1BfQ/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/c.mp4' },
    { id: '8', title: 'Reflexões Profundas', artist: 'Poeta H', artistId: 'artist8', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=8', thumbnail: 'https://i.ytimg.com/vi/wA5wA5wA5wA/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/d.mp4' },
];

export default function ArtistPlaylistScreen() {
    const router = useRouter();
    const { artistId, artistName, artistProfileImageUrl } = useLocalSearchParams();

    const [artistVideos, setArtistVideos] = useState<VideoData[]>([]);

    useEffect(() => {
        if (artistId) {
            // Filtra os vídeos mockados para encontrar os vídeos do artista específico
            const videosDoArtista = MOCKED_VIDEO_DATA.filter(
                (video) => video.artistId === artistId
            );
            setArtistVideos(videosDoArtista);
        }
    }, [artistId]);

    const handleVideoPress = (item: VideoData) => {
        // Redireciona para o Player de Vídeo ou para uma tela de detalhes
        // Você pode ajustar isso para voltar ao VideoClipesScreen e tocar o vídeo
        // ou abrir uma tela de player dedicada. Para simplificar, vou usar o router.
        console.log(`Reproduzindo vídeo: ${item.title}`);
        // Exemplo: Navegar de volta para o VideoClipesScreen e passar o vídeo para ser reproduzido
        // Isso exigiria um contexto ou Redux para passar o currentPlayingVideo
        // Para este exemplo, apenas vamos logar ou podemos voltar com um parâmetro simples se o seu VideoClipesScreen puder aceitar.
        // Ou, você pode navegar para uma tela de player de vídeo separada se tiver uma.
        // Por agora, vamos apenas demonstrar a navegação.
        router.back(); // Volta para a tela anterior (VideoClipesScreen)
        // Aqui você poderia adicionar uma notificação ou um prompt para o usuário
        // que o vídeo começará a tocar na tela principal.
        // Para uma UX mais fluida, considere um player de vídeo persistente ou
        // um gerenciamento de estado mais robusto para o vídeo em reprodução.
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false, // Ocultar o cabeçalho padrão para usar um cabeçalho customizado
                    animation: 'slide_from_right', // Transição de tela
                }}
            />
            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerArtistInfo}>
                    <Image
                        source={artistProfileImageUrl ? { uri: String(artistProfileImageUrl) } : require('@/assets/images/Default_Profile_Icon/unknown_artist.png')}
                        style={styles.artistHeaderImage}
                    />
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        Playlist de {artistName || 'Artista'}
                    </Text>
                </View>
            </View>

            {/* Lista de vídeos do artista */}
            {artistVideos.length > 0 ? (
                <FlatList
                    data={artistVideos}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleVideoPress(item)}>
                            <VideoItem
                                id={item.id}
                                title={item.title}
                                artist={item.artist}
                                thumbnail={item.thumbnail}
                            />
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.flatListContentContainer}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyListContainer}>
                    <Text style={styles.emptyListText}>
                        {`Nenhum vídeo encontrado para este artista. Parece que ${artistName} não postou videos ainda!`}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#191919',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        marginRight: 15,
        padding: 5, // Aumenta a área clicável
    },
    headerArtistInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Para ocupar o espaço restante
    },
    artistHeaderImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
        backgroundColor: '#555',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        flexShrink: 1, // Para quebrar a linha se o título for muito longo
    },
    flatListContentContainer: {
        paddingVertical: 10,
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyListText: {
        color: '#ccc',
        fontSize: 16,
        textAlign: 'center',
    },
});