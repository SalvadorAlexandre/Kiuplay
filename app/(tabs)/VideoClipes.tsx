// app/(tabs)/videoClipes.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Image // Importe Image para renderizar profileImageUrl na aba "seguindo"
} from 'react-native';
import TopTabBarVideos from '@/components/topTabBarVideosScreen';
import VideoItem from '@/components/PlayerVideoComponents/VideoItem';
import VideoPlayerCore from '@/components/PlayerVideoComponents/VideoPlayerCore';
import VideoInfoAndActions from '@/components/PlayerVideoComponents/VideoInfoAndActions';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/redux/store';
import { addFavoriteVideo, removeFavoriteVideo } from '@/src/redux/favoriteVideoSlice';
import { FollowedArtist, addFollowedArtist, removeFollowedArtist } from '@/src/redux/followedArtistsSlice'; // <-- IMPORTANTE: Novas importações

// --- Definição da interface para os dados de cada vídeo ---
export interface VideoData {
    id: string;
    title: string;
    artist: string;
    artistId: string; // <-- NOVO: ID do artista
    artistProfileImageUrl?: string; // <-- NOVO: URL da imagem de perfil do artista
    thumbnail: string;
    videoUrl: string;
}

// Interface para armazenar os estados dos botões de LIKE/DISLIKE de cada vídeo
interface VideoActionStates {
    [videoId: string]: {
        liked: boolean;
        disliked: boolean;
    };
}
// --- Fim da definição da interface ---

