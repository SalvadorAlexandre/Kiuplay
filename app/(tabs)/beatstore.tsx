// app/(tabs)/beatstore.tsx
import React, { useEffect } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { RootState } from '@/src/redux/store';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import BeatStoreMusicItem from '@/components/musicItems/beatStoreItem/BeatStoreMusicItem';
//import { MOCKED_BEATSTORE_FEED_DATA } from '@/src/types/contentServer';
import { BeatStoreFeedItem, ExclusiveBeat, FreeBeat } from '@/src/types/contentType';
import { Ionicons } from '@expo/vector-icons';
import { getBeatStoreFeed } from '@/src/api/feedApi';
import { useTranslation } from '@/src/translations/useTranslation';
import { setActiveTab } from '@/src/redux/persistTabBeatStore';

export default function BeatStoreScreen() {

    const router = useRouter();
    const { t } = useTranslation(); // Usa o hook customizado de tradução
    const dispatch = useAppDispatch();
    const favoritedMusics = useAppSelector((state) => state.favoriteMusic.musics);
    const followedArtists = useAppSelector((state: RootState) => state.followedArtists.artists);
    const activeTab = useAppSelector((state) => state.beatstore.activeTab);
    const [feedData, setFeedData] = React.useState<BeatStoreFeedItem[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);
    const [page, setPage] = React.useState<number>(1);
    const [hasMore, setHasMore] = React.useState<boolean>(true); // se ainda tem mais páginas

    const fetchFeed = async (pageToLoad = 1) => {
        if (!hasMore && pageToLoad !== 1) return;

        setLoading(true);
        try {
            const { data, total } = await getBeatStoreFeed(pageToLoad, 20);
            setFeedData(prev => pageToLoad === 1 ? data : [...prev, ...data]);
            // Verifica se ainda há mais páginas
            if ((pageToLoad * 20) >= total) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
        } catch (err) {
            console.error("Erro ao carregar feed:", err);
            setError("Falha ao carregar os beats.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Só dispara a busca se estivermos na aba 'feeds' e ainda não houver dados
        if (activeTab === 'feeds' && feedData.length === 0) {
            fetchFeed(1);
        }
    }, [activeTab]); // Detecta quando o usuário troca de aba

    const handleTabChange = (tab: 'feeds' | 'curtidas' | 'seguindo') => {
        dispatch(setActiveTab(tab));
    };
    //const { activeTab, handleTabChange } = useBeatStoreTabs();

    // O filtro aqui já funciona, pois FavoritedMusic estende Track, que por sua vez inclui ExclusiveBeat e FreeBeat
    const favoritedBeatStoreMusics: (ExclusiveBeat | FreeBeat)[] = favoritedMusics.filter(
        (music) =>
            music.category === 'beat' && ( // Adicionado filtro por categoria 'beat'
                music.source === 'beatstore-favorites' ||
                music.source === 'beatstore-feeds'
            )
    ) as (ExclusiveBeat | FreeBeat)[]; // Casting para o tipo correto

    const filteredFavoritedBeats = favoritedBeatStoreMusics;

    const handleBeatStoreItemPress = (item: BeatStoreFeedItem) => {
        // Certifica-se de que a música a ser reproduzida é do tipo Track, que é o que o playerSlice espera
        if (item.typeUse === 'free') {
            router.push(`/contentCardBeatStoreScreens/freeBeat-details/${item.id}`);
        } else if (item.typeUse === 'exclusive') {
            router.push(`/contentCardBeatStoreScreens/exclusiveBeat-details/${item.id}`);
        } else {
            console.warn('Tipo de item desconhecido ou não suportado para navegação...');
        }
    };

    const handleNavigateToArtistProfile = (artistId: string) => {
        router.push(`/contentCardLibraryScreens/artist-profile/${artistId}`);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#191919' }}>

            {/**TopBar customizada */}
            <View style={styles.containerTopBar}>
                <Text style={styles.titleTopBar}>{t('screens.beatStoreTitle')}</Text>

                {/* Botão de pesquisa */}
                <TouchableOpacity
                    onPress={() => router.push(`/searchScreens/searchBeatStore`)}
                    style={styles.button}>
                    <Ionicons
                        name='search-outline'
                        size={26}
                        color='#fff'
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.tabsContainer}>
                {[
                    { key: 'feeds', label: t('tabs.feeds'), icon: 'musical-notes' },
                    { key: 'curtidas', label: t('tabs.likes'), icon: 'heart' },
                    { key: 'seguindo', label: t('tabs.following'), icon: 'people' },
                ].map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => handleTabChange(tab.key as 'feeds' | 'curtidas' | 'seguindo')}
                        style={[
                            styles.tabButton,
                            activeTab === tab.key && styles.activeTabButton,
                        ]}
                    >
                        <View style={styles.tabContent}>
                            <Ionicons
                                name={tab.icon as any}
                                size={18}
                                color={activeTab === tab.key ? '#fff' : '#aaa'}
                                style={{ marginRight: 6 }}
                            />
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab.key && styles.activeTabText,
                                ]}
                            >
                                {tab.label}
                            </Text>
                        </View>
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
                        {/* Spinner para o carregamento inicial */}
                        {loading && page === 1 ? (
                            <ActivityIndicator
                                size="large"
                                color="#FFD700"
                                style={{ marginTop: 50 }}
                            />
                        ) : (
                            <FlatList
                                data={feedData}
                                keyExtractor={(item) => item.id}
                                numColumns={2}
                                columnWrapperStyle={styles.row}
                                renderItem={({ item }) => (
                                    <BeatStoreMusicItem item={item} onPress={handleBeatStoreItemPress} />
                                )}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                ListEmptyComponent={() => (
                                    <Text style={styles.emptyListText}>
                                        {error ? error : t('alerts.noBeatsInFeed')}
                                    </Text>
                                )}
                                onEndReached={() => {
                                    if (hasMore && !loading) {
                                        const nextPage = page + 1;
                                        setPage(nextPage);
                                        fetchFeed(nextPage);
                                    }
                                }}
                                onEndReachedThreshold={0.5}
                                // Mostra um spinner menor no final da lista enquanto carrega mais páginas
                                ListFooterComponent={() =>
                                    loading && page > 1 ? <ActivityIndicator size="small" color="#fff" /> : null
                                }
                            />
                        )}
                    </View>
                )}

                {activeTab === 'curtidas' && (
                    <View style={styles.favoritedMusicListContainer}>
                        {favoritedBeatStoreMusics.length === 0 ? (
                            <Text style={styles.emptyListText}>
                                {t('alerts.noLikedBeats')}
                            </Text>
                        ) : (
                            <FlatList

                                data={filteredFavoritedBeats}
                                keyExtractor={(item) => item.id}
                                numColumns={2}
                                columnWrapperStyle={styles.row}
                                renderItem={({ item }) => (
                                    <BeatStoreMusicItem
                                        item={item}
                                        onPress={handleBeatStoreItemPress}
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
                                <Text style={styles.tabContentText}>
                                    {t('alerts.noFollowedArtists')}
                                </Text>
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.followedArtistItem}
                                onPress={() => handleNavigateToArtistProfile(item.id)}
                            >
                                <Image
                                    source={
                                        item.profileImageUrl
                                            ? { uri: item.profileImageUrl }
                                            : require('@/assets/images/Default_Profile_Icon/unknown_artist.png')
                                    }
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
        //marginLeft: 10,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',

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
        paddingHorizontal: 10,
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
        //flex: 1,
        justifyContent: 'space-between',
        //marginBottom: 8,
    },
    followedArtistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        //borderBottomWidth: 1,
        //borderBottomColor: '#333',
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
    },

    //Estilo do topbar
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
    button: {
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
});