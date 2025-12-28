//app/favoriteScreens/beatStoreFavoritesScreen

import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useAppSelector } from '@/src/redux/hooks';
import { useTranslation } from '@/src/translations/useTranslation';

// Componentes
import { BeatFavoritesHeader } from '@/components/favoritesLibraryBeatHeaders/BeatFavoritesHeader';
import { FreeBeatCard, ExclusiveBeatCard } from '@/components/cardsItems';

// Tipos
import { FreeBeat, ExclusiveBeat } from '@/src/types/contentType';

type BeatTab = 'free' | 'exclusive';

export default function BeatFavoritesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BeatTab>('free');

  // 1. Seletores do Redux (Ajuste os nomes conforme seu store.ts)
  const favoriteFreeBeats = useAppSelector((state) => state.favoriteFreeBeats?.items || []);
  const favoriteExclusiveBeats = useAppSelector((state) => state.favoriteExclusiveBeats?.items || []);

  // 2. Filtra os dados com base na aba ativa e limpa dados nulos/inválidos
  const activeData = useMemo(() => {
    const data = activeTab === 'free' ? favoriteFreeBeats : favoriteExclusiveBeats;
    return data.filter((item: any) => item !== null && item !== undefined);
  }, [activeTab, favoriteFreeBeats, favoriteExclusiveBeats]);

  // 3. Renderização dos Cards
  const renderItem = ({ item }: { item: any }) => {
    if (activeTab === 'free') {
      return (
        <FreeBeatCard
          item={item as FreeBeat}
          onPress={(b) => router.push(`/detailsBeatStoreScreens/freeBeat-details/${b.id}`)}
        />
      );
    }

    return (
      <ExclusiveBeatCard
        item={item as ExclusiveBeat}
        onPress={(b) => router.push(`/detailsBeatStoreScreens/exclusiveBeat-details/${b.id}`)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <FlatList
        data={activeData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        // A key garante que o layout das colunas seja recalculado se as abas mudarem
        key={activeTab}
        ListHeaderComponent={
          <BeatFavoritesHeader
            activeTab={activeTab}
            onTabPress={setActiveTab}
            t={t}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'free' 
                ? t('favorites.empty.freeBeats') 
                : t('favorites.empty.exclusiveBeats')}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  listContent: {
    paddingBottom: 40,
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
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});