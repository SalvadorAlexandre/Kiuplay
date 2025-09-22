// app/profileScreens/usePromoteScreen.tsx
import React, { useState } from 'react';
import { router, Stack } from 'expo-router';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList, // Importa FlatList para exibir a lista de promoções
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { removePromotion } from '@/src/redux/promotionsSlice'; // Importa a ação de remoção

export default function PromoteUserScreen() {
  const [activeTab, setActiveTab] = useState<'configurar' | 'ativas'>('configurar');
  const dispatch = useAppDispatch();
  const activePromotions = useAppSelector((state) => state.promotions.activePromotions);

  // Função para renderizar cada item da lista de promoções
  const renderPromotionItem = ({ item }: { item: any }) => {
    const startDate = new Date(item.startDate).toLocaleDateString();
    const endDate = new Date(item.endDate).toLocaleDateString();

    const handleRemovePromotion = () => {
      Alert.alert(
        'Confirmar Exclusão',
        'Tem certeza que deseja apagar esta promoção?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Apagar', onPress: () => dispatch(removePromotion(item.id)) }
        ]
      );
    };

    return (
      <View style={styles.promotionItemContainer}>
        <View style={styles.promoItemHeader}>
          <Image source={item.coverSource} style={styles.promoCover} />
          <View style={styles.promoDetails}>
            <Text style={styles.promoTitle} numberOfLines={1}>{item.adTitle}</Text>
            <Text style={styles.promoContentTitle}>{item.contentTitle}</Text>
            <Text style={styles.promoDates}>
              {`Início: ${startDate}`}
            </Text>
            <Text style={styles.promoDates}>
              {`Término: ${endDate}`}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={handleRemovePromotion}>
          <Ionicons name="trash-outline" size={24} color="#FF6347" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Promover postagem',
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
            <Text style={styles.tabText}>Configurar Promoção</Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'ativas' && styles.activeTab]}
            onPress={() => setActiveTab('ativas')}
          >
            <Text style={styles.tabText}>Promoções Ativas</Text>
          </Pressable>
        </View>

        {/* --- Conteúdo de cada aba --- */}
        <View style={styles.content}>
          {activeTab === 'configurar' ? (
            <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
              <Image
                source={require('@/assets/images/4/icons8_music_library_125px.png')}
                resizeMode='center'
              />
              <Text style={styles.configContentText}>Seleciona o conteúdo que desejas promover...</Text>
              <TouchableOpacity
                style={styles.buttonLoadContent}
                onPress={() => router.push('/promoteContentScreens/selectContentScreen')}
                >
                <Text style={{ color: '#fff', fontSize: 16, marginLeft: 10, }}>Escolher música ou instrumental</Text>
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
                    Nenhuma promoção ativa no momento.
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
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
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