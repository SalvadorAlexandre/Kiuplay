// app/(tabs)/library.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { RootState } from '@/src/redux/store';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { Track } from '@/src/redux/playerSlice';
import LibraryContentCard from '@/components/musicItems/LibraryItem/LibraryContentCard';
import { LibraryFeedItem, } from '@/src/types/contentType';
import { Ionicons } from '@expo/vector-icons';
import { getLibraryFeed } from '@/src/api/feedApi';
import { useTranslation } from '@/src/translations/useTranslation';


const LibraryHeader = ({ t, router }: { t: any, router: any }) => {
    return (
        <View style={headerStyles.containerTopBar}>

            <Text
                style={headerStyles.titleTopBar}
                numberOfLines={1}
            >
                {t('screens.libraryTitle')}
            </Text>

            {/**BTN DE PLAYLIST*/}
            <TouchableOpacity
                onPress={() => router.push('/audioLocalComponent/useMusicLocalList')}
                style={headerStyles.buttonTopBar}
            >
                <Ionicons name='menu' size={26} color='#fff' />
            </TouchableOpacity>

            {/**BTN DE CURTIDOS*/}
            <TouchableOpacity
                onPress={() => router.push('/favoriteScreens/libraryFavoritesScreens')}
                style={headerStyles.buttonTopBar}
            >
                <Ionicons name='heart-outline' size={26} color='#fff' />
            </TouchableOpacity>

            {/**BTN DE PESQUISAR*/}
            <TouchableOpacity
                onPress={() => router.push('/searchScreens/searchLibrary')}
                style={headerStyles.buttonTopBar}
            >
                <Ionicons name='search-outline' size={26} color='#fff' />
            </TouchableOpacity>
        </View>
    );
};

// Estilos para os itens da FlatList
const headerStyles = StyleSheet.create({
    containerTopBar: {
        backgroundColor: '#191919',      // Cor de fundo escura
        paddingVertical: 20,             // Espaçamento vertical (topo e baixo)
        paddingHorizontal: 16,           // Espaçamento lateral (esquerda e direita)
        borderBottomWidth: 1,            // Borda inferior com 1 pixel
        borderColor: '#191919',             // Cor da borda inferior (cinza escuro)
        flexDirection: 'row',            // Organiza os itens em linha (horizontal)
        gap: 10,
    },
    titleTopBar: {
        color: '#fff',
        fontSize: 20,
        //marginBottom: 8,
        flex: 1,
        //textAlign: 'center',
    },
    buttonTopBar: {
        padding: 6,  // Espaçamento interno do botão
    },

});

