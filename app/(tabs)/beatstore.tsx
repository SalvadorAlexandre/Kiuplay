// app/(tabs)/beatstore.tsx
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
// Ionicons ainda é necessário para outros ícones na tela principal (chevrons, etc.)
import { Ionicons } from '@expo/vector-icons';

import TopTabBarBeatStore from '@/components/topTabBarBeatStoreScreen';
import useBeatStoreTabs from '@/hooks/useBeatStoreTabs';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { Track, playTrackThunk, setPlaylistAndPlayThunk } from '@/src/redux/playerSlice';
import { addFavoriteMusic, removeFavoriteMusic } from '@/src/redux/favoriteMusicSlice';
// NOVO: Importa o componente BeatStoreMusicItem
import BeatStoreMusicItem from '@/components/musicItems/beatStoreItem/BeatStoreMusicItem';

// NOVO: Dados mockados para beats da Beat Store (Feeds e Seguindo)
// Estes dados devem ter a propriedade 'source' definida corretamente
const MOCKED_BEATSTORE_MUSIC_DATA: Track[] = [
  {
    id: 'beat-store-1',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    title: 'Trap Beat - "Midnight Groove"',
    artist: 'Producer X',
    cover: 'https://placehold.co/150x150/8A2BE2/FFFFFF?text=BeatX',
    artistAvatar: 'https://i.pravatar.cc/150?img=10',
    source: 'beatstore-feeds', // Origem: Feeds da Beat Store
    duration: 180000,
  },
  {
    id: 'beat-store-2',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    title: 'Boom Bap - "Golden Era"',
    artist: 'HipHop Pro',
    cover: 'https://placehold.co/150x150/DAA520/000000?text=BeatY',
    artistAvatar: 'https://i.pravatar.cc/150?img=11',
    source: 'beatstore-feeds', // Origem: Feeds da Beat Store
    duration: 210000,
  },
  {
    id: 'beat-store-3',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    title: 'Afrobeat - "Vibes Tropicais"',
    artist: 'Afro Maestro',
    cover: 'https://placehold.co/150x150/3CB371/FFFFFF?text=AfroZ',
    artistAvatar: 'https://i.pravatar.cc/150?img=12',
    source: 'beatstore-seguindo', // Origem: Artistas Seguindo da Beat Store
    duration: 240000,
  },
  {
    id: 'beat-store-4',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    title: 'Drill Type Beat - "Dark Alley"',
    artist: 'Urban Soundz',
    cover: 'https://placehold.co/150x150/4B0082/FFFFFF?text=DrillA',
    artistAvatar: 'https://i.pravatar.cc/150?img=13',
    source: 'beatstore-feeds', // Origem: Feeds da Beat Store
    duration: 150000,
  },
  {
    id: 'beat-store-5',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    title: 'Drill Type Beat - "Dark Alley"',
    artist: 'Urban Soundz',
    cover: 'https://placehold.co/150x150/4B0082/FFFFFF?text=DrillA',
    artistAvatar: 'https://i.pravatar.cc/150?img=13',
    source: 'beatstore-feeds', // Origem: Feeds da Beat Store
    duration: 150000,
  },
];

