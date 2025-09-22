// app/(tabs)/profile.tsx
import React, { useState, useCallback } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import TopTabBarProfile from '@/components/mainTopTabBars/topTabBarProfileScreen';
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


export default function ProfileScreen() {

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

  const [scaleValueInsight] = useState(new Animated.Value(1));
  const handlePressInInsight = () => { Animated.spring(scaleValueInsight, { toValue: 0.96, useNativeDriver: true }).start(); };
  const handlePressOutInsight = () => { Animated.spring(scaleValueInsight, { toValue: 1, useNativeDriver: true }).start(); };

  const [scaleValueNotification] = useState(new Animated.Value(1));
  const handlePressInNotification = () => { Animated.spring(scaleValueNotification, { toValue: 0.96, useNativeDriver: true }).start(); };
  const handlePressOutNotification = () => { Animated.spring(scaleValueNotification, { toValue: 1, useNativeDriver: true }).start(); };

  const [scaleValueMonetization] = useState(new Animated.Value(1));
  const handlePressInMonetization = () => { Animated.spring(scaleValueMonetization, { toValue: 0.96, useNativeDriver: true }).start(); };
  const handlePressOutMonetization = () => { Animated.spring(scaleValueMonetization, { toValue: 1, useNativeDriver: true }).start(); };

  const tabs = ['Single', 'Extended Play', 'Album', 'Beats Comprados', 'Exclusive Beats', 'Free Beats',];
  const [activeTab, setActiveTab] = useState('Single');

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
  }, [dispatch, activeTab, userProfile]);
  //Terminou aqui

  return (
    <View style={{ flex: 1, backgroundColor: '#191919' }}>
      <TopTabBarProfile />

      <ScrollView
        horizontal={false}
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
      >
        {/* View da visão Geral do perfil */}
        <View style={styles.profileContainer}>
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.imageContainer}>
              <Image // Imagem do perfil
                source={avatarUser}
                style={styles.profileImage}
                resizeMode="contain"
              />
            </View>

            {/* Mostrar o nome e o arroba do utilizador */}
            <View>
              <Text style={styles.userName}>{userProfile.name}</Text>
              <Text style={styles.userHandle}>{userProfile.username}</Text>
            </View>
          </View>

          {/* Estatísticas: seguindo, seguidores, singles, EPs, álbuns, vídeos */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userProfile.followingCount}</Text>
              <Text style={styles.statLabel}>Seguindo</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userProfile.followersCount}</Text>
              <Text style={styles.statLabel}>Seguidores</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userProfile.singlesCount}</Text>
              <Text style={styles.statLabel}>Singles</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userProfile.epsCount}</Text>
              <Text style={styles.statLabel}>EPs</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userProfile.albumsCount}</Text>
              <Text style={styles.statLabel}>Álbuns</Text>
            </View>

            {/* Novo stat para Vídeos 
             <View style={styles.statBox}>
              <Text style={styles.statValue}>{userProfile.videosCount}</Text>
              <Text style={styles.statLabel}>Vídeos</Text>
            </View>r
            
            */}

          </View>
        </View>

        {/* View das configurações do perfil */}
        <Animated.View style={[
          styles.buttonContainer,
          { transform: [{ scale: scaleValueConfig }] }
        ]}>
          <TouchableOpacity
            onPressIn={handlePressInConfig}
            onPressOut={handlePressOutConfig}
            onPress={() => router.push('/profileScreens/useProfileSettingsScreen')}  //Tela de configurações
            style={styles.buttonContent}
          >
            <Image
              source={require('@/assets/images/2/icons8_user_settings_120px.png')}
              style={styles.iconLeft}
            />
            <Text style={styles.buttonText}>Configurações</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* View do botão para entrar na tela de monetização */}
        <Animated.View style={[
          styles.buttonContainer,
          { transform: [{ scale: scaleValueMonetization }] }
        ]}>
          <TouchableOpacity
            onPressIn={handlePressInMonetization}
            onPressOut={handlePressOutMonetization}
            onPress={() => router.push('/profileScreens/useMonetizationScreen')} //Tela de monetização
            style={styles.buttonContent}
          >
            <Image
              source={require('@/assets/images/2/icons8_euro_money_120px.png')}
              style={styles.iconLeft}
            />
            <Text style={styles.buttonText}>Kiuplay Monetization</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* View do botão Fazer Uploads */}
        <Animated.View style={[
          styles.buttonContainer,
          { transform: [{ scale: scaleValueUploads }] }
        ]}>
          <TouchableOpacity
            onPressIn={handlePressInUploads}
            onPressOut={handlePressOutUploads}
            onPress={() => router.push('/profileScreens/useOptionsPostsScreen')} //Tela de Tipo de posts
            style={styles.buttonContent}
          >
            <Image
              source={require('@/assets/images/2/icons8_upload_to_cloud_120px.png')}
              style={styles.iconLeft}
            />
            <Text style={styles.buttonText}>Fazer Uploads</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* View do botão Insight */}
        <Animated.View style={[
          styles.buttonContainer,
          { transform: [{ scale: scaleValueInsight }] }
        ]}>
          <TouchableOpacity
            onPressIn={handlePressInInsight}
            onPressOut={handlePressOutInsight}
            onPress={() => router.push('/profileScreens/useInsightsUserScreen')} //Tela de Insights
            style={styles.buttonContent}
          >
            <Image
              source={require('@/assets/images/2/icons8_funnel_120px_1.png')}
              style={styles.iconLeft}
            />
            <Text style={styles.buttonText}>Seus Insights</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* View do botão Notificaçoee */}
        <Animated.View style={[
          styles.buttonContainer,
          { transform: [{ scale: scaleValueNotification }] }
        ]}>
          <TouchableOpacity
            onPressIn={handlePressInNotification}
            onPressOut={handlePressOutNotification}
            onPress={() => router.push('/notificationsScreens/notifications')} //Tela de noticaões
            style={styles.buttonContent}
          >
            <Image
              source={require('@/assets/images/2/icons8_notification_120px.png')}
              style={styles.iconLeft}
            />
            <Text style={styles.buttonText}>Notificações</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* View dos conteúdos do usuário */}
        <View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
          }}></View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsContainer}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{ marginTop: 20 }}>
            {activeTab === 'Single' && (
              <View style={{ flex: 1, paddingHorizontal: 10, }}>
                <FlatList
                  data={userProfile.singles} // pega os singles do artista
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  columnWrapperStyle={{ justifyContent: "space-between" }}
                  renderItem={({ item }) => (
                    <SingleCard
                      item={item}
                      onPress={(selected) =>
                        router.push(`/contentCardLibraryScreens/single-details/${selected.id}`)
                      }
                    />
                  )}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  ListEmptyComponent={() => (
                    <Text style={styles.texto}>Nenhum single publicado ainda.</Text>
                  )}
                />
              </View>
            )}

            {activeTab === 'Extended Play' && (
              <View style={{ flex: 1, paddingHorizontal: 10, }}>
                {/**<Text style={styles.texto}>🎧 Mostrando Extended Plays</Text>*/}
                <FlatList
                  data={userProfile.eps}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  columnWrapperStyle={{ justifyContent: "space-between" }}
                  renderItem={({ item }) => (
                    <EpCard
                      item={item}
                      onPress={(selected) =>
                        router.push(`/contentCardLibraryScreens/ep-details/${selected.id}`)
                      }
                    />
                  )}
                  ListEmptyComponent={() => (
                    <Text style={styles.texto}>Nenhum EP publicado ainda.</Text>
                  )}
                />
              </View>
            )}
            {activeTab === 'Album' && (
              <View style={{ flex: 1, paddingHorizontal: 10, }}>
                <FlatList
                  data={userProfile.albums}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  columnWrapperStyle={{ justifyContent: "space-between" }}
                  renderItem={({ item }) => (
                    <AlbumCard
                      item={item}
                      onPress={(selected) =>
                        router.push(`/contentCardLibraryScreens/album-details/${selected.id}`)
                      }
                    />
                  )}
                  ListEmptyComponent={() => (
                    <Text style={styles.texto}>Nenhum Album publicado ainda.</Text>
                  )}
                />
              </View>
            )}
            {activeTab === 'Beats Comprados' && ( //beats comprados
              <View>

              </View>
            )}
            {activeTab === 'Exclusive Beats' && (
              <View style={{ flex: 1, paddingHorizontal: 10, }}>
                <FlatList
                  data={userProfile.exclusiveBeats}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  columnWrapperStyle={{ justifyContent: "space-between" }}
                  renderItem={({ item }) => (
                    <ExclusiveBeatCard
                      item={item}
                      onPress={(selected) =>
                        router.push(`/contentCardBeatStoreScreens/exclusiveBeat-details/ ${selected.id}`)
                      }
                    />
                  )}
                  ListEmptyComponent={() => (
                    <Text style={styles.texto}>Nenhum Beat publicado ainda.</Text>
                  )}
                />
              </View>
            )}
            {activeTab === 'Free Beats' && (
              <View style={{ flex: 1, paddingHorizontal: 10, }}>
                <FlatList
                  data={userProfile.freeBeats}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  columnWrapperStyle={{ justifyContent: "space-between" }}
                  renderItem={({ item }) => (
                    <FreeBeatCard
                      item={item}
                      onPress={(selected) =>
                        router.push(`/contentCardBeatStoreScreens/freeBeat-details/${selected.id}`)
                      }
                    />
                  )}
                  ListEmptyComponent={() => (
                    <Text style={styles.texto}>Nenhum Free Beat publicado ainda.</Text>
                  )}
                />
              </View>
            )}
          </View>
        </View>
        <View style={{ height: 130 }}></View>
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
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#333',
    marginBottom: 20,
  },
  profileImage: {
    width: '100%',
    height: '100%',
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
    backgroundColor: '#1e1e1e',
    padding: 30,
    margin: 5,
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
  buttonContainer: {
    marginBottom: 5,
    width: '100%',
    backgroundColor: '#1e1e1e',
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  iconLeft: {
    width: 25,
    height: 25,
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
});