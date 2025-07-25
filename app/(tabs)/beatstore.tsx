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
import { addFavoriteMusic, removeFavoriteMusic, FavoritedMusic } from '@/src/redux/favoriteMusicSlice'; // Importar FavoritedMusic
import BeatStoreMusicItem from '@/components/musicItems/beatStoreItem/BeatStoreMusicItem';
// Importar os tipos específicos de beats para os dados mockados
import { ExclusiveBeat, FreeBeat } from '@/src/types/contentType';

// Dados mockados para beats da Beat Store (Feeds e Seguindo) - ATUALIZADO COM TIPAGEM E PROPRIEDADES CORRETAS
// O tipo agora é uma união de ExclusiveBeat e FreeBeat
const MOCKED_BEATSTORE_MUSIC_DATA: (ExclusiveBeat | FreeBeat)[] = [
    {
        id: 'beat-store-1',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        title: 'Trap Beat - "Midnight Groove"',
        artist: 'Producer X',
        producer: 'Producer X', // Adicionado produtor
        cover: 'https://placehold.co/150x150/8A2BE2/FFFFFF?text=BeatX',
        // artistAvatar: 'https://i.pravatar.cc/150?img=10', // Removido, não faz parte de ExclusiveBeat/FreeBeat
        source: 'beatstore-feeds',
        duration: 180000,
        genre: 'Trap',
        price: 49.99,
        typeUse: 'exclusive', // Usar typeUse para indicar se é exclusivo/gratuito
        category: 'beat', // Categoria é 'beat'
        bpm: 120,
        releaseYear: '2023', // Adicionado releaseYear
    } as ExclusiveBeat,
    {
        id: 'beat-store-2',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        title: 'Boom Bap - "Golden Era"',
        artist: 'HipHop Pro',
        producer: 'HipHop Pro', // Adicionado produtor
        cover: 'https://placehold.co/150x150/DAA520/000000?text=BeatY',
        // artistAvatar: 'https://i.pravatar.cc/150?img=11', // Removido
        source: 'beatstore-feeds',
        duration: 210000,
        genre: 'Boom Bap',
        isFree: true, // Para FreeBeat
        typeUse: 'free', // Usar typeUse
        category: 'beat', // Categoria é 'beat'
        bpm: 87,
        releaseYear: '2022', // Adicionado releaseYear
    } as FreeBeat,
    {
        id: 'beat-store-3',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        title: 'Afrobeat - "Vibes Tropicais"',
        artist: 'Afro Maestro',
        producer: 'Afro Maestro', // Adicionado produtor
        cover: 'https://placehold.co/150x150/3CB371/FFFFFF?text=AfroZ',
        source: 'beatstore-feeds',
        duration: 240000,
        genre: 'Afrobeat',
        price: 79.00,
        typeUse: 'exclusive', // Usar typeUse
        category: 'beat', // Categoria é 'beat'
        bpm: 102,
        releaseYear: '2024', // Adicionado releaseYear
    } as ExclusiveBeat,
    {
        id: 'beat-store-4',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        title: 'Drill Type Beat - "Dark Alley"',
        artist: 'Urban Soundz',
        producer: 'Urban Soundz', // Adicionado produtor
        cover: 'https://placehold.co/150x150/4B0082/FFFFFF?text=DrillA',
        // artistAvatar: 'https://i.pravatar.cc/150?img=13', // Removido
        source: 'beatstore-feeds',
        duration: 150000,
        genre: 'Drill',
        isFree: true, // Para FreeBeat
        typeUse: 'free', // Usar typeUse
        category: 'beat', // Categoria é 'beat'
        bpm: 90,
        releaseYear: '2023', // Adicionado releaseYear
    } as FreeBeat,
    {
        id: 'beat-store-5',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        title: 'Trap Soul - "Smooth Operator"',
        artist: 'Groovy Beats',
        producer: 'Groovy Beats', // Adicionado produtor
        cover: 'https://placehold.co/150x150/9370DB/FFFFFF?text=TrapSoul',
        // artistAvatar: 'https://i.pravatar.cc/150?img=14', // Removido
        source: 'beatstore-feeds',
        duration: 190000,
        genre: 'Trap Soul',
        price: 65.50,
        typeUse: 'exclusive', // Usar typeUse
        category: 'beat', // Categoria é 'beat'
        bpm: 85,
        releaseYear: '2024', // Adicionado releaseYear
    } as ExclusiveBeat,
];

export default function BeatStoreScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { activeTab, handleTabChange } = useBeatStoreTabs();

    const favoritedMusics = useAppSelector((state) => state.favoriteMusic.musics);
    const { currentTrack, currentIndex, playlist } = useAppSelector((state) => state.player);
    const followedArtists = useSelector((state: RootState) => state.followedArtists.artists);

    // O filtro aqui já funciona, pois FavoritedMusic estende Track, que por sua vez inclui ExclusiveBeat e FreeBeat
    const favoritedBeatStoreMusics: (ExclusiveBeat | FreeBeat)[] = favoritedMusics.filter(
        (music) =>
            music.category === 'beat' && ( // Adicionado filtro por categoria 'beat'
                music.source === 'beatstore-favorites'||
                music.source === 'beatstore-feeds'
            )
    ) as (ExclusiveBeat | FreeBeat)[]; // Casting para o tipo correto

    const handleToggleFavorite = (music: ExclusiveBeat | FreeBeat) => { // Tipagem atualizada
        const isFavorited = favoritedMusics.some((favMusic) => favMusic.id === music.id);
        // O dispatch de addFavoriteMusic e removeFavoriteMusic espera FavoritedMusic, que estende Track.
        // Como ExclusiveBeat e FreeBeat são PlayableContent, e Track é PlayableContent,
        // eles são compatíveis com FavoritedMusic.
        if (isFavorited) {
            dispatch(removeFavoriteMusic(music.id));
        } else {
            dispatch(addFavoriteMusic(music as FavoritedMusic)); // Casting para FavoritedMusic
        }
    };

    const handlePlayMusic = (music: ExclusiveBeat | FreeBeat) => { // Tipagem atualizada
        // Certifica-se de que a música a ser reproduzida é do tipo Track, que é o que o playerSlice espera
        const trackToPlay = music as Track;

        const isAlreadyPlaying = currentTrack?.id === trackToPlay.id && playlist.some(t => t.id === trackToPlay.id);

        if (isAlreadyPlaying) {
            dispatch(playTrackThunk(currentIndex));
        } else {
            dispatch(
                setPlaylistAndPlayThunk({
                    newPlaylist: [trackToPlay],
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
                                    item={item} // Passa o item completo
                                    onPress={handlePlayMusic}
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
                                        item={item} // Passa o item completo
                                        onPress={handlePlayMusic}
                                        // As props abaixo não são mais necessárias, pois BeatStoreMusicItem as deriva do 'item'
                                        // onToggleFavorite={handleToggleFavorite}
                                        // isFavorited={favoritedMusics.some((favMusic) => favMusic.id === item.id)}
                                        // isCurrent={currentTrack?.id === item.id}
                                        // price={item.price}
                                        // isFree={item.isFree}
                                        // genre={item.genre}
                                        // bpm={item.bpm}
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
        paddingHorizontal: 10,
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
        justifyContent: 'space-between',
        marginBottom: 8,
    },
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