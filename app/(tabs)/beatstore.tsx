// app/(tabs)/beatstore.tsx
import React from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store';

import TopTabBarBeatStore from '@/components/topTabBarBeatStoreScreen';
import useBeatStoreTabs from '@/hooks/useBeatStoreTabs';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { Track, playTrackThunk, setPlaylistAndPlayThunk } from '@/src/redux/playerSlice';
import { addFavoriteMusic, removeFavoriteMusic } from '@/src/redux/favoriteMusicSlice';
import BeatStoreMusicItem from '@/components/musicItems/beatStoreItem/BeatStoreMusicItem';

// Dados mockados para beats da Beat Store (Feeds e Seguindo) - ADICIONADO PREÇO E GÊNERO
const MOCKED_BEATSTORE_MUSIC_DATA: Track[] = [
    {
        id: 'beat-store-1',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        title: 'Trap Beat - "Midnight Groove"',
        artist: 'Producer X',
        cover: 'https://placehold.co/150x150/8A2BE2/FFFFFF?text=BeatX',
        artistAvatar: 'https://i.pravatar.cc/150?img=10',
        source: 'beatstore-feeds',
        duration: 180000,
        // NOVOS DADOS
        genre: 'Trap',
        price: 49.99, // Exemplo de beat exclusivo
        isFree: false,
        bpm: 120,
    },
    {
        id: 'beat-store-2',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        title: 'Boom Bap - "Golden Era"',
        artist: 'HipHop Pro',
        cover: 'https://placehold.co/150x150/DAA520/000000?text=BeatY',
        artistAvatar: 'https://i.pravatar.cc/150?img=11',
        source: 'beatstore-feeds',
        duration: 210000,
        // NOVOS DADOS
        genre: 'Boom Bap',
        price: 0, // Ou simplesmente não incluir 'price' se for gratuito
        isFree: true,
        bpm: 87,
    },
    {
        id: 'beat-store-3',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        title: 'Afrobeat - "Vibes Tropicais"',
        artist: 'Afro Maestro',
        cover: 'https://placehold.co/150x150/3CB371/FFFFFF?text=AfroZ',
        artistAvatar: 'https://i.pravatar.cc/150?img=12',
        source: 'beatstore-seguindo',
        duration: 240000,
        // NOVOS DADOS
        genre: 'Afrobeat',
        price: 79.00,
        isFree: false,
        bpm: 102,
    },
    {
        id: 'beat-store-4',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        title: 'Drill Type Beat - "Dark Alley"',
        artist: 'Urban Soundz',
        cover: 'https://placehold.co/150x150/4B0082/FFFFFF?text=DrillA',
        artistAvatar: 'https://i.pravatar.cc/150?img=13',
        source: 'beatstore-feeds',
        duration: 150000,
        // NOVOS DADOS
        genre: 'Drill',
        price: 0,
        isFree: true,
        bpm: 90,
    },
    {
        id: 'beat-store-5',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        title: 'Trap Soul - "Smooth Operator"',
        artist: 'Groovy Beats', // Artista diferente para exemplo
        cover: 'https://placehold.co/150x150/9370DB/FFFFFF?text=TrapSoul',
        artistAvatar: 'https://i.pravatar.cc/150?img=14',
        source: 'beatstore-feeds',
        duration: 190000,
        // NOVOS DADOS
        genre: 'Trap Soul',
        price: 65.50,
        isFree: false,
        bpm: 85,
    },
];

