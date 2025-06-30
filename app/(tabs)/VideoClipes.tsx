// app/(tabs)/videoClipes.tsx
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions, // Essencial para calcular as dimensões
  Image,
} from 'react-native';
import TopTabBarVideos from '@/components/topTabBarVideosScreen';
import VideoItem from '@/components/PlayerVideoComponents/VideoItem'
import VideoPlayer from '@/components/PlayerVideoComponents/VideoPlayer'
import useVideoClipsTabs from '@/hooks/useVideoClipsTabs'


export type VideoData = {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  videoUrl: string;
};

const MOCKED_VIDEO_DATA: VideoData[] = [
  { id: '1', title: 'Minha Música Perfeita', artist: 'Artista A', thumbnail: 'https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: '2', title: 'Ritmo da Cidade Noturna', artist: 'Banda B', thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/b.mp4' },
  { id: '3', title: 'Noite Estrelada de Verão', artist: 'Cantor C', thumbnail: 'https://i.ytimg.com/vi/3y7Kq2l_k6w/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/c.mp4' },
  { id: '4', title: 'Sons da Natureza Selvagem', artist: 'Grupo D', thumbnail: 'https://i.ytimg.com/vi/F-glUq_jWv0/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/d.mp4' },
  { id: '5', title: 'Caminhos da Descoberta', artist: 'Artista E', thumbnail: 'https://i.ytimg.com/vi/2N7TfX6f4oM/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/a.mp4' },
  { id: '6', title: 'Amanhecer Dourado', artist: 'Solista F', thumbnail: 'https://i.ytimg.com/vi/eJk8e8e8e8e/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/b.mp4' },
  { id: '7', title: 'Energia Vibrante', artist: 'DJ G', thumbnail: 'https://i.ytimg.com/vi/xM6uD7n1BfQ/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/c.mp4' },
  { id: '8', title: 'Reflexões Profundas', artist: 'Poeta H', thumbnail: 'https://i.ytimg.com/vi/wA5wA5wA5wA/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/d.mp4' },
];

export default function VideoClipesScreen() {

  const { activeTab, handleTabChange, } = useVideoClipsTabs() // Estado para controlar as tabs
  // Começa com o primeiro vídeo da lista ou null se a lista estiver vazia.
  // Tipamos o estado currentPlayingVideo com a interface VideoData.
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState<VideoData | null>(MOCKED_VIDEO_DATA.length > 0 ? MOCKED_VIDEO_DATA[0] : null);

  // Função para lidar com o clique no item da lista.
  // Tipamos o parâmetro 'item' com a interface VideoData.
  const handleVideoPress = (item: VideoData) => {
    setCurrentPlayingVideo(item); // Define o vídeo clicado como o vídeo principal.
  };

  return (
    <View style={styles.container}>
      {/* Topo fixo: TopTabBarVideos */}
      <TopTabBarVideos />
      {currentPlayingVideo ? (
        <VideoPlayer {...currentPlayingVideo} />
      ) : (
        <Text style={{ color: '#fff' }}>Carregando vídeo...</Text>
      )}

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

      {activeTab === 'feeds' && (
        <View style={{ flex: 1,}}>
          {/* Lista de feeds, por exemplo */}
          <FlatList
            style={styles.flatListStyle}
            data={MOCKED_VIDEO_DATA}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleVideoPress(item)}>
                <VideoItem
                  id={item.id}
                  title={item.title}
                  artist={item.artist}
                  thumbnail={item.thumbnail}
                // O VideoItem NÃO precisa do videoUrl, pois ele é apenas um placeholder.
                />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.flatListContentContainer}
            showsVerticalScrollIndicator={false}
          //ListHeaderComponent={() => (
          //  <Text style={styles.sectionTitle}>Outros Videoclipes</Text>
          //)}
          />
        </View>
      )}

      {activeTab === 'curtidas' && (
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', margin: 20 }}>Músicas Curtidas</Text>
          {/* Lista de músicas curtidas */}
        </View>
      )}
      {activeTab === 'seguindo' && (
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', margin: 20 }}>Artistas Seguindo</Text>
          {/* Lista de artistas seguidos */}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919', // Fundo principal da tela.
  },
  flatListStyle: {
    backgroundColor: '#191919', // Fundo da área rolante, consistente com o tema.
  },
  flatListContentContainer: {
    //paddingHorizontal: 15, 
    paddingBottom: 110, 
    paddingTop: 10,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingVertical: 6,
    marginLeft: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#333',
    marginHorizontal: 10,
    marginLeft: -1,
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
  contentContainer: {
    padding: 20,
  },
  title: {
    color: '#fff',
    marginTop: -20,
    marginLeft: 15,
    marginBottom: 10,
    fontSize: 20,
    //fontWeight: 'bold',
  },
});