// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import { useSelectedMyContent, MyPostsType } from '@/hooks/useSelectedMyContent';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import TopTabBarProfile from '@/components/topTabBarProfileScreen';
import { MOCKED_PROFILE } from '@/src/types/contentServer'
import SingleCard from '@/components/musicItems/singleItem/SingleCard';
import EpCard from '@/components/musicItems/epItem/EpCard';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  FlatList,
} from 'react-native';
import { useAppSelector } from "@/src/redux/hooks";

export default function ProfileScreen() {
  // --- DADOS MOCADOS DO PERFIL ---
  const userProfile = MOCKED_PROFILE[0]
  // ------------------------------

  /**
   * Função auxiliar que verifica se um tipo de conteúdo está atualmente selecionado.
   * @param current - Conteúdo atualmente selecionado.
   * @param type - Tipo a ser verificado.
   * @returns true se for o mesmo tipo, false caso contrário.
   */
  const isSelected = (current: MyPostsType, type: MyPostsType): boolean => {
    return current === type;
  };

  // Hook que verifica se um botão dos meus conteúdos está checked
  const { selectedProfileMyContent, setSelectedProfileMyContent } = useSelectedMyContent();

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

  const isConnected = useAppSelector((state) => state.network.isConnected);

  const getDynamicAvatarSource = () => {
    if (isConnected === false || !userProfile.avatar || userProfile.avatar.trim() === "") {
      return require("@/assets/images/Default_Profile_Icon/icon_profile_white_120px.png");
    }
    return { uri: userProfile.avatar };
  };

  const avatarUser = getDynamicAvatarSource()

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
          <Text style={{ color: '#fff', marginBottom: 5, fontSize: 17, marginLeft: 5 }}>Meus Posts</Text>
          <ScrollView horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 8, marginLeft: 1 }}
          >
            {/* Botão para os Singles */}
            <TouchableOpacity
              style={[
                styles.workButton,
                isSelected(selectedProfileMyContent, 'single') && styles.workButtonSelected
              ]}
              onPress={() => setSelectedProfileMyContent('single')}>
              <Image source={require('@/assets/images/3/icons8_musical_120px.png')} style={{ width: 23, height: 20, marginRight: 8 }} />
              <Text style={styles.workButtonText}>Faixa single</Text>
            </TouchableOpacity>

            {/* Botão para as EPs */}
            <TouchableOpacity
              style={[
                styles.workButton,
                isSelected(selectedProfileMyContent, 'eps') && styles.workButtonSelected
              ]}
              onPress={() => setSelectedProfileMyContent('eps')}>
              <Image source={require('@/assets/images/3/icons8_music_record_120px.png')} style={{ width: 20, height: 20, marginRight: 8 }} />
              <Text style={styles.workButtonText}>Extended Play (EPs)</Text>
            </TouchableOpacity>

            {/* Botão para os Álbuns */}
            <TouchableOpacity
              style={[
                styles.workButton,
                isSelected(selectedProfileMyContent, 'albums') && styles.workButtonSelected
              ]}
              onPress={() => setSelectedProfileMyContent('albums')}>
              <Image source={require('@/assets/images/3/icons8_music_album_120px.png')} style={{ width: 23, height: 20, marginRight: 8 }} />
              <Text style={styles.workButtonText}>Álbuns</Text>
            </TouchableOpacity>

            {/* Instrumentais comprados */}
            <TouchableOpacity
              style={[
                styles.workButton,
                isSelected(selectedProfileMyContent, 'beats_bought') && styles.workButtonSelected
              ]}
              onPress={() => setSelectedProfileMyContent('beats_bought')}>
              <Image source={require('@/assets/images/3/icons8_paycheque_120px.png')} style={{ width: 23, height: 20, marginRight: 8 }} />
              <Text style={styles.workButtonText}>Instrumentais comprados</Text>
            </TouchableOpacity>

            {/* Instrumentais Postados */}
            <TouchableOpacity
              style={[
                styles.workButton,
                isSelected(selectedProfileMyContent, 'exclusive_beats') && styles.workButtonSelected
              ]}
              onPress={() => setSelectedProfileMyContent('exclusive_beats')}>
              <Image source={require('@/assets/images/3/icons8_vox_player_120px.png')} style={{ width: 23, height: 20, marginRight: 8 }} />
              <Text style={styles.workButtonText}>Instrumentais Exclusivos</Text>
            </TouchableOpacity>

            {/* free_beats */}
            <TouchableOpacity
              style={[
                styles.workButton,
                isSelected(selectedProfileMyContent, 'free_beats') && styles.workButtonSelected
              ]}
              onPress={() => setSelectedProfileMyContent('free_beats')}>
              <Image source={require('@/assets/images/3/icons8_dj_120px.png')} style={{ width: 20, height: 20, marginRight: 8 }} />
              <Text style={styles.workButtonText}>Instrumentais Free</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={{ marginTop: 10 }}>
            {selectedProfileMyContent === "single" && (
              <View style={{ flex: 1, paddingHorizontal: 10, }}>
                {/** <Text style={styles.texto}>🔊 Mostrando faixas single</Text>*/}
                <FlatList
                  data={MOCKED_PROFILE[0].singles} // pega os singles do artista
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  columnWrapperStyle={{ justifyContent: "space-between" }}
                  renderItem={({ item }) => (
                    <SingleCard
                      item={item}
                      onPress={(selected) =>
                        router.push(`/contentCardLibraryScreens/single-details/${item.id}`)
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

            {selectedProfileMyContent === "eps" && (
              <View style={{ flex: 1, paddingHorizontal: 10, }}>
                {/**<Text style={styles.texto}>🎧 Mostrando Extended Plays</Text>*/}

                <FlatList
                  data={MOCKED_PROFILE[0].eps}
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
            {selectedProfileMyContent === 'albums' && (
              <Text style={styles.texto}>💿 Mostrando Álbuns</Text>
            )}
            {selectedProfileMyContent === 'beats_bought' && ( //beats comprados
              <Text style={styles.texto}>🎶 Mostrando Instrumentais comprados </Text>
            )}
            {selectedProfileMyContent === 'exclusive_beats' && (
              <Text style={styles.texto}>🎹 Mostrando Instrumentais exclusivos</Text>
            )}
            {selectedProfileMyContent === 'free_beats' && (
              <Text style={styles.texto}>🎬 Mostrando instrumentais free</Text>
            )}
          </View>
        </View>
        <View style={{ height: 120 }}></View>
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
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 10,
    paddingLeft: 4,
    height: 30,
    borderRadius: 6,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start'
  },
  workButtonSelected: {
    backgroundColor: '#1565C0',
  },
  workButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    paddingLeft: 2,
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
});