export default function BeatStoreScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { activeTab, handleTabChange } = useBeatStoreTabs();

    const favoritedMusics = useAppSelector((state) => state.favoriteMusic.musics);
    const { currentTrack, currentIndex, playlist } = useAppSelector((state) => state.player);
    const followedArtists = useSelector((state: RootState) => state.followedArtists.artists);

    const favoritedBeatStoreMusics = favoritedMusics.filter(
        (music) =>
            music.source === 'beatstore-curtidas' || music.source === 'beatstore-seguindo' || music.source === 'beatstore-feeds'
    );

    const handleToggleFavorite = (music: Track) => {
        const isFavorited = favoritedMusics.some((favMusic) => favMusic.id === music.id);
        if (isFavorited) {
            dispatch(removeFavoriteMusic(music.id));
        } else {
            dispatch(addFavoriteMusic(music));
        }
    };

    const handlePlayMusic = (music: Track) => {
        const isAlreadyPlaying = currentTrack?.id === music.id && playlist.some(t => t.id === music.id);

        if (isAlreadyPlaying) {
            dispatch(playTrackThunk(currentIndex));
        } else {
            dispatch(
                setPlaylistAndPlayThunk({
                    newPlaylist: [music],
                    startIndex: 0,
                    shouldPlay: true,
                })
            );
        }
    };

    const handleNavigateToArtistProfile = (artistId: string) => {
        router.push(`/contentCardLibraryScreens/artist-profile/${artistId}`);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#191919' }}>
            <TopTabBarBeatStore />

            <View style={styles.tabsContainer}>
                {['feeds', 'curtidas', 'seguindo'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => handleTabChange(tab as 'feeds' | 'curtidas' | 'seguindo')}
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

            <ScrollView
                horizontal={false}
                style={styles.scroll}
                contentContainerStyle={styles.container}
                showsHorizontalScrollIndicator={false}
            >
                {activeTab === 'feeds' && (
                    <View style={styles.beatStoreMusicListContainer}>
                        <Text style={styles.title}>Feeds (Beats em Destaque)</Text>
                        <FlatList
                            data={MOCKED_BEATSTORE_MUSIC_DATA.filter(m => m.source === 'beatstore-feeds')}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            columnWrapperStyle={styles.row} 
                            renderItem={({ item }) => (
                                <BeatStoreMusicItem
                                    music={item}
                                    onPress={() => handlePlayMusic(item)}
                                    onToggleFavorite={handleToggleFavorite}
                                    isFavorited={favoritedMusics.some((favMusic) => favMusic.id === item.id)}
                                    isCurrent={currentTrack?.id === item.id}
                                    price={item.price}
                                    isFree={item.isFree || false}
                                    genre={item.genre}
                                    bpm={item.bpm}
                                
                                />
                            )}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            ListEmptyComponent={() => (
                                <Text style={styles.emptyListText}>Nenhum beat nos feeds da Beat Store.</Text>
                            )}
                        />
                    </View>
                )}

                {activeTab === 'curtidas' && (
                    <View style={styles.favoritedMusicListContainer}>
                        <Text style={styles.title}>Músicas Curtidas (Beat Store)</Text>
                        <Text style={styles.infoMessage}>
                            Instrumentais de uso exclusivo (que estão à venda) podem ser automaticamente removidos dos favoritos se forem comprados por outro utilizador. Apenas beats de uso livre podem permanecer permanentemente.
                        </Text>
                        {favoritedBeatStoreMusics.length === 0 ? (
                            <Text style={styles.emptyListText}>Nenhum beat curtido ainda na Beat Store.</Text>
                        ) : (
                            <FlatList
                                data={favoritedBeatStoreMusics}
                                keyExtractor={(item) => item.id}
                                numColumns={2}
                                columnWrapperStyle={styles.row}
                                renderItem={({ item }) => (
                                    <BeatStoreMusicItem
                                        item={item}
                                        onPress={() => handlePlayMusic(item)}
                                        onToggleFavorite={handleToggleFavorite}
                                        isFavorited={favoritedMusics.some((favMusic) => favMusic.id === item.id)}
                                        isCurrent={currentTrack?.id === item.id}
                                        price={item.price} 
                                        isFree={item.isFree} 
                                        genre={item.genre}
                                        bpm={item.bpm}
                                        
                                    />
                                )}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            />
                        )}
                    </View>
                )}

                {/* Conteúdo da tab 'seguindo' (AGORA EXIBE OS ARTISTAS SEGUIDOS DO REDUX) */}
                {activeTab === 'seguindo' && (
                    <FlatList
                        data={followedArtists}
                        keyExtractor={(item) => item.id}
                        ListEmptyComponent={() => (
                            <View style={styles.tabContentTextContainer}>
                                <Text style={styles.tabContentText}>Você não está seguindo nenhum artista.</Text>
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.followedArtistItem}
                                onPress={() => handleNavigateToArtistProfile(item.id)}
                            >
                                <Image
                                    source={item.profileImageUrl ? { uri: item.profileImageUrl } : require('@/assets/images/Default_Profile_Icon/unknown_artist.png')}
                                    style={styles.followedArtistProfileImage}
                                />
                                <Text style={styles.followedArtistName}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.flatListContentContainer}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                    />
                )}
                <View style={{ height: 110 }}></View>
            </ScrollView>

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => {
                    router.push('/autoSearchBeatScreens/useSearchBeatScreen');
                    console.log('Botão da Beat Store pressionado!');
                }}
            >
                <Image
                    source={require('@/assets/images/4/sound-waves.png')}
                    style={{ width: 50, height: 40, tintColor: '#fff' }}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: '#191919',
    },
    container: {
        flexGrow: 1,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 110,
        right: 25,
        width: 60,
        height: 60,
        backgroundColor: '#1565C0',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginLeft: 10,
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
    title: {
        color: '#fff',
        marginTop: 20,
        marginLeft: 15,
        marginBottom: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    favoritedMusicListContainer: {
        flex: 1,
    },
    beatStoreMusicListContainer: {
        flex: 1,
        paddingHorizontal: 10, // Adicionado para padding lateral na FlatList
    },
    emptyListText: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 30,
        fontSize: 15,
        marginHorizontal: 20,
    },
    infoMessage: {
        color: '#ccc',
        fontSize: 13,
        marginHorizontal: 15,
        marginBottom: 20,
        textAlign: 'justify',
        lineHeight: 18,
    },
    row: {
        flex: 1,
        justifyContent: 'space-between', // Para distribuir os itens em 2 colunas
        marginBottom: 8, // Espaçamento entre as linhas
    },
    // Removido beatItemColumn, pois o estilo já está no BeatStoreMusicItem agora
    // beatItemColumn: {
    //     width: '48%',
    // },
    followedArtistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        marginHorizontal: 15,
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
        flex: 1,
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
    flatListContentContainer: {
        paddingBottom: 20,
    }
});