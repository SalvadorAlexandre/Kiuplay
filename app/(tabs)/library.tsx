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
import { useSelector } from 'react-redux'; // NOVO: Importa useSelector
import { RootState } from '@/src/redux/store'; // NOVO: Importa RootState para tipagem

import TopTabBarLibrary from '@/components/topTabBarLibraryScreen';
import { useSelectedMusic, TypeMusic } from '@/hooks/useSelectedMusic';
import useSubTabSelectorLibrary, { TypeSubTab } from '@/hooks/useSubTabSelectorLibrary';
import LocalMusicScreen from '@/components/audioLocalComponent/useMusicLocalList';

import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { Track } from '@/src/redux/playerSlice';
import LibraryContentCard from '@/components/musicItems/LibraryItem/LibraryContentCard';
import { LibraryFeedItem, AlbumOrEP, ArtistProfile, Playlist, Single } from '@/src/types/library';

// ---
// Dados mockados (MOCKED_CLOUD_FEED_DATA) - Mantenha como está.
export const MOCKED_CLOUD_FEED_DATA: LibraryFeedItem[] = [
    {
        id: 'single-1',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        title: 'Vibe Urbana',
        artist: 'BeatMaster',
        cover: '',
        artistAvatar: 'https://i.pravatar.cc/150?img=6',
        source: 'library-cloud-feeds',
        duration: 180000,
        type: 'single',
        genre: 'Hip Hop',
        viewsNumber: 271,
    } as Single,
    {
        id: 'album-1',
        title: 'Retrospectiva Jazz',
        artist: 'Jazz Collective',
        cover: 'https://placehold.co/300x300/4682B4/FFFFFF?text=Album+Jazz',
        type: 'album',
        releaseDate: '2023-11-15',
        genre: 'Jazz',
    } as AlbumOrEP,
    {
        id: 'artist-1',
        name: 'Mestre da Batida',
        avatar: 'https://i.pravatar.cc/150?img=7',
        type: 'artist',
        genres: ['Hip Hop', 'Trap'],
    } as ArtistProfile,
    {
        id: 'ep-1',
        title: 'Sons do Verão',
        artist: 'Tropical Vibes',
        cover: 'https://placehold.co/300x300/32CD32/FFFFFF?text=EP+Ver%C3%A3o',
        type: 'ep',
        releaseDate: '2024-06-20',
        genre: 'Reggaeton',
    } as AlbumOrEP,
    {
        id: 'playlist-1',
        name: 'Chill & Study',
        creator: 'Kiuplay Curator',
        cover: 'https://placehold.co/300x300/DAA520/000000?text=Playlist+Chill',
        type: 'playlist',
        description: 'Músicas perfeitas para focar e relaxar.',
    } as Playlist,
    {
        id: 'single-2',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        title: 'Caminhos do Soul',
        artist: 'Soulful Echoes',
        cover: 'https://placehold.co/300x300/8A2BE2/FFFFFF?text=Single+Soul',
        artistAvatar: 'https://i.pravatar.cc/150?img=8',
        source: 'library-cloud-feeds',
        duration: 210000,
        type: 'single',
        genre: 'Soul',
        viewsNumber: 1000,
    } as Single,
    {
        id: 'artist-2',
        name: 'EveryDay',
        avatar: 'https://i.pravatar.cc/150?img=7',
        type: 'artist',
        genres: ['Hip Hop', 'Trap'],
    } as ArtistProfile,
    {
        id: 'album-2',
        title: 'O Despertar',
        artist: 'Aura Sonora',
        cover: 'https://placehold.co/300x300/CD5C5C/FFFFFF?text=Album+Aura',
        type: 'album',
        releaseDate: '2024-02-01',
        genre: 'Ambient',
    } as AlbumOrEP,
    {
        id: 'artist-3',
        name: 'Helloby',
        avatar: 'https://i.pravatar.cc/150?img=7',
        type: 'artist',
        genres: ['Zouck', 'Trap'],
    } as ArtistProfile,
    // Note: 'artist-2' está duplicado nos mockups originais, corrigi um dos IDs para 'artist-4'
    {
        id: 'artist-4', // Alterado de 'artist-2' para 'artist-4' para evitar duplicidade de ID
        name: 'Rainha do R&B',
        avatar: 'https://i.pravatar.cc/150?img=9',
        type: 'artist',
        genres: ['R&B', 'Pop'],
    } as ArtistProfile,
    {
        id: 'ep-2',
        title: 'Reflexões Noturnas',
        artist: 'Dreamweaver',
        cover: 'https://placehold.co/300x300/6A5ACD/FFFFFF?text=EP+Night',
        type: 'ep',
        releaseDate: '2023-09-01',
        genre: 'Eletrônica',
    } as AlbumOrEP,
    {
        id: 'playlist-2',
        name: 'Workout Power',
        creator: 'Fitness Guru',
        cover: 'https://placehold.co/300x300/FF1493/FFFFFF?text=Playlist+Gym',
        type: 'playlist',
        description: 'Energia máxima para seus treinos.',
    } as Playlist,
    {
        id: 'playlist-3',
        name: 'Workout Power',
        creator: 'Saag SWB',
        cover: 'https://placehold.co/300x300/FF1493/FFFFFF?text=Playlist+Gym',
        type: 'playlist',
        description: 'Energia máxima para seus treinos.',
    } as Playlist,
    {
        id: 'playlist-4',
        name: 'Feito para salvador',
        creator: 'Fitness Guru',
        cover: 'https://placehold.co/300x300/FF1493/FFFFFF?text=Playlist+Gym',
        type: 'playlist',
        description: 'Energia máxima para seus treinos.',
    } as Playlist,
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
    const dispatch = useAppDispatch(); // Mantido caso precise de dispatch no futuro
    const { selectedLibraryContent, setSelectedLibraryContent } = useSelectedMusic();
    const {
        isSelectedSubTab,
        selectSubTab,
        getSelectedSubTab,
    } = useSubTabSelectorLibrary();

    const favoritedMusics = useAppSelector((state) => state.favoriteMusic.musics);
    // NOVO: Obtém a lista de artistas seguidos do Redux
    const followedArtists = useSelector((state: RootState) => state.followedArtists.artists);

    const favoritedCloudTracks: Track[] = favoritedMusics.filter(
        (music) =>
            music.type === 'single' && (
                music.source === 'library-cloud-feeds' ||
                music.source === 'library-cloud-curtidas' ||
                music.source === 'library-cloud-seguindo'
            )
    ) as Track[];

    const isSelected = (current: TypeMusic, type: TypeMusic): boolean => {
        return current === type;
    };

    const localTabs: TypeSubTab[] = ['tudo', 'pastas', 'downloads'];
    const cloudTabs: TypeSubTab[] = ['feeds', 'curtidas', 'seguindo'];

    const handleCloudItemPress = (item: LibraryFeedItem) => {
        if (item.type === 'single') {
            router.push(`/contentCardLibraryScreens/single-details/${item.id}`);
        } else if (item.type === 'album') {
            router.push(`/contentCardLibraryScreens/album-details/${item.id}`);
        } else if (item.type === 'ep') {
            router.push(`/contentCardLibraryScreens/ep-details/${item.id}`);
        } else if (item.type === 'artist') {
            router.push(`/contentCardLibraryScreens/artist-profile/${item.id}`);
        } else if (item.type === 'playlist') {
            router.push(`/contentCardLibraryScreens/playlist-details/${item.id}`);
        } else {
            console.warn('Tipo de item desconhecido:', item.type);
        }
    };

    // NOVO: Função para navegar para a tela do perfil do artista (igual à de BeatStoreScreen)
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
                                                <LibraryContentCard
                                                    item={item}
                                                    onPress={handleCloudItemPress}
                                                />
                                            </View>
                                        )}
                                        contentContainerStyle={styles.flatListContentContainer}
                                    />
                                )}
                            </View>
                        )}

                        {/* NOVO: Aba 'Seguindo' da Cloud: Exibe artistas seguidos */}
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
        paddingHorizontal: 10, // Adicionado padding horizontal aqui para as FlatLists de conteúdo
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
        width: '48%', // Ajustado para 48% para permitir o `space-between` no `columnWrapperStyle`
        marginBottom: 10, // Adicionado margem inferior para espaçamento entre as linhas de cards
    },
    // NOVO: Estilos para a lista de artistas seguidos
    followedArtistsContainer: {
        flex: 1,
        paddingHorizontal: 10, // Adicionado padding horizontal aqui para a FlatList de artistas
    },
    followedArtistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        marginBottom: 5, // Espaçamento entre os itens de artista
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