// app/profileScreens/usePromoteScreen.tsx
import React, { useState } from 'react';
import { router, Stack } from 'expo-router';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { removePromotion } from '@/src/redux/promotionsSlice';
import { Promotion } from '@/src/types/contentType';

import { useTranslation } from '@/src/translations/useTranslation'

export default function PromoteUserScreen() {
  const [activeTab, setActiveTab] = useState<'configurar' | 'ativas'>('configurar');
  const dispatch = useAppDispatch();
  const activePromotions = useAppSelector((state) => state.promotions.activePromotions);

  const { t } = useTranslation()

  // Função para renderizar cada item da lista de promoções
  const renderPromotionItem = ({ item }: { item: Promotion }) => {
    const startDate = new Date(item.startDate).toLocaleDateString();
    const endDate = new Date(item.endDate).toLocaleDateString();

    return (
      <View style={styles.promotionItemContainer}>
        <View style={styles.promoItemHeader}>
          <Image
            source={
              item.thumbnail
                ? { uri: item.thumbnail }
                : require('@/assets/images/Default_Profile_Icon/unknown_track.png')
            }
            style={styles.promoCover}
          />
          <View style={styles.promoDetails}>
            <Text style={styles.promoTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.promoContentTitle}>{item.message}</Text>
            <Text style={styles.promoDates}>
              {t('promoteScreen.active.start', { date: startDate })}
            </Text>
            <Text style={styles.promoDates}>
              {t('promoteScreen.active.end', { date: endDate })}
            </Text>
          </View>
        </View>

        {/* Botão direto sem Alert */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => dispatch(removePromotion(item.id))}
        >
          <Ionicons name="trash-outline" size={24} color="#FF6347" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t('promoteScreen.title'),
          headerStyle: { backgroundColor: '#191919' },
          headerTintColor: '#fff',
          headerShown: true,
        }}
      />
      <View style={{ flex: 1, backgroundColor: '#191919' }}>
        {/* --- Tab Bar Custom --- */}
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tabButton, activeTab === 'configurar' && styles.activeTab]}
            onPress={() => setActiveTab('configurar')}
          >
            <Text style={[styles.tabText, activeTab === 'configurar' && styles.activeTabText]}>{t('promoteScreen.tab.configure')}</Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'ativas' && styles.activeTab]}
            onPress={() => setActiveTab('ativas')}
          >
            <Text style={[styles.tabText, activeTab === 'ativas' && styles.activeTabText]}>{t('promoteScreen.tab.active')}</Text>
          </Pressable>
        </View>

        {/* --- Conteúdo de cada aba --- */}
        <View style={styles.content}>
          {activeTab === 'configurar' ? (
            <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20, }}>
              <Image
                style={{ resizeMode: 'center' }}
                source={require('@/assets/images/4/icons8_music_library_125px.png')}
              />
              <Text style={styles.configContentText}>{t('promoteScreen.configure.instruction')}</Text>
              <TouchableOpacity
                style={styles.buttonLoadContent}
                onPress={() => router.push('/promoteContentScreens/selectContentScreen')}
              >
                <Text style={{ color: '#fff', fontSize: 16, marginLeft: 10, }}>{t('promoteScreen.configure.button')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={activePromotions}
              renderItem={renderPromotionItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={() => (
                <View style={styles.emptyListContainer}>
                  <Text style={styles.emptyListText}>
                    {t('promoteScreen.active.empty')}
                  </Text>
                </View>
              )}
              contentContainerStyle={styles.promoListContainer}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#191919',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1e90ff',
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  activeTabText: {
    color: '#1E90FF',
  },
  configContentText: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyListContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyListText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
  },
  promoListContainer: {
    padding: 10,
  },
  promotionItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2b2b2b',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  promoItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  promoCover: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  promoDetails: {
    flex: 1,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  promoContentTitle: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 5,
  },
  promoDates: {
    color: '#ccc',
    fontSize: 12,
  },
  deleteButton: {
    padding: 10,
    marginLeft: 10,
  },
  buttonLoadContent: {
    alignItems: 'center',
    backgroundColor: '#1565C0',
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#555',
  },
});