// app/(tabs)/profile.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { selectCurrentUserId, selectUserById, setUser } from '@/src/redux/userSessionAndCurrencySlice';
import BottomModal from '@/components/profileModal'; // caminho ajusta conforme tua pasta
import { useAppSelector, useAppDispatch } from "@/src/redux/hooks";
import { setPlaylistAndPlayThunk, } from '@/src/redux/playerSlice';
import { togglePlayPauseThunk, } from '@/src/redux/playerSlice';
import { useTranslation } from '@/src/translations/useTranslation';

import { useSharedValue } from 'react-native-reanimated';

import { EmptyState } from '@/components/ListEmptyComponent';
import { userApi, getMyContentPaginated } from '@/src/api';

import { setProfileActiveTab, ProfileTabKey } from '@/src/redux/persistTabProfile';
import { useMonetizationFlow } from '@/hooks/useMonetizationFlow'; //Hook do kiuplay wallet
import { profileStyles as styles } from '@/components/navigation/styles/ProfileStyle';
import { ProfileHeader } from '@/components/navigation/ProfileHeader';
import {
  View, Text, Image, TouchableOpacity, Animated, FlatList, ActivityIndicator,
} from 'react-native';
import {
  SingleCard, AlbumCard, EpCard, ArtistCard, ExclusiveBeatCard, FreeBeatCard
} from '@/components/cardsItems';
import {
  Single, Album, ExtendedPlayEP, ArtistProfile, ProfileItem, ExclusiveBeat, PurchasedBeat, FreeBeat
} from '@/src/types/contentType';


