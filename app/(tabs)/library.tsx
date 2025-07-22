// app/(tabs)/library.tsx
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

import TopTabBarLibrary from '@/components/topTabBarLibraryScreen';
import { useSelectedMusic, TypeMusic } from '@/hooks/useSelectedMusic';
import useSubTabSelectorLibrary, { TypeSubTab } from '@/hooks/useSubTabSelectorLibrary';
import LocalMusicScreen from '@/components/audioLocalComponent/useMusicLocalList';

import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { Track } from '@/src/redux/playerSlice';
import LibraryContentCard from '@/components/musicItems/LibraryItem/LibraryContentCard';
import {
    LibraryFeedItem,
    Album,
    ArtistProfile,
    Single,
    ExtendedPlayEP,
    // REMOVIDOS: Playlist, Video, Promotion do import
} from '@/src/types/contentType';

// ---
// Dados mockados (MOCKED_CLOUD_FEED_DATA) - AJUSTADOS (Playlists, EPs, etc. removidos/corrigidos para ficarem apenas os tipos suportados no LibraryContentCard agora)
export const MOCKED_CLOUD_FEED_DATA: LibraryFeedItem[] = [
    {
        id: 'single-1',
        uri: '[https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3](https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3)',
        title: 'Vibe Urbana',
        artist: 'BeatMaster',
        cover: '',
        artistAvatar: '[https://i.pravatar.cc/150?img=6](https://i.pravatar.cc/150?img=6)',
        source: 'library-cloud-feeds',
        duration: 180000,
        category: 'single', // Alterado 'type' para 'category' para consistência
        genre: 'Hip Hop',
        releaseYear: '2024', // Alterado 'viewsNumber' para 'releaseYear' ou similar
        viewsCount: 271, // Adicionada viewsCount se for relevante para Single
    } as Single,
    {
        id: 'album-1',
        title: 'Retrospectiva Jazz',
        artist: 'Jazz Collective',
        cover: '[https://placehold.co/300x300/4682B4/FFFFFF?text=Album+Jazz](https://placehold.co/300x300/4682B4/FFFFFF?text=Album+Jazz)',
        category: 'album', // Alterado 'type' para 'category'
        releaseYear: '2023', // Alterado 'releaseDate' para 'releaseYear'
        mainGenre: 'Jazz', // Alterado 'genre' para 'mainGenre'
    } as Album,
    {
        id: 'artist-1',
        name: 'Mestre da Batida',
        username: '@mestre_batida_ofc', // Adicionado username para consistência
        avatar: '[https://i.pravatar.cc/150?img=7](https://i.pravatar.cc/150?img=7)',
        category: 'artist', // Alterado 'type' para 'category'
        genres: ['Hip Hop', 'Trap'],
        releaseYear: '2010', // Adicionado releaseYear
    } as ArtistProfile,
    {
        id: 'ep-1',
        title: 'Sons do Verão',
        artist: 'Tropical Vibes',
        cover: '[https://placehold.co/300x300/32CD32/FFFFFF?text=EP+Ver%C3%A3o](https://placehold.co/300x300/32CD32/FFFFFF?text=EP+Ver%C3%A3o)',
        category: 'ep', // Alterado 'type' para 'category'
        releaseYear: '2024', // Alterado 'releaseDate' para 'releaseYear'
        mainGenre: 'Reggaeton', // Alterado 'genre' para 'mainGenre'
        trackIds: [], // Adicionado trackIds para EP 
    } as ExtendedPlayEP,
    // REMOVIDO: { id: 'playlist-1', ... }
    {
        id: 'single-2',
        uri: '[https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3](https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3)',
        title: 'Caminhos do Soul',
        artist: 'Soulful Echoes',
        cover: '[https://placehold.co/300x300/8A2BE2/FFFFFF?text=Single+Soul](https://placehold.co/300x300/8A2BE2/FFFFFF?text=Single+Soul)',
        artistAvatar: '[https://i.pravatar.cc/150?img=8](https://i.pravatar.cc/150?img=8)',
        source: 'library-cloud-feeds',
        duration: 210000,
        category: 'single', // Alterado 'type' para 'category'
        genre: 'Soul',
        releaseYear: '2024',
        viewsCount: 1000,
    } as Single,
    {
        id: 'artist-2',
        name: 'EveryDay',
        username: '@everyday_ofc',
        avatar: '[https://i.pravatar.cc/150?img=7](https://i.pravatar.cc/150?img=7)',
        category: 'artist',
        genres: ['Hip Hop', 'Trap'],
        releaseYear: '2018',
    } as ArtistProfile,
    {
        id: 'album-2',
        title: 'O Despertar',
        artist: 'Aura Sonora',
        cover: '[https://placehold.co/300x300/CD5C5C/FFFFFF?text=Album+Aura](https://placehold.co/300x300/CD5C5C/FFFFFF?text=Album+Aura)',
        category: 'album',
        releaseYear: '2024',
        mainGenre: 'Ambient',
    } as Album,
    {
        id: 'artist-3',
        name: 'Helloby',
        username: '@helloby_music',
        avatar: '[https://i.pravatar.cc/150?img=7](https://i.pravatar.cc/150?img=7)',
        category: 'artist',
        genres: ['Zouck', 'Trap'],
        releaseYear: '2015',
    } as ArtistProfile,
    {
        id: 'artist-4',
        name: 'Rainha do R&B',
        username: '@rainha_rnb_ofc',
        avatar: '[https://i.pravatar.cc/150?img=9](https://i.pravatar.cc/150?img=9)',
        category: 'artist',
        genres: ['R&B', 'Pop'],
        releaseYear: '2020',
    } as ArtistProfile,
    {
        id: 'ep-2',
        title: 'Reflexões Noturnas',
        artist: 'Dreamweaver',
        cover: '[https://placehold.co/300x300/6A5ACD/FFFFFF?text=EP+Night](https://placehold.co/300x300/6A5ACD/FFFFFF?text=EP+Night)',
        category: 'ep',
        releaseYear: '2023',
        mainGenre: 'Eletrônica',
        trackIds: []
    } as ExtendedPlayEP,
    // REMOVIDOS: playlist-2, playlist-3, playlist-4
];
// ---

