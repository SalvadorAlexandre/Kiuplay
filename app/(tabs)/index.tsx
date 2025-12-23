// app/(tabs)/profile.tsx

import React, { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { selectCurrentUserId, selectUserById } from '@/src/redux/userSessionAndCurrencySlice';
import SingleCard from '@/components/musicItems/TabProfileSingleItem/SingleCard';
import EpCard from '@/components/musicItems/TabProfileEpItem/EpCard';
import AlbumCard from '@/components/musicItems/TabProfileAlbumItem/AlbumCard';
import ExclusiveBeatCard from '@/components/musicItems/TabProfileExclusiveBeatItem/ExclusiveBeatCard';
import FreeBeatCard from '@/components/musicItems/TabProfileFreeBeatItem/FreeBeatCard';
import BottomModal from '@/components/profileModal'; // caminho ajusta conforme tua pasta
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
import { useAppSelector, useAppDispatch } from "@/src/redux/hooks";
import { setPlaylistAndPlayThunk, } from '@/src/redux/playerSlice';
import { togglePlayPauseThunk, } from '@/src/redux/playerSlice';
import { useTranslation } from '@/src/translations/useTranslation';
// NOVO IMPORT: Importa o tipo ExclusiveBeat
import { ExclusiveBeat } from '@/src/types/contentType';
import { setProfileActiveTab, ProfileTabKey } from '@/src/redux/persistTabProfile';
import { useMonetizationFlow } from '@/hooks/useMonetizationFlow'; //Hook do kiuplay wallet

export default function ProfileScreen() {

  interface Beat {
    id: string;
  }

  const { handleWalletAccess } = useMonetizationFlow();

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
  // ---------------------------------------------------------

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


  /**
   * const tabs = [
    { key: 'single', label: t('tabs.single') },
    { key: 'extendedPlay', label: t('tabs.extendedPlay') },
    { key: 'album', label: t('tabs.album') },
    { key: 'purchasedBeats', label: t('tabs.purchasedBeats') }, 
    { key: 'exclusiveBeatsForSale', label: t('tabs.exclusiveBeatsForSale') }, 
    { key: 'freeBeats', label: t('tabs.freeBeats') },
  ];
   */

  
  const activeTab = useAppSelector((state) => state.profile.activeTab);
  const tabs: { key: ProfileTabKey; label: string }[] = [
    { key: 'single', label: t('tabs.single') },
    { key: 'extendedPlay', label: t('tabs.extendedPlay') },
    { key: 'album', label: t('tabs.album') },
    { key: 'purchasedBeats', label: t('tabs.purchasedBeats') }, // 
    { key: 'exclusiveBeatsForSale', label: t('tabs.exclusiveBeatsForSale') },
    { key: 'freeBeats', label: t('tabs.freeBeats') },
  ];

  const isConnected = useAppSelector((state) => state.network.isConnected);

  const getDynamicAvatarSource = () => {
    if (isConnected === false || !userProfile.avatar || userProfile.avatar.trim() === "") {
      return require("@/assets/images/Default_Profile_Icon/icon_profile_white_120px.png");
    }
    return { uri: userProfile.avatar };
  };

  const avatarUser = getDynamicAvatarSource()

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
  }, [dispatch, activeTab, userProfile, exclusiveBeatsForSale]); // Dependência atualizada


  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#191919' }}>
        {/* ... (containerTopBar e ScrollView de configuração) */}

        <View style={styles.containerTopBar}>
          <Text style={styles.titleTopBar}>{t('screens.profileTitle')}</Text>
          <View style={{ flexDirection: 'row', gap: 10, }}>
            <TouchableOpacity
              onPress={() => router.push('/notificationsScreens/notifications')}
              style={styles.buttonTopBar}
            >
              <Ionicons name="notifications" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/searchScreens/searchProfile')}
              style={styles.buttonTopBar}
            >
              <Ionicons name="search-outline" size={25} color="#fff" />
            </TouchableOpacity>
            {/* --- NOVO BOTÃO DE MENU/CONFIGURAÇÕES --- */}
            <TouchableOpacity
              onPress={openProfileModal} // Chama a função para abrir o modal
              style={styles.buttonTopBar}
            >
              {/* Ícone de menu ou três pontos (ellipsis-vertical) */}
              <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal={false}
          style={styles.scroll}
          contentContainerStyle={styles.container}
          showsHorizontalScrollIndicator={false}
        >
          {/* ... (Perfil e Stats) ... */}
          <View style={styles.profileContainer}>
            <View style={{ alignItems: 'center' }}>
              <View style={styles.imageContainer}>
                <Image source={avatarUser} style={styles.profileImage} />
              </View>
              <Text style={styles.userName}>{userProfile.name}</Text>
              <Text style={styles.userHandle}>{userProfile.username}</Text>
              <Text style={styles.userHandle}>{userProfile.bio}</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{userProfile.followingCount}</Text>
                <Text style={styles.statLabel}>{t('stats.following')}</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statValue}>{userProfile.followersCount}</Text>
                <Text style={styles.statLabel}>{t('stats.followers')}</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statValue}>{userProfile.singlesCount}</Text>
                <Text style={styles.statLabel}>{t('stats.singles')}</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statValue}>{userProfile.epsCount}</Text>
                <Text style={styles.statLabel}>{t('stats.eps')}</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statValue}>{userProfile.albumsCount}</Text>
                <Text style={styles.statLabel}>{t('stats.albums')}</Text>
              </View>
            </View>
          </View>

          {/* --- ABA DE NAVEGAÇÃO --- */}
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tabsContainer}
            >
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabButton, activeTab === tab.key && styles.activeTabButton]}
                  onPress={() => dispatch(setProfileActiveTab(tab.key))}
                >
                  <Text
                    style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* --- CONTEÚDO DA ABA ATIVA --- */}
          <View style={{ flex: 1, marginTop: 5 }}>
            {activeTab === 'single' && (
              // ... (FlatList de Singles)
              <FlatList
                data={userProfile.singles}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item }) => (
                  <SingleCard
                    item={item}
                    onPress={(selected) =>
                      router.push(`/contentCardLibraryScreens/single-details/${selected.id}`)
                    }
                  />
                )}
                ListEmptyComponent={() => (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.texto}>{t('profile.emptySingle')}</Text>
                  </View>
                )}
              />
            )}

            {activeTab === 'extendedPlay' && (
              // ... (FlatList de EPs)
              <FlatList
                data={userProfile.eps}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item }) => (
                  <EpCard
                    item={item}
                    onPress={(selected) =>
                      router.push(`/contentCardLibraryScreens/ep-details/${selected.id}`)
                    }
                  />
                )}
                ListEmptyComponent={() => (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.texto}>{t('profile.emptyEP')}</Text>
                  </View>
                )}
              />
            )}

            {activeTab === 'album' && (
              // ... (FlatList de Álbums)
              <FlatList
                data={userProfile.albums}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item }) => (
                  <AlbumCard
                    item={item}
                    onPress={(selected) =>
                      router.push(`/contentCardLibraryScreens/album-details/${selected.id}`)
                    }
                  />
                )}
                ListEmptyComponent={() => (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.texto}>{t('profile.emptyAlbum')}</Text>
                  </View>
                )}
              />
            )}

            {/* 🎧 NOVO CONTEÚDO DA ABA: BEATS COMPRADOS */}
            {activeTab === 'purchasedBeats' && (
              <FlatList
                data={purchasedBeats} // 🛑 Dados do purchasesSlice
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item }) => (
                  <ExclusiveBeatCard // Usamos o ExclusiveBeatCard para renderizar
                    item={item}
                    onPress={(selected) =>
                      // Navega para a tela de detalhes (agora com o botão Baixar)
                      router.push(`/contentCardBeatStoreScreens/exclusiveBeat-details/${selected.id}`)
                    }
                  />
                )}
                ListEmptyComponent={() => (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.texto}>{t('profile.emptyPurchasedBeats')}</Text>
                  </View>
                )}
              />
            )}

            {/* 💰 CONTEÚDO DA ABA: BEATS A VENDA (Ex-exclusiveBeats) */}
            {activeTab === 'exclusiveBeatsForSale' && (
              <FlatList
                data={exclusiveBeatsForSale}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item }) => (
                  <ExclusiveBeatCard
                    item={item}
                    onPress={(selected) =>
                      router.push({
                        pathname: '/TabProfileBeatScreens/ExclusiveBeatForSale/[id]',
                        params: { id: selected.id },
                      })
                    }
                  />
                )}
                ListEmptyComponent={() => (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.texto}>{t('profile.emptyExclusiveBeats')}</Text>
                  </View>
                )}
              />
            )}

            {activeTab === 'freeBeats' && (
              <FlatList
                data={userProfile.freeBeats}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item }) => (
                  <FreeBeatCard
                    item={item}
                    onPress={(selected) =>
                      router.push({
                        pathname: '/TabProfileBeatScreens/FreeBeat/[id]',
                        params: { id: selected.id },
                      })
                    }
                  />
                )}
                ListEmptyComponent={() => (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.texto}>{t('profile.emptyFreeBeats')}</Text>
                  </View>
                )}
              />
            )}
          </View>

        </ScrollView>
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

