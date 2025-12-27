// app/(tabs)/profile.tsx

import React, { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { selectCurrentUserId, selectUserById, setUser } from '@/src/redux/userSessionAndCurrencySlice';
import BottomModal from '@/components/profileModal'; // caminho ajusta conforme tua pasta
import { useAppSelector, useAppDispatch } from "@/src/redux/hooks";
import { setPlaylistAndPlayThunk, } from '@/src/redux/playerSlice';
import { togglePlayPauseThunk, } from '@/src/redux/playerSlice';
import { useTranslation } from '@/src/translations/useTranslation';

import { setProfileActiveTab, ProfileTabKey } from '@/src/redux/persistTabProfile';
import { useMonetizationFlow } from '@/hooks/useMonetizationFlow'; //Hook do kiuplay wallet
import { userApi } from '@/src/api';
import { profileStyles as styles } from '@/components/navigation/styles/ProfileStyle';
import { ProfileHeader } from '@/components/navigation/ProfileHeader';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  SingleCard,
  AlbumCard,
  EpCard,
  ArtistCard,
  ExclusiveBeatCard,
  FreeBeatCard
} from '@/components/cardsItems';
import {
  Single,
  Album,
  ExtendedPlayEP,
  ArtistProfile,
  ProfileItem,
  ExclusiveBeat,
  PurchasedBeat,
  FreeBeat
} from '@/src/types/contentType';


export default function ProfileScreen() {

  interface Beat {
    id: string;
  }

  // Estado que controla o carregamento visual
  const [refreshing, setRefreshing] = useState(false);
  const { handleWalletAccess } = useMonetizationFlow();
  const isConnected = useAppSelector((state) => state.network.isConnected);
  const { t, } = useTranslation();
  const dispatch = useAppDispatch();
  const { isPlaying, isLoading, } = useAppSelector((state) => state.player);
  const [currentTabPlaying, setCurrentTabPlaying] = useState<string | null>(null);
  const [isProfileModalVisible, setProfileModalVisible] = React.useState(false);
  const openProfileModal = () => setProfileModalVisible(true);
  const closeProfileModal = () => setProfileModalVisible(false);
  const currentUserId = useAppSelector(selectCurrentUserId);
  const userProfile = useAppSelector(selectUserById(currentUserId!));
  const purchasedBeats = useAppSelector((state) => state.purchases.items);
  const soldBeatIds: string[] = useAppSelector((state) => state.purchases.items.map(beat => beat.id));
  // Garante que 'userProfile.exclusiveBeats' seja um array antes de chamar '.filter'
  const exclusiveBeatsForSale = (userProfile.exclusiveBeats ?? [])
    .filter((beat: Beat) => !soldBeatIds.includes(beat.id));

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

  //Logica para carrar lista de audio no player baseando se na aba ativa
  const getTracksForActiveTab = () => {
    switch (activeTab) {
      case "single":
        return userProfile.singles;
      case "exclusiveBeatsForSale": // 🛑 Novo case para a aba A VENDA
        return exclusiveBeatsForSale;
      case "freeBeats":
        return userProfile.freeBeats;
      default:
        // Se o utilizador estiver noutra aba → usa Singles como padrão
        return userProfile.singles;
    }
  };

  const handlePlayFromTab = useCallback(() => {
    const tracks = getTracksForActiveTab() as ExclusiveBeat[] | any; // Tipo corrigido

    if (!tracks || tracks.length === 0) {
      Alert.alert("Erro", "Não há faixas disponíveis nesta aba.");
      return;
    }

    dispatch(setPlaylistAndPlayThunk({
      newPlaylist: tracks,
      startIndex: 0,
      shouldPlay: true,
    }));
  }, [dispatch, activeTab, userProfile, exclusiveBeatsForSale]);

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
                pathname: '/',
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
                pathname: '/detailsBeatStoreScreens/exclusiveBeat-details/[id]',
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
                pathname: '/detailsBeatStoreScreens/exclusiveBeat-details/[id]',
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
                pathname: '/detailsBeatStoreScreens/exclusiveBeat-details/[id]',
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
                pathname: '/TabProfileBeatScreens/FreeBeat/[id]',
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
          data={getActiveData()}
          keyExtractor={(item) => item.id.toString()}
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.texto}>{t(`profile.empty${activeTab}`)}</Text>
            </View>
          }
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