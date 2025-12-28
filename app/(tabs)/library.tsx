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
import {
    SingleCard,
    AlbumCard,
    EpCard,
    ArtistCard,
} from '@/components/cardsItems';
import {
    Single,
    Album,
    ExtendedPlayEP,
    ArtistProfile,
    LibraryFeedItem
} from '@/src/types/contentType';
import { LibraryHeader } from '@/components/navigation'
import { Ionicons } from '@expo/vector-icons';
import { getLibraryFeed } from '@/src/api/feedApi';
import { useTranslation } from '@/src/translations/useTranslation';
import { feedStyles as styles } from '@/components/navigation';
import { EmptyState } from '@/components/ListEmptyComponent';

export default function LibraryScreen() {

    const router = useRouter();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    // 1. Estados para armazenar os dados e o status da conexão
    const [feeds, setFeeds] = useState<LibraryFeedItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const handleCloudItemPress = useCallback((item: LibraryFeedItem) => {
        // Mapeamento de rotas baseado na categoria que vem do Backend
        const routes = {
            single: `/detailsLibraryScreens/single-details/${item.id}`,
            album: `/detailsLibraryScreens/album-details/${item.id}`,
            ep: `/detailsLibraryScreens/ep-details/${item.id}`,
            artist: `/detailsLibraryScreens/artist-profile/${item.id}`,
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
        // 1. Guardas de execução
        if (isLoading || (!hasMore && pageToLoad !== 1)) return;

        setIsLoading(true);
        setError(null);

        // 2. Chamada direta (A API já garante o retorno do objeto, mesmo em erro)
        const response = await getLibraryFeed(pageToLoad, 20);

        if (response.success) {
            // Sucesso: Atualiza lista
            setFeeds(prev => pageToLoad === 1 ? response.data : [...prev, ...response.data]);

            // Lógica de paginação
            const isLastPage = pageToLoad >= response.totalPages || response.data.length === 0;
            setHasMore(!isLastPage);
        } else {
            // Erro Amigável: A API já nos dá o texto do erro ou usamos o padrão do i18n
            setError(t('alerts.errorLoadingLibrary'));
            setHasMore(false);
        }

        setIsLoading(false);
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
                    // RENDERIZAÇÃO DINÂMICA
                    renderItem={({ item }: { item: LibraryFeedItem }) => {
                        switch (item.category) {
                            case 'single':
                                return <SingleCard item={item as Single} onPress={handleCloudItemPress} />;

                            case 'album':
                                return <AlbumCard item={item as Album} onPress={handleCloudItemPress} />;

                            case 'ep':
                                return <EpCard item={item as ExtendedPlayEP} onPress={handleCloudItemPress} />;

                            case 'artist':
                                return <ArtistCard item={item as ArtistProfile} onPress={handleCloudItemPress} />;

                            default:
                                // Fallback para caso surja um tipo novo não mapeado
                                return null;
                        }
                    }}
                    ListEmptyComponent={() => {
                        // Se estiver a carregar a primeira página, não mostramos a mensagem de vazio
                        if (isLoading && page === 1) return null;
                        return (
                            <EmptyState
                                icon={error ? 'file-tray-outline' : 'search-outline'}
                                message={error ? error : t('alerts.noBeatsInFeed')}
                                onRetry={error ? handleRetry : undefined}
                                retryLabel={t('common.retry')}
                            />
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