// ... (seus estilos omitidos para brevidade)

{/* Estilos dos componentes (mantidos inalterados) */ }
const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#191919',
  },
  container: {
    flexGrow: 1,
  },
  content: {
    flexDirection: 'row',
  },
  box: {
    width: 200,
    height: 200,
    marginRight: 20,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 200,
    borderRadius: 10
  },
  profileText: {
    color: '#fff',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  imageContainer: {
    flex: 1
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 75,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#1E90FF',
    resizeMode: 'stretch'
  },
  statsTable: {
    marginTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //marginBottom: 1,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    borderColor: '#0083D0',
    paddingVertical: 10,
    marginHorizontal: 5,
    padding: 10,
    margin: 10,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
  },
  statLabel: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
    flexWrap: 'wrap',
    marginLeft: 15,
    textAlign: 'center',
  },
  userHandle: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 2,
    marginLeft: 15,
    textAlign: 'center',
  },
  profileContainer: {
    paddingHorizontal: 15,
    width: '100%',
    alignSelf: 'center',
  },
  workButton: {
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#222',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    color: '#fff',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  buttonContainer: {
    //marginBottom: 5,
    //width: '100%',
    //backgroundColor: '#fff',
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  iconLeft: {
    width: 26,
    height: 26,
    marginRight: 10,
  },
  buttonText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },

  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    //backgroundColor: '#fff',
    padding: 10
    //height: 20,        // 🔹 altura fixa suficiente para os botões
  },

  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#222',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,   // altura fixa dos botões
    flexShrink: 0,
  },
  activeTabButton: {
    backgroundColor: '#1e90ff',
  },
  tabText: {
    color: '#aaa',
    fontSize: 14,
  },
  activeTabText: {
    color: '#fff',
  },

  containerTopBar: {
    paddingVertical: 20,             // Espaçamento vertical (topo e baixo)
    paddingHorizontal: 16,           // Espaçamento lateral (esquerda e direita)
    flexDirection: 'row',            // Organiza os itens em linha (horizontal)
    alignItems: 'center',            // Alinha verticalmente ao centro
    justifyContent: 'space-between',
  },
  buttonTopBar: {
    padding: 6,  // Espaçamento interno do botão
  },
  titleTopBar: {
    color: '#fff',
    fontSize: 20,
    //flex: 1,
    //textAlign: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});