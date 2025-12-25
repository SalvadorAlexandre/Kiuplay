// app/(tabs)/library.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { RootState } from '@/src/redux/store';
import { useSelectedMusic, TypeMusic } from '@/hooks/useSelectedMusic';
import useSubTabSelectorLibrary, { TypeSubTab } from '@/hooks/useSubTabSelectorLibrary';
import LocalMusicScreen from '@/app/audioLocalComponent/useMusicLocalList';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { Track } from '@/src/redux/playerSlice';
import LibraryContentCard from '@/components/musicItems/LibraryItem/LibraryContentCard';
import { LibraryFeedItem, } from '@/src/types/contentType';
import { Ionicons } from '@expo/vector-icons';
import { getLibraryFeed } from '@/src/api/feedApi';
import { useTranslation } from '@/src/translations/useTranslation';
import { setLocalTab, setCloudTab, setLibraryContent } from '@/src/redux/persistTabLibrery';



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
                onPress={() => router.push('/searchScreens/searchLibrary')}
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
    const favoritedMusics = useAppSelector((state) => state.favoriteMusic.musics);
    const followedArtists = useAppSelector((state: RootState) => state.followedArtists.artists);
    const selectedLibraryContent = useAppSelector((state) => state.library.selectedLibraryContent);

    // 1. Estados para armazenar os dados e o status da conexão
    const [feeds, setFeeds] = useState<LibraryFeedItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const favoritedCloudTracks: Track[] = favoritedMusics.filter(
        (music) =>
            music.category === 'single' && (
                music.source === 'library-cloud-feeds' ||
                music.source === 'library-cloud-favorites' ||
                music.source === 'library-local'
            )
    ) as Track[];

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

    const loadFeeds = async (pageToLoad = 1) => {
        if (isLoading || (!hasMore && pageToLoad !== 1)) return;

        try {
            setIsLoading(true);
            const response = await getLibraryFeed(pageToLoad, 20);

            if (response.success) {
                setFeeds(prev => pageToLoad === 1 ? response.data : [...prev, ...response.data]);

                // Trava de segurança definitiva
                if (pageToLoad >= response.totalPages || response.data.length < 20) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            }
        } catch (err) {
            console.error("Erro:", err);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // 1. Verificamos se já existem feeds carregados para evitar chamadas duplicadas
        // 2. Verificamos se NÃO está ocorrendo um carregamento no momento
        if (feeds.length === 0 && !isLoading) {
            // Resetamos o estado de paginação para garantir consistência no primeiro load
            setPage(1);
            setHasMore(true);
            loadFeeds(1);
        }
    }, []); // Array vazio garante que execute apenas na montagem inicial do componente


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
                    renderItem={({ item }) => (
                        <LibraryContentCard
                            item={item}
                            onPress={handleCloudItemPress}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <View style={{ marginTop: 100, alignItems: 'center' }}>
                            <Text style={styles.emptyText}>
                                {error ? error : t('alerts.noCloudFeedContent')}
                            </Text>
                        </View>
                    )}
                    onEndReached={() => {
                        if (hasMore && !isLoading) {
                            const nextPage = page + 1;
                            setPage(nextPage);
                            loadFeeds(nextPage); // Chamada direta corrigida
                        }
                    }}
                    onEndReachedThreshold={0.3} // 0.3 costuma ser mais fluido que 0.5
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
    emptyText: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16
    },
});