const SubTabBar = ({
    tabs,
    group,
    isSelectedSubTab,
    selectSubTab,
}: {
    tabs: TypeSubTab[];
    group: 'local' | 'cloud';
    isSelectedSubTab: (group: 'local' | 'cloud', tab: TypeSubTab) => boolean;
    selectSubTab: (group: 'local' | 'cloud', tab: TypeSubTab) => void;
}) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab}
                    style={[
                        styles.tabButton,
                        isSelectedSubTab(group, tab) && styles.activeTabButton,
                    ]}
                    onPress={() => selectSubTab(group, tab)}
                >
                    <Text
                        style={[
                            styles.tabText,
                            isSelectedSubTab(group, tab) && styles.activeTabText,
                        ]}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default function LibraryScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { selectedLibraryContent, setSelectedLibraryContent } = useSelectedMusic();
    const {
        isSelectedSubTab,
        selectSubTab,
        getSelectedSubTab,
    } = useSubTabSelectorLibrary();

    const favoritedMusics = useAppSelector((state) => state.favoriteMusic.musics);
    const followedArtists = useSelector((state: RootState) => state.followedArtists.artists);

    const favoritedCloudTracks: Track[] = favoritedMusics.filter(
        (music) =>
            music.category === 'single' && ( // Manteve music.category, corrigi para 'single'
                music.source === 'library-cloud-feeds' ||
                music.source === 'library-cloud-favorites' ||
                music.source === 'library-local'
            )
    ) as Track[];

    const isSelected = (current: TypeMusic, type: TypeMusic): boolean => {
        return current === type;
    };

    const localTabs: TypeSubTab[] = ['tudo', 'pastas', 'downloads'];
    const cloudTabs: TypeSubTab[] = ['feeds', 'curtidas', 'seguindo'];

    const handleCloudItemPress = (item: LibraryFeedItem) => {
        // Agora, LibraryContentCard só lida com 'single', 'album', 'ep', 'artist'
        if (item.category === 'single') {
            router.push(`/contentCardLibraryScreens/single-details/${item.id}`);
        } else if (item.category === 'album') {
            router.push(`/contentCardLibraryScreens/album-details/${item.id}`);
        } else if (item.category === 'ep') {
            router.push(`/contentCardLibraryScreens/ep-details/${item.id}`);
        } else if (item.category === 'artist') {
            router.push(`/contentCardLibraryScreens/artist-profile/${item.id}`);
        }
        else {
            console.warn('Tipo de item desconhecido ou não suportado para navegação:', item.category);
        }
    };

    const handleNavigateToArtistProfile = (artistId: string) => {
        router.push(`/contentCardLibraryScreens/artist-profile/${artistId}`);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#191919' }}>
            <TopTabBarLibrary />

            <View style={{ marginTop: 10 }}>
                {selectedLibraryContent === 'local' && (
                    <View style={{ paddingVertical: 15, }}>
                        <Text style={styles.title}>Curtir músicas em offline!</Text>
                        <SubTabBar
                            tabs={localTabs}
                            group="local"
                            isSelectedSubTab={isSelectedSubTab}
                            selectSubTab={selectSubTab}
                        />
                    </View>
                )}

                {selectedLibraryContent === 'cloud' && (
                    <View style={{ paddingVertical: 15, }}>
                        <Text style={styles.title}>Ouvir músicas na Kiuplay Cloud!</Text>
                        <SubTabBar
                            tabs={cloudTabs}
                            group="cloud"
                            isSelectedSubTab={isSelectedSubTab}
                            selectSubTab={selectSubTab}
                        />
                    </View>
                )}
            </View>

            <ScrollView
                horizontal={false}
                style={styles.scroll}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {selectedLibraryContent === 'local' && (
                    <>
                        {getSelectedSubTab('local') === 'tudo' &&
                            <View>
                                <LocalMusicScreen />
                            </View>
                        }
                        {getSelectedSubTab('local') === 'pastas' && <Text style={styles.text}>Mostrando pastas</Text>}
                        {getSelectedSubTab('local') === 'downloads' && <Text style={styles.text}>Mostrando downloads</Text>}
                    </>
                )}

                {selectedLibraryContent === 'cloud' && (
                    <>
                        {/* Aba 'Feeds' da Cloud: Exibe todos os tipos de conteúdo */}
                        {getSelectedSubTab('cloud') === 'feeds' && (
                            <View style={styles.cloudMusicListContainer}>
                                <FlatList
                                    data={MOCKED_CLOUD_FEED_DATA}
                                    keyExtractor={(item) => item.id}
                                    numColumns={2}
                                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                                    renderItem={({ item }) => (
                                        <View style={styles.cardItemColumn}>
                                            <LibraryContentCard
                                                item={item}
                                                onPress={handleCloudItemPress}
                                            />
                                        </View>
                                    )}
                                    contentContainerStyle={styles.flatListContentContainer}
                                    ListEmptyComponent={() => (
                                        <Text style={styles.emptyListText}>Nenhum conteúdo no feed da cloud.</Text>
                                    )}
                                />
                            </View>
                        )}

                        {/* Aba 'Curtidas' da Cloud: Exibe apenas músicas/singles curtidos */}
                        {getSelectedSubTab('cloud') === 'curtidas' && (
                            <View style={styles.cloudMusicListContainer}>
                                <Text style={styles.title}>Músicas Curtidas (Cloud)</Text>
                                {favoritedCloudTracks.length === 0 ? (
                                    <Text style={styles.emptyListText}>Nenhuma música curtida na cloud ainda.</Text>
                                ) : (
                                    <FlatList
                                        data={favoritedCloudTracks}
                                        keyExtractor={(item) => item.id}
                                        numColumns={2}
                                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                                        renderItem={({ item }) => (
                                            <View style={styles.cardItemColumn}>
                                                {/* Certifique-se de que `item` é compatível com `LibraryFeedItem` */}
                                                <LibraryContentCard
                                                    item={item as unknown as LibraryFeedItem}
                                                    onPress={handleCloudItemPress}
                                                />
                                            </View>
                                        )}
                                        contentContainerStyle={styles.flatListContentContainer}
                                    />
                                )}
                            </View>
                        )}

                        {/* Aba 'Seguindo' da Cloud: Exibe artistas seguidos */}
                        {getSelectedSubTab('cloud') === 'seguindo' && (
                            <View style={styles.followedArtistsContainer}>
                                <Text style={styles.title}>Artistas Seguindo (Cloud)</Text>
                                {followedArtists.length === 0 ? (
                                    <View style={styles.tabContentTextContainer}>
                                        <Text style={styles.tabContentText}>Você não está seguindo nenhum artista.</Text>
                                    </View>
                                ) : (
                                    <FlatList
                                        data={followedArtists}
                                        keyExtractor={(item) => item.id}
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
                                    />
                                )}
                            </View>
                        )}
                    </>
                )}
                <View style={{ height: 110, }}></View>
            </ScrollView>

            <View style={styles.floatingBox}>
                <TouchableOpacity
                    style={[
                        styles.buttonPlayCloud,
                        isSelected(selectedLibraryContent, 'cloud') && styles.workButtonSelected,
                    ]}
                    onPress={() => setSelectedLibraryContent('cloud')}
                >
                    <Image
                        source={require('@/assets/images/4/icons8_sound_cloud_120px_1.png')}
                        style={{ width: 40, height: 40, marginBottom: -10 }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.buttonPlayLocal,
                        isSelected(selectedLibraryContent, 'local') && styles.workButtonSelected,
                    ]}
                    onPress={() => setSelectedLibraryContent('local')}
                >
                    <Image
                        source={require('@/assets/images/4/icons8_music_folder_120px.png')}
                        style={{ width: 40, height: 40, marginTop: -10 }}
                    />
                </TouchableOpacity>
            </View>
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
    title: {
        color: '#fff',
        marginLeft: 15,
        marginBottom: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    floatingBox: {
        position: 'absolute',
        bottom: 110,
        right: 20,
        backgroundColor: '#1e1e1e',
        borderRadius: 20,
        paddingVertical: 10,
        height: 100,
        width: 70,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
    },
    buttonPlayLocal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: -20,
    },
    buttonPlayCloud: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: -20,
    },
    workButtonSelected: {
        backgroundColor: '#7F7F7F',
    },
    text: {
        color: '#fff',
        fontSize: 16,
        margin: 20,
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
    cloudMusicListContainer: {
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
    flatListContentContainer: {
        paddingBottom: 20,
    },
    cardItemColumn: {
        width: '48%',
        marginBottom: 10,
    },
    followedArtistsContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    followedArtistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        marginBottom: 5,
    },
    followedArtistProfileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
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
});