export default function ProfileScreen() {

  // Estado que controla o carregamento visual
  const [refreshing, setRefreshing] = useState(false);
  const { handleWalletAccess } = useMonetizationFlow();

  const { t, } = useTranslation();
  const dispatch = useAppDispatch();
  const { isPlaying, isLoading, } = useAppSelector((state) => state.player);
  const [currentTabPlaying, setCurrentTabPlaying] = useState<string | null>(null);
  const [isProfileModalVisible, setProfileModalVisible] = React.useState(false);
  const openProfileModal = () => setProfileModalVisible(true);
  const closeProfileModal = () => setProfileModalVisible(false);

  const isConnected = useAppSelector((state) => state.network.isConnected);
  const currentUserId = useAppSelector(selectCurrentUserId);
  const userProfile = useAppSelector(selectUserById(currentUserId!));
  // 1. Onde vamos guardar os itens acumulados (paginados)
  const [items, setItems] = useState<any[]>([]);

  // 2. Controle de página e carregamento
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Defina um limite fixo por página
  const LIMIT = 10;


  // Hooks para os botões de animação (mantidos do seu código original)
  const [scaleValueConfig] = useState(new Animated.Value(1));
  const handlePressInConfig = () => { Animated.spring(scaleValueConfig, { toValue: 0.96, useNativeDriver: true }).start(); };
  const handlePressOutConfig = () => { Animated.spring(scaleValueConfig, { toValue: 1, useNativeDriver: true }).start(); };

  const [scaleValueUploads] = useState(new Animated.Value(1));
  const handlePressInUploads = () => { Animated.spring(scaleValueUploads, { toValue: 0.96, useNativeDriver: true }).start(); };
  const handlePressOutUploads = () => { Animated.spring(scaleValueUploads, { toValue: 1, useNativeDriver: true }).start(); };

  const [scaleValueMonetization] = useState(new Animated.Value(1));
  const handlePressInMonetization = () => { Animated.spring(scaleValueMonetization, { toValue: 0.96, useNativeDriver: true }).start(); };
  const handlePressOutMonetization = () => { Animated.spring(scaleValueMonetization, { toValue: 1, useNativeDriver: true }).start(); };

  const activeTab = useAppSelector((state) => state.profile.activeTab);
  const tabs: { key: ProfileTabKey; label: string }[] = [
    { key: 'single', label: t('tabs.single') },
    { key: 'extendedPlay', label: t('tabs.extendedPlay') },
    { key: 'album', label: t('tabs.album') },
    { key: 'purchasedBeats', label: t('tabs.purchasedBeats') }, // 
    { key: 'exclusiveBeatsForSale', label: t('tabs.exclusiveBeatsForSale') },
    { key: 'freeBeats', label: t('tabs.freeBeats') },
  ];

  const getBackendType = (tab: ProfileTabKey) => {
    switch (tab) {
      case 'single': return 'singles';
      case 'extendedPlay': return 'eps';
      case 'album': return 'albums';
      case 'purchasedBeats': return 'purchasedBeats';
      case 'exclusiveBeatsForSale': return 'exclusiveBeats';
      case 'freeBeats': return 'freeBeats';
      default: return 'singles';
    }
  };

  const fetchData = useCallback(async (pageToLoad: number) => {
    // 1. Prepara os estados antes de começar
    if (pageToLoad === 1) {
      setRefreshing(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      // 2. Chama a API (usa o helper que criamos no passo anterior para o type)
      const backendType = getBackendType(activeTab);
      const response = await getMyContentPaginated(backendType, pageToLoad, LIMIT);

      if (response.success) {
        // 3. Se for a página 1, substituímos tudo. Se for página 2+, concatenamos.
        setItems(prev => (pageToLoad === 1 ? response.data : [...prev, ...response.data]));

        // 4. Atualizamos se ainda existem mais páginas no servidor
        setHasMore(pageToLoad < response.totalPages);
        setPage(pageToLoad);
      } else {
        setError(response.error || "Erro ao carregar conteúdo.");
      }
    } catch (err) {
      setError("Não foi possível conectar ao servidor.");
      console.error(err);
    } finally {
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  }, [activeTab]); // Depende apenas da aba ativa

  // 1. Efeito para carregar a página 1 sempre que a aba mudar
  useEffect(() => {
    fetchData(1);
  }, [activeTab, fetchData]);


  // 3. Função para o Infinite Scroll (quando chegar ao fim da lista)
  const handleLoadMore = () => {
    // Só carrega mais se: não estiver carregando, houver mais páginas e não houver erro
    if (!isLoadingMore && hasMore && !error) {
      fetchData(page + 1);
    }
  };

  // 4. Função para tentar novamente em caso de erro (passada para o EmptyState)
  const handleRetry = () => {
    fetchData(page);
  };


  const getDynamicAvatarSource = () => {
    if (isConnected === false || !userProfile.avatar || userProfile.avatar.trim() === "") {
      return require("@/assets/images/Default_Profile_Icon/icon_profile_white_120px.png");
    }
    return { uri: userProfile.avatar };
  };

  const avatarUser = getDynamicAvatarSource()

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Reutiliza a mesma chamada que usas no AuthProvider
      const updatedUser = await userApi.getMe();

      // Atualiza o Redux com os novos dados (Singles, EPs, etc)
      dispatch(setUser(updatedUser));

      console.log("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao puxar dados do perfil:", error);
      // Aqui poderias usar a tua função showModal('error', ...) se quiseres
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);


  const getActiveData = () => {
    // Garantimos que trabalhamos com arrays, mesmo que nulos
    switch (activeTab) {
      case 'single':
        return (userProfile as ArtistProfile).singles || [];
      case 'extendedPlay':
        return (userProfile as ArtistProfile).eps || [];
      case 'album':
        return (userProfile as ArtistProfile).albums || [];

      // Beats comprados vêm da lista geral do UserProfile (qualquer um pode comprar)
      case 'purchasedBeats':
        return userProfile.purchasedBeats || [];

      // Beats à venda e Gratuitos costumam vir apenas se for Perfil de Artista
      case 'exclusiveBeatsForSale':
        return (userProfile as ArtistProfile).exclusiveBeats || [];
      case 'freeBeats':
        return (userProfile as ArtistProfile).freeBeats || [];

      default:
        return [];
    }
  };

  const renderDynamicItem = ({ item }: { item: ProfileItem }) => {
    switch (activeTab) {
      case 'single':
        // Usamos 'as Single' para assegurar que este item possui as propriedades de Single
        const singleItem = item as Single;
        return (
          <SingleCard
            item={singleItem}
            onPress={(selected) =>
              router.push({
                pathname: '/detailsProfileScreens/single-details/[id]',
                params: { id: selected.id },
              })
            }
          />
        );

      case 'extendedPlay':
        const epItem = item as ExtendedPlayEP;
        return (
          <EpCard
            item={epItem}
            onPress={(selected) =>
              router.push({
                pathname: '/detailsProfileScreens/ep-details/[id]',
                params: { id: selected.id },
              })
            }
          />
        );

      case 'album':
        const albumItem = item as Album;
        return (
          <AlbumCard
            item={albumItem}
            onPress={(selected) =>
              router.push({
                pathname: '/detailsProfileScreens/album-details/[id]',
                params: { id: selected.id },
              })
            }
          />
        );

      case 'purchasedBeats':
        const purchasedItem = item as PurchasedBeat;
        return (
          <ExclusiveBeatCard
            item={purchasedItem}
            onPress={(selected) =>
              router.push({
                pathname: '/detailsBeatStoreScreens/exclusiveBeat-details/[id]',
                params: { id: selected.id },
              })
            }
          />
        );

      case 'exclusiveBeatsForSale':
        const exclusiveItem = item as ExclusiveBeat;
        return (
          <ExclusiveBeatCard
            item={exclusiveItem}
            onPress={(selected) =>
              router.push({
                pathname: '/detailsProfileScreens/exclusiveBeatForSale-details/[id]',
                params: { id: selected.id },
              })
            }
          />
        );

      case 'freeBeats':
        const freeItem = item as FreeBeat;
        return (
          <FreeBeatCard
            item={freeItem}
            onPress={(selected) =>
              router.push({
                pathname: '/detailsProfileScreens/freeBeat-details/[id]',
                params: { id: selected.id },
              })
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#191919' }}>
        <FlatList
          data={items}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderDynamicItem} // Função que escolhe o Card (SingleCard, EpCard, etc)
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          key={activeTab} // Essencial para mudar o layout de grid
          ListHeaderComponent={
            <ProfileHeader
              userProfile={userProfile}
              avatarUser={avatarUser}
              activeTab={activeTab}
              tabs={tabs}
              onTabPress={(key) => dispatch(setProfileActiveTab(key))}
              t={t}
              // Passando as funções para o Header
              refreshing={refreshing}
              onRefresh={onRefresh}
              openProfileModal={openProfileModal}
            />
          }
          ListEmptyComponent={() => {
            if (refreshing && page === 1) return null;
            return (
              <EmptyState
                icon={error ? 'file-tray-outline' : 'search-outline'}
                message={error ? error : t('alerts.noBeatsInFeed')}
                onRetry={error ? handleRetry : undefined}
                retryLabel={t('common.retry')}
              />
            )
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          removeClippedSubviews={true}
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => (
            isLoadingMore ? (
              <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color="#FFF" />
              </View>
            ) : <View style={{ height: 40 }} /> // Espaçamento extra no fim
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      <BottomModal visible={isProfileModalVisible} onClose={closeProfileModal}>
        {/* Conteúdo do modal */}
        <View>
          {/* --- Botão Configurações --- */}
          <Animated.View
            style={[styles.buttonContainer, { transform: [{ scale: scaleValueConfig }] }]}
          >
            <TouchableOpacity
              onPressIn={handlePressInConfig}
              onPressOut={handlePressOutConfig}
              onPress={() => {
                closeProfileModal();
                router.push('/profileScreens/useProfileSettingsScreen');
              }}
              style={styles.buttonContent}
            >
              <Image
                source={require('@/assets/images/2/icons8_settings_120px.png')}
                style={styles.iconLeft}
              />
              <Text style={styles.buttonText}>{t('general.settings')}</Text>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          {/* --- Botão Uploads --- */}
          <Animated.View
            style={[styles.buttonContainer, { transform: [{ scale: scaleValueUploads }] }]}
          >
            <TouchableOpacity
              onPressIn={handlePressInUploads}
              onPressOut={handlePressOutUploads}
              onPress={() => {
                closeProfileModal();
                router.push('/profileScreens/useOptionsPostsScreen');
              }}
              style={styles.buttonContent}
            >
              <Image
                source={require('@/assets/images/2/icons8_upload_to_the_cloud_120px.png')}
                style={styles.iconLeft}
              />
              <Text style={styles.buttonText}>{t('profile.makeUploads')}</Text>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          {/* --- Botão Carteira --- */}
          <Animated.View
            style={[styles.buttonContainer, { transform: [{ scale: scaleValueMonetization }] }]}
          >
            <TouchableOpacity
              onPressIn={handlePressInMonetization}
              onPressOut={handlePressOutMonetization}
              onPress={() => {
                closeProfileModal();
                handleWalletAccess();
              }}
              style={styles.buttonContent}
            >
              <Image
                source={require('@/assets/images/2/icons8_wallet_120px.png')}
                style={styles.iconLeft}
              />
              <Text style={styles.buttonText}>{t('profile.Kiuplaywallet')}</Text>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </BottomModal>
    </>
  );
}