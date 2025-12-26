//app/favoriteScreens/beatStoreFavoritesScreen
import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Stack, useRouter, Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@/src/redux/hooks';
import BeatStoreMusicItem from '@/components/musicItems/beatStoreItem/BeatStoreMusicItem'; 
import { BeatStoreFeedItem } from '@/src/types/contentType';

export default function BeatStoreFavoritesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  // Melhoria: Usamos uma seleção segura para evitar re-renders desnecessários
  const favoritedBeats = useAppSelector((state) => state.favoriteBeats?.items ?? []);

  const handleBeatPress = useCallback((item: BeatStoreFeedItem) => {
    router.push({
      pathname: "/beatStoreScreens/beat-details/[id]" as Href,
      params: { id: item.id }
    } as any);
  }, [router]);

  // Melhoria de Performance: Memoizar o renderItem
  const renderBeatItem = useCallback(({ item }: { item: BeatStoreFeedItem }) => (
    <BeatStoreMusicItem
      item={item} 
      onPress={() => handleBeatPress(item)} 
    />
  ), [handleBeatPress]);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: t('favorites.beats_title') || 'Meus Favoritos', // Titulo corrigido
          headerTintColor: '#fff',
          headerStyle: { backgroundColor: '#000' },
          headerShadowVisible: false, // UI mais limpa (sem linha no header)
        }} 
      />

      <FlatList
        data={favoritedBeats}
        keyExtractor={(item) => `beat-${item.id}`}
        renderItem={renderBeatItem}
        // Otimização para Android: melhora o scroll
        removeClippedSubviews={Platform.OS === 'android'}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.iconCircle}>
                <Ionicons name="musical-notes-outline" size={50} color="#555" />
            </View>
            <Text style={styles.emptyText}>
              {t('alerts.noFavoriteBeats') || 'A tua lista de desejos está vazia.'}
            </Text>
            <TouchableOpacity 
              style={styles.exploreBtn} 
              onPress={() => router.replace('/(tabs)/beatstore')}
              activeOpacity={0.7}
            >
              <Text style={styles.exploreBtnText}>{t('common.browse_beats') || 'Explorar Batidas'}</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={favoritedBeats.length === 0 ? { flex: 1 } : styles.listPadding}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  listPadding: { paddingHorizontal: 15, paddingTop: 10, paddingBottom: 100 },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 40 
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  emptyText: { 
    color: '#888', 
    textAlign: 'center', 
    fontSize: 16,
    lineHeight: 22 
  },
  exploreBtn: { 
    marginTop: 25, 
    backgroundColor: '#fff', // Branco destaca-se mais no preto que o verde
    paddingVertical: 15, 
    paddingHorizontal: 35, 
    borderRadius: 30 
  },
  exploreBtnText: { color: '#000', fontWeight: 'bold', fontSize: 15 }
});