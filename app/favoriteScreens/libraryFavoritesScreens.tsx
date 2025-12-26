//app/favoriteScreens/libraryFavoritesScreens

import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import LibraryContentCard from '@/components/musicItems/LibraryItem/LibraryContentCard';
import { LibraryFavoritesFeedItem } from '@/src/types/contentType'; // Usando a nova União

export default function LibraryFavoritesScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    // 1. Ajustado para 'items' conforme o novo favoriteMusicSlice
    const favoritedItems = useAppSelector((state) => state.favoriteMusic.items);

    const [activeFilter, setActiveFilter] = useState<'all' | 'single' | 'album' | 'ep'>('all');

    // 2. Filtragem dinâmica com a tipagem correta
    const filteredData = favoritedItems.filter(item =>
        activeFilter === 'all' ? true : item.category === activeFilter
    );

    const handleItemPress = useCallback((item: LibraryFavoritesFeedItem) => {
        const routes = {
            single: `/contentCardLibraryScreens/single-details/${item.id}`,
            album: `/contentCardLibraryScreens/album-details/${item.id}`,
            ep: `/contentCardLibraryScreens/ep-details/${item.id}`,
        };

        // @ts-ignore - caminho dinâmico do expo-router
        const targetRoute = routes[item.category as keyof typeof routes];
        if (targetRoute) router.push(targetRoute);
    }, [router]);

    const FilterButton = ({ type, label }: { type: typeof activeFilter, label: string }) => (
        <TouchableOpacity
            style={[styles.filterBtn, activeFilter === type && styles.filterBtnActive]}
            onPress={() => setActiveFilter(type)}
            activeOpacity={0.8}
        >
            <Text style={[styles.filterText, activeFilter === type && styles.filterTextActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: t('favorites.title'),
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: { backgroundColor: '#000' },
                    headerBackTitle: t('common.back'),
                }}
            />

            <View style={styles.filterBar}>
                <FilterButton type="all" label={t('common.all')} />
                <FilterButton type="single" label="Singles" />
                <FilterButton type="ep" label="EPs" />
                <FilterButton type="album" label="Álbuns" />
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => `${item.category}-${item.id}`} // Chave composta para segurança
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item }) => (
                    <LibraryContentCard
                        item={item as any} // Cast temporário para o componente aceitar a União
                        onPress={() => handleItemPress(item)}
                    />
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="heart-outline" size={80} color="rgba(255,255,255,0.1)" />
                        <Text style={styles.emptyText}>
                            {activeFilter === 'all'
                                ? t('alerts.noFavoritesYet')
                                : t('alerts.noFavoritesCategory', { category: activeFilter.toUpperCase() })}
                        </Text>
                        <TouchableOpacity style={styles.exploreBtn} onPress={() => router.replace('/(tabs)/library')}>
                            <Text style={styles.exploreBtnText}>{t('common.explore')}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
                removeClippedSubviews={Platform.OS === 'android'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    filterBar: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: '#000',
    },
    filterBtn: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#333'
    },
    filterBtnActive: { backgroundColor: '#fff', borderColor: '#fff' },
    filterText: { color: '#AAA', fontSize: 13, fontWeight: '700' },
    filterTextActive: { color: '#000' },
    columnWrapper: { justifyContent: 'space-between', paddingHorizontal: 12 },
    listContent: { paddingBottom: 120, paddingTop: 10 },
    emptyContainer: { flex: 1, marginTop: 150, alignItems: 'center', paddingHorizontal: 50 },
    emptyText: { color: '#666', textAlign: 'center', marginTop: 20, fontSize: 16, lineHeight: 24 },
    exploreBtn: { marginTop: 30, backgroundColor: '#fff', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 30 },
    exploreBtnText: { color: '#000', fontWeight: '800', fontSize: 14 }
});