export default function LibraryScreen() {

    const router = useRouter();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const selectedLocalTab = useAppSelector(state => state.library.selectedLocalTab);
    const selectedCloudTab = useAppSelector(state => state.library.selectedCloudTab);
    //const favoritedMusics = useAppSelector((state) => state.favoriteMusic.musics);
    const followedArtists = useAppSelector((state: RootState) => state.followedArtists.artists);
    const selectedLibraryContent = useAppSelector((state) => state.library.selectedLibraryContent);

    // 1. Estados para armazenar os dados e o status da conexão
    const [feeds, setFeeds] = useState<LibraryFeedItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    // const favoritedCloudTracks: Track[] = favoritedMusics.filter(
    //    (music) =>
    //        music.category === 'single' && (
    //            music.source === 'library-cloud-feeds' ||
    //            music.source === 'library-cloud-favorites' ||
    //            music.source === 'library-local'
    //        )
    // ) as Track[];

    // ... (Funções de navegação permanecem inalteradas)
    //const handleCloudItemPress = (item: LibraryFeedItem) => {
    //   if (item.category === 'single') {
    //    router.push(`/contentCardLibraryScreens/single-details/${item.id}`);
    //  } else if (item.category === 'album') {
    //      router.push(`/contentCardLibraryScreens/album-details/${item.id}`);
    //  } else if (item.category === 'ep') {
    //      router.push(`/contentCardLibraryScreens/ep-details/${item.id}`);
    //  } else if (item.category === 'artist') {
    //      router.push(`/contentCardLibraryScreens/artist-profile/${item.id}`);
    //  }
    //  else {
    //    console.warn('Tipo de item desconhecido ou não suportado para navegação...', item.category);
    //}
    //  };

    const handleCloudItemPress = useCallback((item: LibraryFeedItem) => {
        // Mapeamento de rotas baseado na categoria que vem do Backend
        const routes = {
            single: `/contentCardLibraryScreens/single-details/${item.id}`,
            album: `/contentCardLibraryScreens/album-details/${item.id}`,
            ep: `/contentCardLibraryScreens/ep-details/${item.id}`,
            artist: `/contentCardLibraryScreens/artist-profile/${item.id}`,
        };

        const targetRoute = routes[item.category as keyof typeof routes];

        if (targetRoute) {
            router.push(targetRoute as any);
        } else {
            console.warn(
                `[Library] Categoria desconhecida: "${item.category}" para o item ID: ${item.id}. 
            Verifique se o Backend está enviando 'single', 'album', 'ep' ou 'artist'.`
            );
        }
    }, [router]);

    const loadFeeds = async (pageToLoad = 1) => {
        // Se já estiver a carregar ou se não houver mais páginas (e não for reset), paramos aqui
        if (isLoading || (!hasMore && pageToLoad !== 1)) return;

        try {
            setIsLoading(true);
            setError(null); // Limpamos erros anteriores ao iniciar nova tentativa

            const response = await getLibraryFeed(pageToLoad, 20);

            if (response.success) {
                // Se for página 1, substituímos. Se for página > 1, concatenamos.
                setFeeds(prev => pageToLoad === 1 ? response.data : [...prev, ...response.data]);

                // Lógica de paginação baseada no total de páginas retornado pelo backend
                const isLastPage = pageToLoad >= response.totalPages || response.data.length < 20;
                setHasMore(!isLastPage);
            } else {
                // Se o backend responder success: false, capturamos a mensagem
                setError(response.error || t('alerts.errorLoadingLibrary'));
                setHasMore(false);
            }
        } catch (err) {
            console.error("Erro crítico no loadFeeds:", err);
            setError(t('alerts.connectionError'));
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Dispara o carregamento inicial apenas se a lista estiver vazia
        if (feeds.length === 0 && !isLoading && !error) {
            loadFeeds(1);
        }
    }, []);

    const handleRetry = useCallback(() => {
        setError(null);
        setFeeds([]);
        setPage(1);
        setHasMore(true);
        loadFeeds(1);
    }, []);


    const renderHeader = useCallback(() => (
        <LibraryHeader t={t} router={router} />
    ), [t, router]);

    return (
        <View style={styles.mainContainer}>

            {isLoading && page === 1 ? (
                <ActivityIndicator size="large" color="#fff" style={styles.centerLoader} />
            ) : (
                <FlatList
                    data={feeds}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.flatlistColumn}
                    ListHeaderComponent={renderHeader}
                    stickyHeaderIndices={[0]} // Opcional: mantém o header fixo no topo
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <LibraryContentCard
                            item={item}
                            onPress={handleCloudItemPress}
                        />
                    )}
                    ListEmptyComponent={() => {
                        // Se estiver a carregar a primeira página, não mostramos a mensagem de vazio
                        if (isLoading && page === 1) return null;
                        return (
                            <View style={styles.emptyContainer}>
                                <Ionicons
                                    name={error ? "cloud-offline-outline" : "search-outline"}
                                    size={64}
                                    color="rgba(255, 255, 255, 0.3)"
                                />
                                <Text style={styles.emptyText}>
                                    {error ? t('alerts.noCloudFeedContent') : error}
                                </Text>

                                <TouchableOpacity
                                    style={styles.retryButton}
                                    onPress={handleRetry}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="refresh" size={18} color="#fff" style={{ marginRight: 8 }} />
                                    <Text style={styles.retryButtonText}>
                                        {t('common.retry')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                    onEndReached={() => {
                        if (hasMore && !isLoading) {
                            const nextPage = page + 1;
                            setPage(nextPage);
                            loadFeeds(nextPage); // Chamada direta corrigida
                        }
                    }}
                    onEndReachedThreshold={0.3} // 0.3 costuma ser mais fluido que 0.5
                    removeClippedSubviews={true} // Melhora performance de memória
                    ListFooterComponent={() =>
                        isLoading && page > 1 ? (
                            <View style={{ paddingVertical: 20 }}>
                                <ActivityIndicator size="small" color="#fff" />
                            </View>
                        ) : <View style={{ height: 100 }} /> // Espaço extra no final para não cobrir o último card
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#191919',
    },
    flatlistColumn: {
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    centerLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        color: '#bbb',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 20,
        lineHeight: 22,
    },
    retryButton: {
        flexDirection: 'row',
        backgroundColor: '#333', // Cor neutra para o modo escuro
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444',
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
});