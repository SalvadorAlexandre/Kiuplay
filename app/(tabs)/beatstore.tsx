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
import BeatStoreMusicItem from '@/components/musicItems/beatStoreItem/BeatStoreMusicItem';
import { BeatStoreFeedItem } from '@/src/types/contentType';
import { Ionicons } from '@expo/vector-icons';
import { getBeatStoreFeed } from '@/src/api/feedApi';
import { useTranslation } from '@/src/translations/useTranslation';


const BeatStoreHeader = ({ t, router }: { t: any, router: any }) => {
    return (
        <View style={headerStyles.containerTopBar}>

            <Text
                style={headerStyles.titleTopBar}
                numberOfLines={1}
            >
                {t('screens.beatStoreTitle')}
            </Text>

            {/**BTN DE CURTIDOS*/}
            <TouchableOpacity
                onPress={() => router.push('/searchScreens//searchBeatStore')}
                style={headerStyles.buttonTopBar}
            >
                <Ionicons name='heart-outline' size={26} color='#fff' />
            </TouchableOpacity>

            {/* Botão de pesquisa */}
            <TouchableOpacity
                onPress={() => router.push(`/searchScreens/searchBeatStore`)}
                style={headerStyles.buttonTopBar}>
                <Ionicons
                    name='search-outline'
                    size={26}
                    color='#fff'
                />
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
        flex: 1,
    },
    buttonTopBar: {
        padding: 6,  // Espaçamento interno do botão
    },

});


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


    const handleBeatStoreItemPress = (item: BeatStoreFeedItem) => {
        //Certifica-se de que a música a ser reproduzida é do tipo Track, que é o que o playerSlice espera
        if (item.typeUse === 'free') {
            router.push(`/contentCardBeatStoreScreens/freeBeat-details/${item.id}`);
        } else if (item.typeUse === 'exclusive') {
            router.push(`/contentCardBeatStoreScreens/exclusiveBeat-details/${item.id}`);
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
                    renderItem={({ item }) => (
                        <BeatStoreMusicItem
                            item={item}
                            onPress={handleBeatStoreItemPress}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <View style={{ marginTop: 100, alignItems: 'center' }}>
                            <Text style={styles.emptyText}>
                                {error ? error : t('alerts.noBeatsInFeed')}
                            </Text>
                        </View>
                    )}
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

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#191919',
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
    flatlistColumn: {
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    centerLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#aaa',
        textAlign: 'center',
        fontSize: 16,
    },
});