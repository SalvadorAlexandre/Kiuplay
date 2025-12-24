// app/profileScreens/usePromoteScreen.tsx
import React, { useState, useEffect } from 'react';
import { router, Stack } from 'expo-router';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { removePromotion } from '@/src/redux/promotionsSlice';
import { Promotion } from '@/src/types/contentType';
import { useTranslation } from '@/src/translations/useTranslation'
import { getMyPromotions, deletePromotion } from '@/src/api/promotionApi';
import { PromotionFeedbackModal } from '@/components/promotionFeedBackModal';

export default function PromoteUserScreen() {
  const [activeTab, setActiveTab] = useState<'configurar' | 'ativas'>('configurar');
  //const dispatch = useAppDispatch();
  //const activePromotions = useAppSelector((state) => state.promotions.activePromotions);
  const isConnected = useAppSelector((state) => state.network.isConnected);
  const { t } = useTranslation()

  // Substitui os seletores do Redux por isto:
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: 'success' as 'success' | 'error' | 'confirm',
    message: ''
  });
  const loadPromotions = async () => {
    setIsLoading(true);
    try {
      const data = await getMyPromotions();
      setPromotions(data);
    } catch (error: any) {
      console.error("Erro ao carregar promoções:", error);

      // 1. Tenta capturar o código vindo do Back-end, senão usa o genérico
      const errorCode = t('promoteScreen.errors.loading') || error.response?.data?.errorCode;

      // 2. Dispara o teu modal de erro com a tradução correta
      setModalConfig({
        visible: true,
        type: 'error',
        message: errorCode
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'ativas') {
      loadPromotions();
    }
  }, [activeTab]); // Sempre que a aba mudar, ele verifica se deve carregar

  const getDynamicCover = (thumbnail?: string) => {
    if (isConnected === false || !thumbnail || thumbnail.trim() === "") {
      return require("@/assets/images/Default_Profile_Icon/unknown_track.png");
    }
    return { uri: thumbnail };
  };

  const confirmDelete = (id: string) => {
    setSelectedId(id); // Guarda o ID temporariamente
    setModalConfig({
      visible: true,
      type: 'confirm',
      message: t('promoteScreen.confirmDeleteMessage')
    });
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    setModalConfig(prev => ({ ...prev, visible: false })); // Fecha o modal de confirmação

    try {
      await deletePromotion(selectedId);
      setPromotions(prev => prev.filter(p => p.id !== selectedId));

      await loadPromotions();
      // Abre o modal de sucesso
      setModalConfig({
        visible: true,
        type: 'success',
        message: t('promoteScreen.success.deleted')
      });

    } catch (error: any) {
      const errorCode = t('promoteScreen.errors.notAuthorized') || error.response?.data?.errorCode;
      setModalConfig({
        visible: true,
        type: 'error',
        message: errorCode
      });
    } finally {
      setSelectedId(null);
    }
  };

  // Função para renderizar cada item da lista de promoções
  const renderPromotionItem = ({ item }: { item: Promotion }) => {

    const coverSource = getDynamicCover(item.thumbnail);
    const startDate = new Date(item.startDate).toLocaleDateString();
    const endDate = new Date(item.endDate).toLocaleDateString();

    return (
      <View style={styles.promotionItemContainer}>
        <View style={styles.promoItemHeader}>
          <Image
            source={coverSource}
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

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDelete(item.id)}
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
            /* Se estiver a carregar, mostra o indicador. Se não, mostra a FlatList */
            isLoading ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={{ color: '#fff', marginTop: 10 }}>{t('promoteScreen.loading')}</Text>
              </View>
            ) : (
              <FlatList
                data={promotions} // Lembra-te de usar o estado local 'promotions' que criámos
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
            )
          )}
        </View>
        <PromotionFeedbackModal
          isVisible={modalConfig.visible}
          type={modalConfig.type}
          message={modalConfig.message}
          onClose={() => setModalConfig({ ...modalConfig, visible: false })}
          onConfirm={handleDelete} // Passa a função aqui!
        />
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
    resizeMode: 'cover',
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