export default function BeatStoreScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { activeTab, handleTabChange } = useBeatStoreTabs();

  const favoritedMusics = useAppSelector((state) => state.favoriteMusic.musics);
  const { currentTrack, currentIndex, playlist } = useAppSelector((state) => state.player);

  const favoritedBeatStoreMusics = favoritedMusics.filter(
    (music) =>
      music.source === 'beatstore-curtidas' || music.source === 'beatstore-seguindo' || music.source === 'beatstore-feeds'
  );

  const handleToggleFavorite = (music: Track) => {
    const isFavorited = favoritedMusics.some((favMusic) => favMusic.id === music.id);
    if (isFavorited) {
      dispatch(removeFavoriteMusic(music.id));
    } else {
      dispatch(addFavoriteMusic(music));
    }
  };

  const handlePlayMusic = (music: Track) => {
    const isAlreadyPlaying = currentTrack?.id === music.id && playlist.some(t => t.id === music.id);

    if (isAlreadyPlaying) {
      dispatch(playTrackThunk(currentIndex));
    } else {
      dispatch(
        setPlaylistAndPlayThunk({
          newPlaylist: [music],
          startIndex: 0,
          shouldPlay: true,
        })
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#191919' }}>
      {/* Topo fixo */}
      <TopTabBarBeatStore />

      {/* Tabs de navegação */}
      <View style={styles.tabsContainer}>
        {['feeds', 'curtidas', 'seguindo'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => handleTabChange(tab as 'feeds' | 'curtidas' | 'seguindo')}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        horizontal={false}
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
      >
        {/* Conteúdo da tela condicional por tab */}
        {activeTab === 'feeds' && (
          <View style={styles.beatStoreMusicListContainer}>
            <Text style={styles.title}>Feeds (Beats em Destaque)</Text>
            <FlatList
              data={MOCKED_BEATSTORE_MUSIC_DATA.filter(m => m.source === 'beatstore-feeds')}
              keyExtractor={(item) => item.id}
              numColumns={2} // NOVO: Define 2 colunas para a FlatList
              columnWrapperStyle={styles.row} // NOVO: Estilo para envolver as colunas
              renderItem={({ item }) => (
                <View style={styles.beatItemColumn}> {/* NOVO: Estilo para cada item na coluna */}
                  <BeatStoreMusicItem
                    music={item}
                    onPress={() => handlePlayMusic(item)}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorited={favoritedMusics.some((favMusic) => favMusic.id === item.id)}
                    isCurrent={currentTrack?.id === item.id}
                  />
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={() => ( // NOVO: Componente para lista vazia
                <Text style={styles.emptyListText}>Nenhum beat nos feeds da Beat Store.</Text>
              )}
            />
          </View>
        )}

        {activeTab === 'curtidas' && (
          <View style={styles.favoritedMusicListContainer}>
            <Text style={styles.title}>Músicas Curtidas (Beat Store)</Text>
            <Text style={styles.infoMessage}>
              Instrumentais de uso exclusivo (que estão à venda) podem ser automaticamente removidos dos favoritos se forem comprados por outro utilizador. Apenas beats de uso livre podem permanecer permanentemente.
            </Text>
            {favoritedBeatStoreMusics.length === 0 ? (
              <Text style={styles.emptyListText}>Nenhum beat curtido ainda na Beat Store.</Text>
            ) : (
              <FlatList
                data={favoritedBeatStoreMusics}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <BeatStoreMusicItem
                    music={item}
                    onPress={() => handlePlayMusic(item)}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorited={favoritedMusics.some((favMusic) => favMusic.id === item.id)}
                    isCurrent={currentTrack?.id === item.id}
                  />
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </View>
        )}

        {activeTab === 'seguindo' && (
          <View style={styles.beatStoreMusicListContainer}>
            <Text style={styles.title}>Artistas Seguindo (Beats)</Text>
            {MOCKED_BEATSTORE_MUSIC_DATA.filter(m => m.source === 'beatstore-seguindo').length === 0 ? (
              <Text style={styles.emptyListText}>Nenhum beat de artista seguido na Beat Store.</Text>
            ) : (
              <FlatList
                data={MOCKED_BEATSTORE_MUSIC_DATA.filter(m => m.source === 'beatstore-seguindo')}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <BeatStoreMusicItem
                    music={item}
                    onPress={() => handlePlayMusic(item)}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorited={favoritedMusics.some((favMusic) => favMusic.id === item.id)}
                    isCurrent={currentTrack?.id === item.id}
                  />
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </View>
        )}
        <View style={{ height: 110 }}></View>
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          router.push('/autoSearchBeatScreens/useSearchBeatScreen');
          console.log('Botão da Beat Store pressionado!');
        }}
      >
        <Image
          source={require('@/assets/images/4/sound-waves.png')}
          style={{ width: 50, height: 40, tintColor: '#fff' }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#191919',
  },
  container: {
    flexGrow: 1,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 110,
    right: 25,
    width: 60,
    height: 60,
    backgroundColor: '#1565C0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    //paddingVertical: 5,
    marginLeft: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#333',
    marginHorizontal: 10,
  },
  activeTabButton: {
    backgroundColor: '#1565C0',
  },
  tabText: {
    color: '#aaa',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  title: {
    color: '#fff',
    marginTop: 20,
    marginLeft: 15,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  favoritedMusicListContainer: {
    flex: 1,
  },
  beatStoreMusicListContainer: {
    flex: 1,
    // Remova padding ou margin horizontal aqui, pois os itens individuais terão.
  },
  emptyListText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 15,
    marginHorizontal: 20,
  },
  infoMessage: {
    color: '#ccc',
    fontSize: 13,
    marginHorizontal: 15,
    marginBottom: 20,
    textAlign: 'justify',
    lineHeight: 18,
  },
  // NOVO: Estilos para layout de coluna
  row: {
    flex: 1,
    justifyContent: 'space-around', // Distribui o espaço entre os itens
    marginHorizontal: 10, // Um pouco de margem nas laterais da linha
    marginBottom: 8, // Espaçamento entre as linhas de beats
  },
  beatItemColumn: {
    width: '48%', // Define a largura para 48% para permitir 2 colunas com espaço
    // marginHorizontal: '1%', // Pequena margem para cada item, totalizando 2% entre eles
    // O padding do BeatStoreMusicItem (10) e marginHorizontal (15) já geram algum espaçamento interno,
    // mas o columnWrapperStyle e a largura ajudam a controlar o layout de colunas.
  },
});