// app/(tabs)/profile.tsx
import React, { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MOCKED_PROFILE } from '@/src/types/contentServer'
import SingleCard from '@/components/musicItems/singleItem/SingleCard';
import EpCard from '@/components/musicItems/epItem/EpCard';
import AlbumCard from '@/components/musicItems/albumItem/AlbumCard';
import ExclusiveBeatCard from '@/components/musicItems/exclusiveBeatItem/ExclusiveBeatCard';
import FreeBeatCard from '@/components/musicItems/freeBeatItem/FreeBeatCard';
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


export default function ProfileScreen() {

  const { t, language, setLanguage } = useTranslation(); // Hook de tradução
  const dispatch = useAppDispatch();
  const { isPlaying, isLoading, } = useAppSelector((state) => state.player);
  const [currentTabPlaying, setCurrentTabPlaying] = useState<string | null>(null);
  // --- DADOS MOCADOS DO PERFIL ---
  const userProfile = MOCKED_PROFILE[0]
  // ------------------------------

  /**
   * Função auxiliar que verifica se um tipo de conteúdo está atualmente selecionado.
   * @param current - Conteúdo atualmente selecionado.
   * @param type - Tipo a ser verificado.
   * @returns true se for o mesmo tipo, false caso contrário.
   */

  // Hooks para os botões de animação (mantidos do seu código original)
  const [scaleValueConfig] = useState(new Animated.Value(1));
  const handlePressInConfig = () => { Animated.spring(scaleValueConfig, { toValue: 0.96, useNativeDriver: true }).start(); };
  const handlePressOutConfig = () => { Animated.spring(scaleValueConfig, { toValue: 1, useNativeDriver: true }).start(); };

  const [scaleValueUploads] = useState(new Animated.Value(1));
  const handlePressInUploads = () => { Animated.spring(scaleValueUploads, { toValue: 0.96, useNativeDriver: true }).start(); };
  const handlePressOutUploads = () => { Animated.spring(scaleValueUploads, { toValue: 1, useNativeDriver: true }).start(); };

  {/**const [scaleValueInsight] = useState(new Animated.Value(1));
  const handlePressInInsight = () => { Animated.spring(scaleValueInsight, { toValue: 0.96, useNativeDriver: true }).start(); };
  const handlePressOutInsight = () => { Animated.spring(scaleValueInsight, { toValue: 1, useNativeDriver: true }).start(); };
 */ }

  {/** const [scaleValueMonetization] = useState(new Animated.Value(1));
  const handlePressInMonetization = () => { Animated.spring(scaleValueMonetization, { toValue: 0.96, useNativeDriver: true }).start(); };
  const handlePressOutMonetization = () => { Animated.spring(scaleValueMonetization, { toValue: 1, useNativeDriver: true }).start(); };*/}

  const tabs = [
    { key: 'single', label: t('tabs.single') },
    { key: 'extendedPlay', label: t('tabs.extendedPlay') },
    { key: 'album', label: t('tabs.album') },
    { key: 'purchasedBeats', label: t('tabs.purchasedBeats') },
    { key: 'exclusiveBeats', label: t('tabs.exclusiveBeats') },
    { key: 'freeBeats', label: t('tabs.freeBeats') },
  ];

  const [activeTab, setActiveTab] = useState('single');

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
      case "Single":
        return userProfile.singles;
      case "Exclusive Beats":
        return userProfile.exclusiveBeats;
      case "Free Beats":
        return userProfile.freeBeats;
      default:
        // Se o utilizador estiver noutra aba → usa Singles como padrão
        return userProfile.singles;
    }
  };

  const handlePlayFromTab = useCallback(() => {
    const tracks = getTracksForActiveTab();

    if (!tracks || tracks.length === 0) {
      Alert.alert("Erro", "Não há faixas disponíveis nesta aba.");
      return;
    }

    dispatch(setPlaylistAndPlayThunk({
      newPlaylist: tracks,
      startIndex: 0,
      shouldPlay: true,
    }));
  }, [dispatch, activeTab, userProfile]); //Terminou aqui


  const purchasedBeats = useAppSelector((state) => state.beatStore.purchasedBeats);

  return (
    <View style={{ flex: 1, backgroundColor: '#191919' }}>
      <View style={styles.containerTopBar}>
        <Text style={styles.titleTopBar}>{t('screens.profileTitle')}</Text>

        <View style={{ flexDirection: 'row', gap: 8 }}>
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
        </View>
      </View>

      <ScrollView
        horizontal={false}
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.profileContainer}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.imageContainer}>
              <Image source={avatarUser} style={styles.profileImage} resizeMode="contain" />
            </View>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.userHandle}>{userProfile.username}</Text>
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

        <View>
          <Animated.View
            style={[styles.buttonContainer, { transform: [{ scale: scaleValueConfig }] }]}
          >
            <TouchableOpacity
              onPressIn={handlePressInConfig}
              onPressOut={handlePressOutConfig}
              onPress={() => router.push('/profileScreens/useProfileSettingsScreen')}
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

          <Animated.View
            style={[styles.buttonContainer, { transform: [{ scale: scaleValueUploads }] }]}
          >
            <TouchableOpacity
              onPressIn={handlePressInUploads}
              onPressOut={handlePressOutUploads}
              onPress={() => router.push('/profileScreens/useOptionsPostsScreen')}
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
        </View>

        <View style={{ marginTop: 10 }} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, activeTab === tab.key && styles.activeTabButton]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ marginTop: 8 }}>
          {activeTab === 'single' && (
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

          {activeTab === 'purchasedBeats' && (
            <FlatList
              data={purchasedBeats}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={({ item }) => (
                <ExclusiveBeatCard
                  item={item}
                  onPress={(selected) =>
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

          {activeTab === 'exclusiveBeats' && (
            <FlatList
              data={userProfile.exclusiveBeats}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={({ item }) => (
                <ExclusiveBeatCard
                  item={item}
                  onPress={(selected) =>
                    router.push(`/contentCardBeatStoreScreens/exclusiveBeat-details/${selected.id}`)
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
                    router.push(`/contentCardBeatStoreScreens/freeBeat-details/${selected.id}`)
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
        <View style={{ height: 130 }} />
      </ScrollView>
    </View>
  );
}

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
    //backgroundColor: '#1e1e1e',
    padding: 20,
    //margin: 5,
    width: '100%',
    alignSelf: 'center',
    marginTop: -20,
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
    paddingVertical: 50,
  },
  buttonContainer: {
    marginBottom: 5,
    width: '100%',
    //backgroundColor: '#1e1e1e',
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
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#222',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
    //backgroundColor: '#1e1e1e',      // Cor de fundo escura
    paddingVertical: 20,             // Espaçamento vertical (topo e baixo)
    paddingHorizontal: 16,           // Espaçamento lateral (esquerda e direita)
    //borderBottomWidth: 1,            // Borda inferior com 1 pixel
    //borderColor: '#191919',             // Cor da borda inferior (cinza escuro)
    flexDirection: 'row',            // Organiza os itens em linha (horizontal)
    alignItems: 'center',            // Alinha verticalmente ao centro
    //width: '100%'
  },
  buttonTopBar: {
    padding: 6,  // Espaçamento interno do botão
  },
  titleTopBar: {
    color: '#fff',
    fontSize: 20,
    flex: 1,
    //textAlign: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});