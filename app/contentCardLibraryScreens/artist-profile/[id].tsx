// app/contentCardLibraryScreens/artist-profile/[id].tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux'; // NOVO: Importa hooks do Redux
import { RootState } from '@/src/redux/store'; // NOVO: Importa RootState
import { addFollowedArtist, removeFollowedArtist, FollowedArtist } from '@/src/redux/followedArtistsSlice';
import { MOCKED_CLOUD_FEED_DATA } from '@/src/types/contentServer';
import { ArtistProfile, } from '@/src/types/contentType'; // Importado Single também
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { setPlaylistAndPlayThunk, } from '@/src/redux/playerSlice';
import { Ionicons } from '@expo/vector-icons';

import SingleCard from '@/components/musicItems/singleItem/SingleCard';
import EpCard from '@/components/musicItems/epItem/EpCard';
import AlbumCard from '@/components/musicItems/albumItem/AlbumCard';
import ExclusiveBeatCard from '@/components/musicItems/exclusiveBeatItem/ExclusiveBeatCard';
import FreeBeatCard from '@/components/musicItems/freeBeatItem/FreeBeatCard';

import { useTranslation } from '@/src/translations/useTranslation';


export default function ArtistProfileScreen() {

  const { t } = useTranslation()

  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch(); // NOVO: Inicializa useDispatch
  const followedArtists = useSelector((state: RootState) => state.followedArtists.artists); // NOVO: Obtém artistas seguidos do Redux

  const ArtistData = MOCKED_CLOUD_FEED_DATA.find(
    (item) => item.id === id && item.category === 'artist'
  ) as ArtistProfile | undefined;

  if (!id || !ArtistData) {
    return (
      <View style={styles.errorContainer}> {/* Alterado para errorContainer para consistência */}
        <Stack.Screen options={{ headerShown: false }} /> {/* Esconde o cabeçalho padrão */}
        <Text style={styles.errorText}>{t('artistProfile.notFound')}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>{t('artistProfile.back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const currentArtist: ArtistProfile = ArtistData;

  //const tabs = ['Single', 'Extended Play', 'Album', 'Free Beats', 'Exclusive Beats'];
  const tabs = [
    t('artistProfile.tabs.single'),
    t('artistProfile.tabs.ep'),
    t('artistProfile.tabs.album'),
    t('artistProfile.tabs.freeBeats'),
    t('artistProfile.tabs.exclusiveBeats'),
  ];
  const [activeTab, setActiveTab] = useState('Single');

  // NOVO: Verifica se o artista atual é seguido
  const isFollowing = followedArtists.some(artist => artist.id === currentArtist.id);


  // NOVO: Função para alternar o status de seguir
  const handleToggleFollow = () => {
    if (isFollowing) {
      dispatch(removeFollowedArtist(currentArtist.id));
      console.log(`Deixou de seguir: ${currentArtist.name}`);
    } else {
      // Cria um objeto FollowedArtist com os dados necessários
      const artistToFollow: FollowedArtist = {
        id: currentArtist.id,
        name: currentArtist.name,
        profileImageUrl: currentArtist.avatar,
        // Adicione outras propriedades se a interface FollowedArtist exigir
      };
      dispatch(addFollowedArtist(artistToFollow));
      console.log(`Começou a seguir: ${currentArtist.name}`);
    }
  };

  const isConnected = useAppSelector((state) => state.network.isConnected);

  const getDynamicUserAvatar = () => {
    if (isConnected === false || !currentArtist.avatar || currentArtist.avatar.trim() === '') {
      return require('@/assets/images/Default_Profile_Icon/icon_profile_white_120px.png');
    }
    return { uri: currentArtist.avatar };
  };
  const artistAvatarSrc = getDynamicUserAvatar();


  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header Bar (Voltar e Artista Info) */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
        horizontal={false}
      >
        <Image source={artistAvatarSrc} style={styles.artistAvatar} />

        <Text style={styles.artistNameProfile}>{currentArtist.name}</Text>

        <Text style={styles.artistUserName}>{currentArtist.username}</Text>

        {currentArtist.genres !== undefined && (
          <Text style={styles.artistGenres}>{t('artistProfile.genreLine', {
            category: currentArtist.category || '',
            genres: currentArtist.genres || '',
            year: currentArtist.releaseYear || ''
          })}</Text>
        )}

        {currentArtist.followersCount !== undefined && (
          <Text style={styles.artistFollowers}>{t('artistProfile.followersLine', {
            followers: currentArtist.followersCount ?? 0,
            following: currentArtist.followingCount ?? 0
          })}</Text>

        )}

        <View style={{ flexDirection: 'row' }}>

          {/* NOVO: Botão de Seguir/Deixar de Seguir dinâmico */}
          <TouchableOpacity
            style={[styles.buttonFollowers, isFollowing ? styles.buttonFollowing : styles.buttonFollow]}
            onPress={handleToggleFollow}
          >
            <Text style={styles.buttonText}>{isFollowing ? t('artistProfile.following') : t('artistProfile.follow')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal={true}
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

        <View>
          {activeTab === 'Single' && (
            <FlatList
              data={currentArtist.singles} // pega os singles do artista
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
                <View style={styles.emptyContainer}>
                  <Text style={styles.texto}>{t('artistProfile.empty.single')}</Text>
                </View>
              )}
            />
          )}

          {activeTab === 'Album' && (
            <FlatList
              data={currentArtist.albums}
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
                <View style={styles.emptyContainer}>
                  <Text style={styles.texto}>{t('artistProfile.empty.album')}</Text>
                </View>
              )}
            />
          )}
          {activeTab === 'Extended Play' && (
            <FlatList
              data={currentArtist.eps}
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
                <View style={styles.emptyContainer}>
                  <Text style={styles.texto}>{t('artistProfile.empty.ep')}</Text>
                </View>

              )}
            />
          )}
          {activeTab === 'Free Beats' && (
            <FlatList
              data={currentArtist.freeBeats}
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
                <View style={styles.emptyContainer}>
                  <Text style={styles.texto}>{t('artistProfile.empty.freeBeats')}</Text>
                </View>
              )}
            />
          )}
          {activeTab === 'Exclusive Beats' && (
            <FlatList
              data={currentArtist.exclusiveBeats}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
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
                  <Text style={styles.texto}>{t('artistProfile.empty.exclusiveBeats')}</Text>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  artistAvatar: {
    width: 120,
    height: 120,
    borderRadius: 75,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#1E90FF',
  },
  artistNameProfile: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  artistUserName: {
    fontSize: 15,
    color: '#bbb',
    marginBottom: 5,
  },
  artistFollowers: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 5,
  },
  artistGenres: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 5,
  },
  artistBio: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  headerBar: {
    marginTop: 39,
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 25,
    flexDirection: 'row',
  },
  buttonFollowers: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 30,
    minWidth: 150, // Garante que o botão tenha um tamanho mínimo
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonVideo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // NOVO: Estilo para quando o botão está no estado "Seguir"
  buttonFollow: {
    backgroundColor: '#1E90FF',
  },
  // NOVO: Estilo para quando o botão está no estado "Seguindo"
  buttonFollowing: {
    backgroundColor: '#333', // Uma cor mais neutra para indicar que já está seguindo
    borderWidth: 1,
    borderColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    marginBottom: 15,
  },
  contentList: {
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  contentItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 120,
  },
  contentCover: {
    width: 100,
    height: 100,
    borderRadius: 4,
    marginBottom: 8,
  },
  contentTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  contentType: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#1E90FF',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#191919',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  trackListContent: {
    paddingBottom: 100,
  },
  emptyListText: {
    color: '#bbb',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
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


  tabsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  tabButton: {
    paddingHorizontal: 12,
    borderRadius: 20,
    paddingVertical: 8,
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