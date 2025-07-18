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
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router'; // NOVO: Importe useRouter

import TopTabBarLibrary from '@/components/topTabBarLibraryScreen';
import { useSelectedMusic, TypeMusic } from '@/hooks/useSelectedMusic';
import useSubTabSelectorLibrary, { TypeSubTab } from '@/hooks/useSubTabSelectorLibrary';
import LocalMusicScreen from '@/components/audioLocalComponent/useMusicLocalList';

import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { Track } from '@/src/redux/playerSlice'; // Mantém Track para o tipo favoritedMusics
// REMOVIDO: playTrackThunk, setPlaylistAndPlayThunk não são mais chamados diretamente aqui
// import { playTrackThunk, setPlaylistAndPlayThunk } from '@/src/redux/playerSlice';
// REMOVIDO: addFavoriteMusic, removeFavoriteMusic não são mais chamados diretamente aqui
// import { addFavoriteMusic, removeFavoriteMusic } from '@/src/redux/favoriteMusicSlice';

// NOVO: Importe o componente renomeado e os novos tipos
import LibraryContentCard from '@/components/musicItems/LibraryItem/LibraryContentCard'; // Caminho ajustado
import { LibraryFeedItem, AlbumOrEP, ArtistProfile, Playlist } from '@/src/types/library';

