//app/favoriteScreens/libraryFavoritesScreens
import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useAppSelector } from '@/src/redux/hooks';
import { useTranslation } from '@/src/translations/useTranslation';

// Componentes
import { LibraryFavoritesHeader } from '@/components/favoritesLibraryBeatHeaders/libraryFavoritesHeader';
import { SingleCard, AlbumCard, EpCard, ArtistCard } from '@/components/cardsItems';

// Tipos
import { Single, Album, ExtendedPlayEP, ArtistProfile } from '@/src/types/contentType';

export default function LibraryFavoritesScreen() {
    const { t } = useTranslation();
    const router = useRouter();

    // 1. Definição das Abas (IDs técnicos para facilitar o switch)
    const tabs = [
        t('favorites.tabs.artists'),
        t('favorites.tabs.singles'),
        t('favorites.tabs.eps'),
        t('favorites.tabs.albums'),
    ];

    const [activeTab, setActiveTab] = useState(tabs[0]);

    // 2. Seleção de dados do Redux (Ajuste os caminhos conforme seu store)


    // 2. Seleção de dados do Redux ajustada aos seus Slices
    const followedArtists = useAppSelector((state) => state.followedArtists.artists); 
    const favoriteSingles = useAppSelector((state) => state.favoriteSingles.items);  
    const favoriteEps = useAppSelector((state) => state.favoriteEPs.items);      
    const favoriteAlbums = useAppSelector((state) => state.favoriteAlbums.items); 


    // 3. Filtragem de dados baseada na aba ativa
    const activeData = useMemo(() => {
        if (activeTab === tabs[0]) return followedArtists;
        if (activeTab === tabs[1]) return favoriteSingles;
        if (activeTab === tabs[2]) return favoriteEps;
        if (activeTab === tabs[3]) return favoriteAlbums;
        return [];
    }, [activeTab, followedArtists, favoriteSingles, favoriteEps, favoriteAlbums]);

    // 4. Renderização Dinâmica com Type Casting
    const renderItem = ({ item }: { item: any }) => {
        if(!item) return null;
        
        if (activeTab === tabs[0]) {
            return (
                <ArtistCard
                    item={item as ArtistProfile}
                    onPress={(id) => router.push(`/detailsLibraryScreens/artist-profile/${id}`)}
                />
            );
        }

        if (activeTab === tabs[1]) {
            return (
                <SingleCard
                    item={item as Single}
                    onPress={(s) => router.push(`/detailsLibraryScreens/single-details/${s.id}`)}
                />
            );
        }

        if (activeTab === tabs[2]) {
            return (
                <EpCard
                    item={item as ExtendedPlayEP}
                    onPress={(e) => router.push(`/detailsLibraryScreens/ep-details/${e.id}`)}
                />
            );
        }

        if (activeTab === tabs[3]) {
            return (
                <AlbumCard
                    item={item as Album}
                    onPress={(a) => router.push(`/detailsLibraryScreens/album-details/${a.id}`)}
                />
            );
        }

        return null;
    };


    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <FlatList
                data={activeData}
                keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                //keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                // Usamos a aba como key para resetar o layout da FlatList ao trocar de categoria
                key={activeTab}
                ListHeaderComponent={
                    <LibraryFavoritesHeader
                        title={t('favorites.libraryTitle')}
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabPress={setActiveTab}
                        onBack={() => router.back()}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>{t('favorites.emptyMessage')}</Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 30 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginTop: 15,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    },
});