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
import { useSelectedMusic, TypeMusic } from '@/hooks/useSelectedMusic';
import useSubTabSelectorLibrary, { TypeSubTab } from '@/hooks/useSubTabSelectorLibrary';
import LocalMusicScreen from '@/components/audioLocalComponent/useMusicLocalList';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { Track } from '@/src/redux/playerSlice';
import LibraryContentCard from '@/components/musicItems/LibraryItem/LibraryContentCard';
import { LibraryFeedItem, } from '@/src/types/contentType';
import { MOCKED_CLOUD_FEED_DATA } from '@/src/types/contentServer';
import { Ionicons } from '@expo/vector-icons';
// ✅ 1. Importa o hook de tradução
import { useTranslation } from '@/src/translations/useTranslation';


// Mapeamento das chaves da aba para o caminho do JSON de tradução
const tabTranslationKeys: Record<TypeSubTab, string> = {
    tudo: 'tabs.all',
    pastas: 'tabs.folders',
    downloads: 'tabs.downloads',
    feeds: 'tabs.feeds',
    curtidas: 'tabs.likes',
    seguindo: 'tabs.following',
};


const SubTabBar = ({
    tabs,
    group,
    isSelectedSubTab,
    selectSubTab,
    t, // ✅ 2. Recebe a função de tradução
}: {
    tabs: TypeSubTab[];
    group: 'local' | 'cloud';
    isSelectedSubTab: (group: 'local' | 'cloud', tab: TypeSubTab) => boolean;
    selectSubTab: (group: 'local' | 'cloud', tab: TypeSubTab) => void;
    t: (path: string) => string; // ✅ 2. Define o tipo para a função de tradução
}) => {
    // Mapeamento de ícones (permanece o mesmo)
    const iconMap: Record<TypeSubTab, keyof typeof Ionicons.glyphMap> = {
        tudo: 'musical-notes',
        pastas: 'folder',
        downloads: 'download',
        feeds: 'cloud',
        curtidas: 'heart',
        seguindo: 'people',
    };

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab}
                    style={[
                        styles.tabButton,
                        isSelectedSubTab(group, tab) && styles.activeTabButton,
                    ]}
                    onPress={() => selectSubTab(group, tab)}
                >
                    <View style={styles.tabContent}>
                        <Ionicons
                            name={iconMap[tab]}
                            size={18}
                            color={isSelectedSubTab(group, tab) ? '#fff' : '#aaa'}
                            style={{ marginRight: 6 }}
                        />
                        <Text
                            style={[
                                styles.tabText,
                                isSelectedSubTab(group, tab) && styles.activeTabText,
                            ]}
                        >
                            {/* ✅ 3. Usa a tradução da aba */}
                            {t(tabTranslationKeys[tab])}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default function LibraryScreen() {
    const router = useRouter();
    // ✅ 4. Inicializa o hook de tradução
    const { t } = useTranslation();

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
            music.category === 'single' && (
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

    // ... (Funções de navegação permanecem inalteradas)
    const handleCloudItemPress = (item: LibraryFeedItem) => {
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
            console.warn('Tipo de item desconhecido ou não suportado para navegação...', item.category);
        }
    };

    const handleNavigateToArtistProfile = (artistId: string) => {
        router.push(`/contentCardLibraryScreens/artist-profile/${artistId}`);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#191919' }}>

            <View style={styles.containerTopBar}>
                {/* ✅ 5. Traduz o título principal */}
                <Text style={styles.titleTopBar}>{t('screens.libraryTitle')}</Text>

                {/* Botão de pesquisa*/}
                <TouchableOpacity
                    onPress={() => router.push('/searchScreens/searchLibrary')}
                    style={styles.buttonTopBar}>
                    {/* Ícone de pesquisa*/}
                    <Ionicons
                        name='search-outline'
                        size={26}
                        color='#fff'
                    />
                </TouchableOpacity>
            </View>

            <View>
                {selectedLibraryContent === 'local' && (
                    <View style={{ paddingVertical: 15, }}>
                        <SubTabBar
                            tabs={localTabs}
                            group="local"
                            isSelectedSubTab={isSelectedSubTab}
                            selectSubTab={selectSubTab}
                            t={t} // ✅ 6. Passa a função 't' para o SubTabBar
                        />
                    </View>
                )}

                {selectedLibraryContent === 'cloud' && (
                    <View style={{ paddingVertical: 15, }}>
                        <SubTabBar
                            tabs={cloudTabs}
                            group="cloud"
                            isSelectedSubTab={isSelectedSubTab}
                            selectSubTab={selectSubTab}
                            t={t} // ✅ 6. Passa a função 't' para o SubTabBar
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
                        {getSelectedSubTab('local') === 'pastas' &&
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                {/* ✅ 7. Traduz a mensagem de indisponibilidade de Pastas */}
                                <Text style={styles.text}>{t('alerts.foldersUnavailable')}</Text>
                            </View>}
                        {getSelectedSubTab('local') === 'downloads' &&
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                {/* ✅ 7. Traduz a mensagem de indisponibilidade de Downloads */}
                                <Text style={styles.text}>{t('alerts.downloadsUnavailable')}</Text>
                            </View>}
                    </>
                )}

                {selectedLibraryContent === 'cloud' && (
                    <>
                        {/* Aba 'Feeds' da Cloud */}
                        {getSelectedSubTab('cloud') === 'feeds' && (
                            <View style={styles.cloudMusicListContainer}>
                                <FlatList
                                    data={MOCKED_CLOUD_FEED_DATA}
                                    keyExtractor={(item) => item.id}
                                    numColumns={2}
                                    columnWrapperStyle={styles.flatlistColun}
                                    renderItem={({ item }) => (
                                        <LibraryContentCard
                                            item={item}
                                            onPress={handleCloudItemPress}
                                        />
                                    )}
                                    contentContainerStyle={styles.flatListContentContainer}
                                    ListEmptyComponent={() => (
                                        <Text style={styles.emptyListText}>
                                            {/* ✅ 8. Traduz a mensagem de lista vazia do Feed */}
                                            {t('alerts.noCloudFeedContent')}
                                        </Text>
                                    )}
                                />
                            </View>
                        )}

                        {/* Aba 'Curtidas' da Cloud */}
                        {getSelectedSubTab('cloud') === 'curtidas' && (
                            <View style={styles.cloudMusicListContainer}>
                                {favoritedCloudTracks.length === 0 ? (
                                    <Text style={styles.emptyListText}>
                                        {/* ✅ 9. Traduz a mensagem de lista vazia de Curtidas */}
                                        {t('alerts.noLikedTracks')}
                                    </Text>
                                ) : (
                                    <FlatList
                                        data={favoritedCloudTracks}
                                        keyExtractor={(item) => item.id}
                                        numColumns={2}
                                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                                        renderItem={({ item }) => (
                                            <LibraryContentCard
                                                item={item as unknown as LibraryFeedItem}
                                                onPress={handleCloudItemPress}
                                            />
                                        )}
                                        contentContainerStyle={styles.flatListContentContainer}
                                    />
                                )}
                            </View>
                        )}

                        {/* Aba 'Seguindo' da Cloud */}
                        {getSelectedSubTab('cloud') === 'seguindo' && (
                            <View style={styles.followedArtistsContainer}>
                                {followedArtists.length === 0 ? (
                                    <View style={styles.tabContentTextContainer}>
                                        <Text style={styles.tabContentText}>
                                            {/* ✅ 10. Traduz a mensagem de lista vazia de Artistas Seguidos */}
                                            {t('alerts.noFollowedArtistsLibrary')}
                                        </Text>
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

            {/* Botões Locais/Cloud permanecem sem tradução de texto, pois são ícones/imagens */}
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
    followedArtistsContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    followedArtistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        //borderBottomWidth: 1,
        //borderBottomColor: '#333',
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

    containerTopBar: {
        backgroundColor: '#191919',      // Cor de fundo escura
        paddingVertical: 20,             // Espaçamento vertical (topo e baixo)
        paddingHorizontal: 16,           // Espaçamento lateral (esquerda e direita)
        borderBottomWidth: 1,            // Borda inferior com 1 pixel
        borderColor: '#191919',             // Cor da borda inferior (cinza escuro)
        flexDirection: 'row',            // Organiza os itens em linha (horizontal)
        //alignItems: 'center',            // Alinha verticalmente ao centro
    },
    // Estilo do botão (área clicável)
    buttonTopBar: {
        padding: 6,  // Espaçamento interno do botão
    },
    titleTopBar: {
        color: '#fff',
        fontSize: 20,
        //marginBottom: 8,
        flex: 1,
        //textAlign: 'center',
    },

    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatlistColun: {
        justifyContent: 'space-between',
    }
});