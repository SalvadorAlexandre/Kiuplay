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
// 🆕 NOVO IMPORT: Importa o tipo ExclusiveBeat
import { ExclusiveBeat } from '@/src/types/contentType';


export default function ProfileScreen() {

  const { t, language, setLanguage } = useTranslation();
  const dispatch = useAppDispatch();
  const { isPlaying, isLoading, } = useAppSelector((state) => state.player);
  const [currentTabPlaying, setCurrentTabPlaying] = useState<string | null>(null);

  // --- DADOS MOCADOS DO PERFIL ---
  const userProfile = MOCKED_PROFILE[0]
  // ------------------------------

  // 🛑 AJUSTE 1: USAR O SLICE CORRETO PARA BEATS COMPRADOS
  // Agora puxamos diretamente do purchasesSlice, que é a biblioteca do usuário comprador.
  const purchasedBeats = useAppSelector((state) => state.purchases.items);

  // Lista de IDs dos beats comprados para FILTRAGEM. 
  // Em uma aplicação real, você usaria o beatStoreSlice (com a ação markBeatAsSold) para saber quais beats
  // deste artista foram marcados como 'vendidos' ou 'não disponíveis'.
  // Para esta simulação, vamos usar a lista de beats COMPRADOS pelo *próprio* usuário como mock para beats vendidos (embora a lógica real seja inversa).
  const soldBeatIds = useAppSelector((state) => state.purchases.items.map(beat => beat.id));


  // ---------------------------------------------------------
  // 🆕 LÓGICA DE FILTRAGEM
  // Filtra os beats exclusivos do artista (a venda) para remover aqueles que já foram comprados
  // (A compra por A deve remover o beat da aba 'a venda' do perfil do VENDEDOR B, mas aqui estamos assumindo
  // que o MOCKED_PROFILE[0] *é* o utilizador logado e vamos usar a lista de IDs comprados como um mock.
  // O ideal seria usar o estado global do BeatStore filtrado por artistId.)

  // Garante que 'userProfile.exclusiveBeats' seja um array antes de chamar '.filter'
  const exclusiveBeatsForSale = (userProfile.exclusiveBeats ?? [])
    .filter((beat) => !soldBeatIds.includes(beat.id));
  // ---------------------------------------------------------

  // Hooks para os botões de animação (mantidos do seu código original)
  const [scaleValueConfig] = useState(new Animated.Value(1));
  const handlePressInConfig = () => { Animated.spring(scaleValueConfig, { toValue: 0.96, useNativeDriver: true }).start(); };
  const handlePressOutConfig = () => { Animated.spring(scaleValueConfig, { toValue: 1, useNativeDriver: true }).start(); };

  const [scaleValueUploads] = useState(new Animated.Value(1));
  const handlePressInUploads = () => { Animated.spring(scaleValueUploads, { toValue: 0.96, useNativeDriver: true }).start(); };
  const handlePressOutUploads = () => { Animated.spring(scaleValueUploads, { toValue: 1, useNativeDriver: true }).start(); };


  // 🛑 AJUSTE 2: NOVAS ABAS DE BEATS
  const tabs = [
    { key: 'single', label: t('tabs.single') },
    { key: 'extendedPlay', label: t('tabs.extendedPlay') },
    { key: 'album', label: t('tabs.album') },
    { key: 'purchasedBeats', label: t('tabs.purchasedBeats') }, // 🎧 Beats comprados por mim
    { key: 'exclusiveBeatsForSale', label: t('tabs.exclusiveBeatsForSale') }, // 💰 Beats A VENDA (vendidos por mim)
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
    <View style={{ flex: 1, backgroundColor: '#191919' }}>
      {/* ... (containerTopBar e ScrollView de configuração) */}
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
        {/* ... (Perfil e Stats) ... */}
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

        {/* ... (Botões de Configurações e Uploads) ... */}
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

        {/* --- ABA DE NAVEGAÇÃO --- */}
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

        {/* --- CONTEÚDO DA ABA ATIVA --- */}
        <View style={{ marginTop: 8 }}>
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
              data={exclusiveBeatsForSale} // 🛑 Lista FILTRADA
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={({ item }) => (
                <ExclusiveBeatCard
                  item={item}
                  onPress={(selected) =>
                    // Mantém a navegação para os detalhes do beat
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
            // ... (FlatList de FreeBeats)
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