// ---
// NOVO: Dados mockados para as abas da Cloud (Feeds, Curtidas, Seguindo)
// Estes dados agora incluem diferentes tipos de conteúdo
const MOCKED_CLOUD_FEED_DATA: LibraryFeedItem[] = [
    {
        id: 'single-1',
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        title: 'Vibe Urbana',
        artist: 'BeatMaster',
        cover: 'https://placehold.co/300x300/FF6347/FFFFFF?text=Single+Vibe',
        artistAvatar: 'https://i.pravatar.cc/150?img=6',
        source: 'library-cloud-feeds',
        duration: 180000,
        type: 'single',
    },
    {
        id: 'album-1',
        title: 'Retrospectiva Jazz',
        artist: 'Jazz Collective',
        cover: 'https://placehold.co/300x300/4682B4/FFFFFF?text=Album+Jazz',
        type: 'album',
        releaseDate: '2023-11-15',
    } as AlbumOrEP, // Cast para o tipo correto
    {
        id: 'artist-1',
        name: 'Mestre da Batida',
        avatar: 'https://i.pravatar.cc/150?img=7',
        type: 'artist',
        genres: ['Hip Hop', 'Trap'],
    } as ArtistProfile, // Cast para o tipo correto
    {
        id: 'ep-1',
        title: 'Sons do Verão',
        artist: 'Tropical Vibes',
        cover: 'https://placehold.co/300x300/32CD32/FFFFFF?text=EP+Ver%C3%A3o',
        type: 'ep',
        releaseDate: '2024-06-20',
    } as AlbumOrEP, // Cast para o tipo correto
    {
        id: 'playlist-1',
        name: 'Chill & Study',
        creator: 'Kiuplay Curator',
        cover: 'https://placehold.co/300x300/DAA520/000000?text=Playlist+Chill',
        type: 'playlist',
        description: 'Músicas perfeitas para focar e relaxar.',
    } as Playlist, // Cast para o tipo correto
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
    },
    {
        id: 'album-2',
        title: 'O Despertar',
        artist: 'Aura Sonora',
        cover: 'https://placehold.co/300x300/CD5C5C/FFFFFF?text=Album+Aura',
        type: 'album',
        releaseDate: '2024-02-01',
    } as AlbumOrEP,
    {
        id: 'artist-2',
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
    } as AlbumOrEP,
    {
        id: 'playlist-2',
        name: 'Workout Power',
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
    const router = useRouter(); // NOVO: Inicializa o router
    const dispatch = useAppDispatch();
    const { selectedLibraryContent, setSelectedLibraryContent } = useSelectedMusic();
    const {
        isSelectedSubTab,
        selectSubTab,
        getSelectedSubTab,
    } = useSubTabSelectorLibrary();

    const favoritedMusics = useAppSelector((state) => state.favoriteMusic.musics);
    // REMOVIDO: currentTrack, currentIndex, playlist não são mais usados diretamente aqui
    // const { currentTrack, currentIndex, playlist } = useAppSelector((state) => state.player);


    // NOVO: Filtrar músicas favoritas que são do tipo Track (single) e de Cloud para a aba "Curtidas"
    // Os outros tipos de conteúdo (Album, Artist, Playlist) não têm a noção de "favorito" da mesma forma que Track (single)
    const favoritedCloudTracks: Track[] = favoritedMusics.filter(
        (music) =>
            music.type === 'single' && (
                music.source === 'library-cloud-feeds' ||
                music.source === 'library-cloud-curtidas' ||
                music.source === 'library-cloud-seguindo'
            )
    ) as Track[]; // Cast para garantir que o tipo é Track[]

    // REMOVIDO: handleToggleFavorite e handlePlayMusic não são mais passados para os cards da Cloud
    /*
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
    */

    const isSelected = (current: TypeMusic, type: TypeMusic): boolean => {
        return current === type;
    };

    const localTabs: TypeSubTab[] = ['tudo', 'pastas', 'downloads'];
    const cloudTabs: TypeSubTab[] = ['feeds', 'curtidas', 'seguindo'];

    // NOVO: Função para lidar com o clique em qualquer item do feed da Cloud
    // NOVO: Função para lidar com o clique em qualquer item do feed da Cloud
    const handleCloudItemPress = (item: LibraryFeedItem) => {
        // Exemplo de navegação baseada no tipo de item
        if (item.type === 'single') {
            // ALTERADO: Removido '[id]' da string do caminho
            router.push(`/contentCardLibraryScreens/single-details/${item.id}`);
        } else if (item.type === 'album') {
            // ALTERADO: Removido '[id]' da string do caminho
            router.push(`/contentCardLibraryScreens/album-details/${item.id}`);
        } else if (item.type === 'ep') {
            // ALTERADO: Removido '[id]' e o '/' adicional da string do caminho
            router.push(`/contentCardLibraryScreens/ep-details/${item.id}`);
        } else if (item.type === 'artist') {
            // ALTERADO: Removido '[id]' da string do caminho
            router.push(`/contentCardLibraryScreens/artist-profile/${item.id}`);
        } else if (item.type === 'playlist') {
            // ALTERADO: Removido '[id]' da string do caminho
            router.push(`/contentCardLibraryScreens/playlist-details/${item.id}`);
        } else {
            console.warn('Tipo de item desconhecido:', item.type);
            // Opcional: navegar para uma tela de erro ou padrão
        }
        // Futuramente, você pode adicionar a lógica de "play" aqui para singles/álbuns/EPs
        // que começam a tocar automaticamente ao serem clicados.
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
                                <Text style={styles.title}>Feeds da Cloud</Text>
                                <FlatList
                                    data={MOCKED_CLOUD_FEED_DATA} // Usa a lista genérica de feed
                                    keyExtractor={(item) => item.id}
                                    numColumns={2}
                                    columnWrapperStyle={styles.row}
                                    renderItem={({ item }) => (
                                        <View style={styles.cloudItemColumn}>
                                            <LibraryContentCard // Usa o novo componente genérico
                                                item={item} // Passa o item completo
                                                onPress={handleCloudItemPress} // Passa a função de navegação
                                            />
                                        </View>
                                    )}
                                    contentContainerStyle={{ paddingBottom: 20 }}
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
                                        columnWrapperStyle={styles.row}
                                        renderItem={({ item }) => (
                                            <View style={styles.cloudItemColumn}>
                                                {/* Aqui, como a lista é de 'Track' (singles),
                                                    usamos LibraryContentCard e ele saberá como renderizar o "single".
                                                */}
                                                <LibraryContentCard
                                                    item={item}
                                                    onPress={handleCloudItemPress}
                                                />
                                            </View>
                                        )}
                                        contentContainerStyle={{ paddingBottom: 20 }}
                                    />
                                )}
                            </View>
                        )}

                        {/* Aba 'Seguindo' da Cloud: Exibe conteúdos de artistas seguidos (mix de tipos ou apenas músicas) */}
                        {getSelectedSubTab('cloud') === 'seguindo' && (
                            <View style={styles.cloudMusicListContainer}>
                                <Text style={styles.title}>Conteúdo de Artistas Seguindo (Cloud)</Text>
                                {/* Para esta aba, podemos usar um filtro dos MOCKED_CLOUD_FEED_DATA
                                    para simular conteúdo de artistas seguidos.
                                    Na vida real, você teria dados específicos.
                                */}
                                {MOCKED_CLOUD_FEED_DATA.filter(item =>
                                    item.type === 'artist' && item.id === 'artist-1' || // Exemplo: Artista com ID 'artist-1'
                                    item.type === 'single' && (item as Track).source === 'library-cloud-seguindo' // Exemplo: Singles com source 'seguindo'
                                ).length === 0 ? (
                                    <Text style={styles.emptyListText}>Nenhum conteúdo de artista seguido na cloud.</Text>
                                ) : (
                                    <FlatList
                                        data={MOCKED_CLOUD_FEED_DATA.filter(item =>
                                            item.type === 'artist' && item.id === 'artist-1' ||
                                            item.type === 'single' && (item as Track).source === 'library-cloud-seguindo'
                                        )}
                                        keyExtractor={(item) => item.id}
                                        numColumns={2}
                                        columnWrapperStyle={styles.row}
                                        renderItem={({ item }) => (
                                            <View style={styles.cloudItemColumn}>
                                                <LibraryContentCard
                                                    item={item}
                                                    onPress={handleCloudItemPress}
                                                />
                                            </View>
                                        )}
                                        contentContainerStyle={{ paddingBottom: 20 }}
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
        marginTop: 20, // Revertido para 20 para consistência, ou ajuste conforme preferir
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
    },
    emptyListText: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 30,
        fontSize: 15,
        marginHorizontal: 20,
    },
    row: {
        flex: 1,
        justifyContent: 'space-around',
        marginHorizontal: 10,
        marginBottom: 8,
    },
    cloudItemColumn: {
        width: '48%',
    },
});