// app/(tabs)/beatstore.tsx
import React, { useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@/src/redux/hooks';
import { } from '@/src/types/contentType';
import { BeatStoreHeader } from '@/components/navigation'
import { Ionicons } from '@expo/vector-icons';
import { getBeatStoreFeed } from '@/src/api/feedApi';
import { useTranslation } from '@/src/translations/useTranslation';
import { feedStyles as styles } from '@/components/navigation';
import { FreeBeatCard, ExclusiveBeatCard } from '@/components/cardsItems';
import { FreeBeat, ExclusiveBeat, BeatStoreFeedItem } from '@/src/types/contentType';
import { EmptyState } from '@/components/ListEmptyComponent';

export default function BeatStoreScreen() {

    const router = useRouter();
    const { t } = useTranslation(); // Usa o hook customizado de tradução
    const [feedData, setFeedData] = React.useState<BeatStoreFeedItem[]>([]);
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);
    const [page, setPage] = React.useState<number>(1);
    const [hasMore, setHasMore] = React.useState<boolean>(true); // se ainda tem mais páginas


    const loadFeeds = async (pageToLoad = 1) => {
        // 1. Trava de segurança contra múltiplas chamadas ou fim da lista
        if (isLoading || (!hasMore && pageToLoad !== 1)) return;

        try {
            setLoading(true); // Usando 'loading' conforme definido no seu componente
            setError(null);

            // Chamada ajustada para o serviço da BeatStore
            const response = await getBeatStoreFeed(pageToLoad, 20);

            if (response.success) {
                // Atualiza os dados: substitui se for página 1, concatena se for scroll
                setFeedData(prev => pageToLoad === 1 ? response.data : [...prev, ...response.data]);

                // Trava de segurança definitiva baseada no cálculo do servidor
                if (pageToLoad >= response.totalPages || response.data.length < 20) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            } else {
                // Caso o servidor responda success: false
                setHasMore(false);
                setError("Erro ao processar beats.");
            }
        } catch (err) {
            console.error("Erro no loadFeeds da BeatStore:", err);
            setError("Falha na conexão com o servidor.");
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 1. Verificamos se já existem feeds carregados para evitar chamadas duplicadas
        // 2. Verificamos se NÃO está ocorrendo um carregamento no momento
        if (feedData.length === 0 && !isLoading) {
            // Resetamos o estado de paginação para garantir consistência no primeiro load
            setPage(1);
            setHasMore(true);
            loadFeeds(1);
        }
    }, []); // Executa apenas na montagem

    const handleRetry = useCallback(() => {
        setError(null);
        setFeedData([]);
        setPage(1);
        setHasMore(true);
        loadFeeds(1);
    }, []);

    const handleBeatStoreItemPress = (item: BeatStoreFeedItem) => {
        //Certifica-se de que a música a ser reproduzida é do tipo Track, que é o que o playerSlice espera
        if (item.typeUse === 'free') {
            router.push(`/detailsBeatStoreScreens/freeBeat-details/${item.id}`);
        } else if (item.typeUse === 'exclusive') {
            router.push(`/detailsBeatStoreScreens/exclusiveBeat-details/${item.id}`);
        } else {
            console.warn('Tipo de item desconhecido ou não suportado para navegação...');
        }
    };


    const renderHeader = useCallback(() => (
        <BeatStoreHeader t={t} router={router} />
    ), [t, router]);

    return (
        <View style={styles.mainContainer}>
            {/* Carregamento centralizado apenas para a primeira página */}
            {isLoading && page === 1 ? (
                <View style={styles.centerLoader}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            ) : (
                <FlatList
                    data={feedData}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.flatlistColumn}
                    ListHeaderComponent={renderHeader}
                    stickyHeaderIndices={[0]}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }: { item: BeatStoreFeedItem }) => {
                        switch (item.typeUse) {

                            case 'free':
                                return <FreeBeatCard item={item as FreeBeat} onPress={handleBeatStoreItemPress} />;

                            case 'exclusive':
                                return <ExclusiveBeatCard item={item as ExclusiveBeat} onPress={handleBeatStoreItemPress} />;

                            default:
                                // Fallback para caso surja um tipo novo não mapeado
                                return null;
                        }
                    }}
                    ListEmptyComponent={() => {
                        // Se estiver carregando a primeira página, não mostramos nada (deixa o centerLoader agir)
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
                        // Mantendo a lógica de paginação segura
                        if (hasMore && !isLoading && feedData.length >= 20) {
                            const nextPage = page + 1;
                            setPage(nextPage);
                            loadFeeds(nextPage);
                        }
                    }}
                    onEndReachedThreshold={0.3}
                    removeClippedSubviews={true}
                    ListFooterComponent={() =>
                        isLoading && page > 1 ? (
                            <View style={{ paddingVertical: 20 }}>
                                <ActivityIndicator size="small" color="#fff" />
                            </View>
                        ) : (
                            /* O espaço de 150px garante que o FloatingButton não cubra o último beat */
                            <View style={{ height: 100 }} />
                        )
                    }
                />
            )}

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => {
                    router.push('/autoSearchBeatScreens/useSearchBeatScreen');
                }}
            >
                <Image
                    source={require('@/assets/images/4/sound-waves.png')}
                    style={{ width: 50, height: 40, tintColor: '#fff' }}
                />
            </TouchableOpacity>
        </View >
    );
}