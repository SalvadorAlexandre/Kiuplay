// app/(tabs)/VideoClipes.tsx
import React, { useState, useEffect } from 'react'; // Importe useEffect
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import TopTabBarVideos from '@/components/topTabBarVideosScreen';
import VideoItem from '@/components/PlayerVideoComponents/VideoItem'; // Verifique o caminho correto, ajustei para 'ItemPlayerVideo'
import VideoPlayerCore from '@/components/PlayerVideoComponents/VideoPlayerCore'; // Verifique o caminho correto, ajustei para 'VideoPlayerCore'
import VideoInfoAndActions from '@/components/PlayerVideoComponents/VideoInfoAndActions'; // Verifique o caminho correto, ajustei para 'VideoInfoAndActions'

// --- Definição da interface para os dados de cada vídeo ---
export interface VideoData {
    id: string;
    title: string;
    artist: string;
    thumbnail: string;
    videoUrl: string;
}

// Interface para armazenar os estados dos botões de cada vídeo
interface VideoActionStates {
    [videoId: string]: {
        liked: boolean;
        disliked: boolean;
        isFavorited: boolean;
    };
}
// --- Fim da definição da interface ---

// Dados de exemplo (mockados) para os vídeos
const MOCKED_VIDEO_DATA: VideoData[] = [
    { id: '1', title: 'Minha Música Perfeita', artist: 'Artista A', thumbnail: 'https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: '2', title: 'Ritmo da Cidade Noturna', artist: 'Banda B', thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: '3', title: 'Noite Estrelada de Verão', artist: 'Cantor C', thumbnail: 'https://i.ytimg.com/vi/3y7Kq2l_k6w/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/c.mp4' },
    { id: '4', title: 'Sons da Natureza Selvagem', artist: 'Grupo D', thumbnail: 'https://i.ytimg.com/vi/F-glUq_jWv0/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/d.mp4' },
    { id: '5', title: 'Caminhos da Descoberta', artist: 'Artista E', thumbnail: 'https://i.ytimg.com/vi/2N7TfX6f4oM/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/a.mp4' },
    { id: '6', title: 'Amanhecer Dourado', artist: 'Solista F', thumbnail: 'https://i.ytimg.com/vi/eJk8e8e8e8e/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/b.mp4' },
    { id: '7', title: 'Energia Vibrante', artist: 'DJ G', thumbnail: 'https://i.ytimg.com/vi/xM6uD7n1BfQ/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/c.mp4' },
    { id: '8', title: 'Reflexões Profundas', artist: 'Poeta H', thumbnail: 'https://i.ytimg.com/vi/wA5wA5wA5wA/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/d.mp4' },
];

type TabName = 'feeds' | 'curtidas' | 'seguindo';

export default function VideoClipesScreen() {
    const [currentPlayingVideo, setCurrentPlayingVideo] = useState<VideoData | null>(MOCKED_VIDEO_DATA.length > 0 ? MOCKED_VIDEO_DATA[0] : null);
    const [activeTab, setActiveTab] = useState<TabName>('feeds');

    // **Novo estado para armazenar as ações de cada vídeo**
    const [videoActionStates, setVideoActionStates] = useState<VideoActionStates>(() => {
        // Inicializa o estado para todos os vídeos com false
        const initialState: VideoActionStates = {};
        MOCKED_VIDEO_DATA.forEach(video => {
            initialState[video.id] = { liked: false, disliked: false, isFavorited: false };
        });
        return initialState;
    });

    const { width } = Dimensions.get('window');
    const playerWidth = width;
    const playerHeight = playerWidth * (9 / 16); // Proporção 16:9

    const handleVideoPress = (item: VideoData) => {
        setCurrentPlayingVideo(item);
        // Não é necessário resetar o estado aqui, pois ele já está salvo em videoActionStates
    };

    const handleTabChange = (tab: TabName) => {
        setActiveTab(tab);
    };

    // **Funções para alternar os estados dos botões, que serão passadas para o filho**
    const handleToggleLike = (videoId: string) => {
        setVideoActionStates(prevStates => {
            const currentLiked = prevStates[videoId]?.liked || false;
            const currentDisliked = prevStates[videoId]?.disliked || false;

            return {
                ...prevStates,
                [videoId]: {
                    ...prevStates[videoId], // Mantém outros estados do vídeo se existirem
                    liked: !currentLiked,
                    disliked: currentLiked ? currentDisliked : false, // Desativa dislike se like for ativado
                },
            };
        });
    };

    const handleToggleDislike = (videoId: string) => {
        setVideoActionStates(prevStates => {
            const currentDisliked = prevStates[videoId]?.disliked || false;
            const currentLiked = prevStates[videoId]?.liked || false;

            return {
                ...prevStates,
                [videoId]: {
                    ...prevStates[videoId], // Mantém outros estados do vídeo se existirem
                    disliked: !currentDisliked,
                    liked: currentDisliked ? currentLiked : false, // Desativa like se dislike for ativado
                },
            };
        });
    };

    const handleToggleFavorite = (videoId: string) => {
        setVideoActionStates(prevStates => ({
            ...prevStates,
            [videoId]: {
                ...prevStates[videoId], // Mantém outros estados do vídeo se existirem
                isFavorited: !((prevStates[videoId]?.isFavorited) || false), // Alterna o estado de favorito
            },
        }));
    };

    // Garante que o estado inicial de currentPlayingVideo seja refletido
    // no videoActionStates caso a lista MOCKED_VIDEO_DATA seja vazia inicialmente
    useEffect(() => {
        if (!currentPlayingVideo && MOCKED_VIDEO_DATA.length > 0) {
            setCurrentPlayingVideo(MOCKED_VIDEO_DATA[0]);
        }
    }, [currentPlayingVideo]);


    return (
        <View style={styles.container}>
            {/* Topo fixo: TopTabBarVideos */}
            <TopTabBarVideos />

            {/* Video Player fixo na parte superior */}
            {currentPlayingVideo ? (
                <VideoPlayerCore
                    videoUrl={currentPlayingVideo.videoUrl}
                    playerWidth={playerWidth}
                    playerHeight={playerHeight}
                />
            ) : (
                <View style={[styles.loadingPlayerContainer, { height: playerHeight }]}>
                    <Text style={styles.loadingPlayerText}>Carregando vídeo...</Text>
                </View>
            )}

            {/* ScrollView principal para o conteúdo abaixo do player fixo */}
            <ScrollView style={styles.scrollableContent} showsVerticalScrollIndicator={false}>
                {/* Tabs de navegação */}
                <View style={styles.tabsContainer}>
                    {['feeds', 'curtidas', 'seguindo'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => handleTabChange(tab as TabName)}
                            style={[
                                styles.tabButton,
                                activeTab === tab && styles.activeTabButton,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab && styles.activeTabText,
                                ]}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Conteúdo da tab selecionada */}
                {activeTab === 'feeds' && currentPlayingVideo && (
                    <FlatList
                        data={MOCKED_VIDEO_DATA}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={() => (
                            <VideoInfoAndActions
                                // Importante: usar o ID do vídeo atual como key garante que
                                // o componente seja re-montado (e re-renderizado com as props corretas)
                                // quando o vídeo muda, mas sem resetar o estado global.
                                key={currentPlayingVideo.id}
                                title={currentPlayingVideo.title}
                                artist={currentPlayingVideo.artist}
                                videoId={currentPlayingVideo.id} // Passa o ID do vídeo
                                // Passa os estados específicos para o currentPlayingVideo
                                liked={videoActionStates[currentPlayingVideo.id]?.liked || false}
                                disliked={videoActionStates[currentPlayingVideo.id]?.disliked || false}
                                isFavorited={videoActionStates[currentPlayingVideo.id]?.isFavorited || false}
                                // Passa as funções de callback
                                onToggleLike={handleToggleLike}
                                onToggleDislike={handleToggleDislike}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        )}
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
                        scrollEnabled={false}
                    />
                )}

                {activeTab === 'curtidas' && (
                    <View style={styles.tabContentTextContainer}>
                        <Text style={styles.tabContentText}>Músicas Curtidas</Text>
                    </View>
                )}

                {activeTab === 'seguindo' && (
                    <View style={styles.tabContentTextContainer}>
                        <Text style={styles.tabContentText}>Artistas Seguindo</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919',
    },
    loadingPlayerContainer: {
        width: '100%',
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingPlayerText: {
        color: '#fff',
        fontSize: 16,
    },
    scrollableContent: {
        flex: 1,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#191919',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#333',
        marginHorizontal: 10,
    },
    activeTabButton: {
        backgroundColor: '#1565C0',
    },
    tabText: {
        color: '#aaa',
        fontWeight: 'bold',
    },
    activeTabText: {
        color: '#fff',
    },
    flatListContentContainer: {
        paddingBottom: 20,
    },
    tabContentTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    tabContentText: {
        color: '#fff',
        fontSize: 16,
    }
});