// Dados de exemplo (mockados) para os vídeos
// ADICIONE artistId e artistProfileImageUrl aos seus dados mockados!
export const MOCKED_VIDEO_DATA: VideoData[] = [
    { id: '1', title: 'Minha Música Perfeita', artist: 'Artista A', artistId: 'artist1', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=1', thumbnail: 'https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: '2', title: 'Ritmo da Cidade Noturna', artist: 'Banda B', artistId: 'artist2', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=2', thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: '3', title: 'Noite Estrelada de Verão', artist: 'Cantor C', artistId: 'artist3', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=3', thumbnail: 'https://i.ytimg.com/vi/3y7Kq2l_k6w/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/c.mp4' },
    { id: '4', title: 'Sons da Natureza Selvagem', artist: 'Grupo D', artistId: 'artist4', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=4', thumbnail: 'https://i.ytimg.com/vi/F-glUq_jWv0/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/d.mp4' },
    { id: '5', title: 'Caminhos da Descoberta', artist: 'Artista E', artistId: 'artist5', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=5', thumbnail: 'https://i.ytimg.com/vi/2N7TfX6f4oM/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/a.mp4' },
    { id: '6', title: 'Amanhecer Dourado', artist: 'Solista F', artistId: 'artist6', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=6', thumbnail: 'https://i.ytimg.com/vi/eJk8e8e8e8e/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/b.mp4' },
    { id: '7', title: 'Energia Vibrante', artist: 'DJ G', artistId: 'artist7', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=7', thumbnail: 'https://i.ytimg.com/vi/xM6uD7n1BfQ/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/c.mp4' },
    { id: '8', title: 'Reflexões Profundas', artist: 'Poeta H', artistId: 'artist8', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=8', thumbnail: 'https://i.ytimg.com/vi/wA5wA5wA5wA/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/d.mp4' },
];

type TabName = 'feeds' | 'curtidas' | 'seguindo';

export default function VideoClipesScreen() {
    const [currentPlayingVideo, setCurrentPlayingVideo] = useState<VideoData | null>(MOCKED_VIDEO_DATA.length > 0 ? MOCKED_VIDEO_DATA[0] : null);
    const [activeTab, setActiveTab] = useState<TabName>('feeds');

    const dispatch = useDispatch();
    const favoriteVideos = useSelector((state: RootState) => state.favorites.videos);
    const followedArtists = useSelector((state: RootState) => state.followedArtists.artists); // <-- NOVO: Pega artistas seguidos do Redux

    // Estado para armazenar apenas as ações de like/dislike de cada vídeo
    const [videoActionStates, setVideoActionStates] = useState<VideoActionStates>(() => {
        const initialState: VideoActionStates = {};
        MOCKED_VIDEO_DATA.forEach(video => {
            initialState[video.id] = { liked: false, disliked: false };
        });
        return initialState;
    });

    const { width } = Dimensions.get('window');
    const playerWidth = width;
    const playerHeight = playerWidth * (9 / 16); // Proporção 16:9

    const handleVideoPress = (item: VideoData) => {
        setCurrentPlayingVideo(item);
    };

    const handleTabChange = (tab: TabName) => {
        setActiveTab(tab);
    };

    const handleToggleLike = (videoId: string) => {
        setVideoActionStates(prevStates => {
            const currentLiked = prevStates[videoId]?.liked || false;
            return {
                ...prevStates,
                [videoId]: {
                    ...prevStates[videoId],
                    liked: !currentLiked,
                    disliked: currentLiked ? (prevStates[videoId]?.disliked || false) : false,
                },
            };
        });
    };

    const handleToggleDislike = (videoId: string) => {
        setVideoActionStates(prevStates => {
            const currentDisliked = prevStates[videoId]?.disliked || false;
            return {
                ...prevStates,
                [videoId]: {
                    ...prevStates[videoId],
                    disliked: !currentDisliked,
                    liked: currentDisliked ? (prevStates[videoId]?.liked || false) : false,
                },
            };
        });
    };

    const handleToggleFavorite = (videoId: string) => {
        const videoToToggle = MOCKED_VIDEO_DATA.find(v => v.id === videoId);
        if (!videoToToggle) {
            console.warn(`Vídeo com ID ${videoId} não encontrado para favoritar/desfavoritar.`);
            return;
        }

        const isCurrentlyFavorited = favoriteVideos.some(fav => fav.videoId === videoId);

        if (isCurrentlyFavorited) {
            dispatch(removeFavoriteVideo(videoId));
        } else {
            dispatch(addFavoriteVideo({
                videoId: videoToToggle.id,
                title: videoToToggle.title,
                artist: videoToToggle.artist,
                videoThumbnailUrl: videoToToggle.thumbnail,
            }));
        }
    };

    // Garante que o currentPlayingVideo tenha um valor inicial se a lista de dados não for vazia
    useEffect(() => {
        if (!currentPlayingVideo && MOCKED_VIDEO_DATA.length > 0) {
            setCurrentPlayingVideo(MOCKED_VIDEO_DATA[0]);
        }
    }, [currentPlayingVideo]);


    return (
        <View style={styles.container}>
            {/* Topo fixo: TopTabBarVideos */}
            <TopTabBarVideos activeTab={activeTab} />

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
                                key={currentPlayingVideo.id}
                                title={currentPlayingVideo.title}
                                artist={currentPlayingVideo.artist}
                                videoId={currentPlayingVideo.id}
                                liked={videoActionStates[currentPlayingVideo.id]?.liked || false}
                                disliked={videoActionStates[currentPlayingVideo.id]?.disliked || false}
                                isFavorited={favoriteVideos.some(fav => fav.videoId === currentPlayingVideo.id)}
                                // <-- NOVAS PROPS para isArtistFollowed e artistId
                                isArtistFollowed={followedArtists.some(artist => artist.id === currentPlayingVideo.artistId)}
                                artistId={currentPlayingVideo.artistId}
                                artistProfileImageUrl={currentPlayingVideo.artistProfileImageUrl}
                                videoUrl={currentPlayingVideo.videoUrl} // <-- PASSANDO A VIDEOURL AQUI
                                playlistVideo={currentPlayingVideo.id}
                                // FIM NOVAS PROPS
                                onToggleLike={handleToggleLike}
                                onToggleDislike={handleToggleDislike}
                                onToggleFavorite={handleToggleFavorite}
                                videoThumbnailUrl={currentPlayingVideo.thumbnail}
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

                {/* Conteúdo da tab 'curtidas' (agora exibe os favoritos do Redux) */}
                {activeTab === 'curtidas' && (
                    <FlatList
                        data={favoriteVideos}
                        keyExtractor={(item) => item.videoId}
                        ListEmptyComponent={() => (
                            <View style={styles.tabContentTextContainer}>
                                <Text style={styles.tabContentText}>Nenhum vídeo favorito ainda.</Text>
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleVideoPress({
                                id: item.videoId,
                                title: item.title,
                                artist: item.artist,
                                thumbnail: item.videoThumbnailUrl,
                                // ATENÇÃO: Se o vídeo favorito não tem a URL do vídeo original,
                                // você pode ter que buscá-la novamente ou incluí-la no FavoritedVideo
                                // Para este exemplo, estou mantendo a URL mockada.
                                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                                artistId: MOCKED_VIDEO_DATA.find(v => v.id === item.videoId)?.artistId || '', // Tentar encontrar o artistId
                                artistProfileImageUrl: MOCKED_VIDEO_DATA.find(v => v.id === item.videoId)?.artistProfileImageUrl || '', // Tentar encontrar a profileImageUrl
                            })}>
                                <VideoItem
                                    id={item.videoId}
                                    title={item.title}
                                    artist={item.artist}
                                    thumbnail={item.videoThumbnailUrl}
                                />
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.flatListContentContainer}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                    />
                )}
                {/* Conteúdo da tab 'seguindo' (AGORA EXIBE OS ARTISTAS SEGUIDOS DO REDUX) */}
                {activeTab === 'seguindo' && (
                    <FlatList
                        data={followedArtists} // <-- EXIBE ARTISTAS SEGUIDOS
                        keyExtractor={(item) => item.id}
                        ListEmptyComponent={() => (
                            <View style={styles.tabContentTextContainer}>
                                <Text style={styles.tabContentText}>Você não está seguindo nenhum artista.</Text>
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <View style={styles.followedArtistItem}>
                                <Image
                                    source={item.profileImageUrl ? { uri: item.profileImageUrl } : require('@/assets/images/Default_Profile_Icon/unknown_artist.png')}
                                    style={styles.followedArtistProfileImage}
                                />
                                <Text style={styles.followedArtistName}>{item.name}</Text>
                                {/* Poderia adicionar um botão de "Deixar de Seguir" aqui também */}
                                <TouchableOpacity
                                    style={styles.unfollowButton}
                                    onPress={() => dispatch(removeFollowedArtist(item.id))}
                                >
                                    <Text style={styles.unfollowButtonText}>Deixar de Seguir</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        contentContainerStyle={styles.flatListContentContainer}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                    />
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
    },
    // NOVOS ESTILOS PARA A ABA "SEGUINDO"
    followedArtistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    followedArtistProfileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        backgroundColor: '#555',
    },
    followedArtistName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1, // Para ocupar o espaço restante
    },
    unfollowButton: {
        backgroundColor: '#FF3D00', // Vermelho para "Deixar de Seguir"
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    unfollowButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
    },
});