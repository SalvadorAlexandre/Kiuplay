// components/PlayerVideoComponents/VideoInfoAndActions.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store';

export interface VideoInfoAndActionsProps {
  title: string;
  artist: string;
  videoId: string;
  liked: boolean;
  disliked: boolean;
  isFavorited: boolean;
  likeCount?: number | string;
  dislikeCount?: number | string;
  favoriteCount?: number | string;
  viewsCount?: string;
  uploadTime?: string;
  // NOVAS PROPS AQUI
  commentCount?: number | string; // Adicionado para o número de comentários
  videoThumbnailUrl?: string;     // Adicionado para a URL da thumbnail do vídeo
  // FIM DAS NOVAS PROPS

  onToggleLike: (videoId: string) => void;
  onToggleDislike: (videoId: string) => void;
  onToggleFavorite: (videoId: string) => void;
}

const VideoInfoAndActions = ({
  title,
  artist,
  videoId,
  liked,
  disliked,
  isFavorited,
  likeCount = '12.1K',
  dislikeCount = '2',
  //favoriteCount,
  viewsCount = '8 mil visualizações',
  uploadTime = 'há 3 semanas',
  commentCount = '30', // Valor padrão, ajuste se tiver um real
  videoThumbnailUrl,    // Sem valor padrão, pode ser undefined
  onToggleLike,
  onToggleDislike,
  onToggleFavorite,
}: VideoInfoAndActionsProps) => {
  const router = useRouter();

  const favoriteVideos = useSelector((state: RootState) => state.favorites.videos);
  const countFavorites = (id: string) =>
    favoriteVideos.filter((v) => v.videoId === id).length;

  return (
    <View style={styles.infoContainer}>
      {/* Artist Profile and Follow Button Row */}
      <View style={styles.artistRow}>
        <Image
          source={require('@/assets/images/Default_Profile_Icon/unknown_artist.png')}
          style={styles.profileImage}
          accessibilityLabel={`Avatar do artista ${artist}`}
        />
        <Text style={styles.artistName}>{artist}</Text>
        <Text style={styles.followersText} numberOfLines={1}> | 500 mil seguidores</Text>
        <TouchableOpacity
          style={styles.followButton}
          onPress={() => { /* Implementar lógica de seguir */ }}
          accessibilityLabel="Seguir artista"
        >
          <Text style={styles.followButtonText}>Seguir</Text>
        </TouchableOpacity>
      </View>

      {/* Video Title and Views/Time */}
      <Text style={styles.mainVideoTitle}>{title}</Text>
      <Text style={styles.viewsTimeText} numberOfLines={1}>
        {viewsCount} {uploadTime ? ` ${uploadTime}` : ''}
      </Text>

      {/* Action Buttons (Likes, Dislikes, Download, Share, Playlist) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.actionButtonsContent}
      >
        <View style={styles.actionButtons}>
          {/* Like Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onToggleLike(videoId)}
            accessibilityLabel={liked ? "Descurtir vídeo" : "Curtir vídeo"}
          >
            <Image
              source={
                liked
                  ? require('@/assets/images/videoItems/icons8_like_120px_2.png')
                  : require('@/assets/images/videoItems/icons8_like_outline_120px.png')
              }
              style={[
                styles.iconButton,
                { tintColor: liked ? '#1E90FF' : '#fff' },
              ]}
            />
            <Text style={styles.actionButtonText}>{likeCount}</Text>
          </TouchableOpacity>

          {/* Dislike Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onToggleDislike(videoId)}
            accessibilityLabel={disliked ? "Remover descurtida" : "Descurtir vídeo"}
          >
            <Image
              source={
                disliked
                  ? require('@/assets/images/videoItems/icons8_not_like_120px.png')
                  : require('@/assets/images/videoItems/icons8_not_like_outline_120px.png')
              }
              style={[
                styles.iconButton,
                { tintColor: disliked ? '#900000' : '#fff' },
              ]}
            />
            <Text style={styles.actionButtonText}>{dislikeCount}</Text>
          </TouchableOpacity>

          {/* Favorite/Heart Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onToggleFavorite(videoId)}
            accessibilityLabel={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={23}
              color={isFavorited ? "#FF3D00" : "#fff"}
            />
            <Text style={styles.actionButtonText}>{countFavorites(videoId).toString()}</Text>
          </TouchableOpacity>

          {/* Comment Button - AGORA PASSA OS NOVOS PARÂMETROS */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              router.push({
                pathname: '/commentScreens/videos/[videoId]',
                params: {
                  videoId,
                  // NOVOS PARÂMETROS SENDO PASSADOS
                  commentCount: String(commentCount), // Certifique-se de que é string
                  videoThumbnailUrl: videoThumbnailUrl || '', // Passe a URL ou string vazia
                  videoTitle: title,
                  videoArtist: artist,
                },
              })
            }
            accessibilityLabel="Ver e adicionar comentários"
          >
            <Image
              source={require("@/assets/images/audioPlayerBar/icons8_sms_120px.png")}
              style={styles.iconButton}
            />
            <Text style={styles.actionButtonText}>{commentCount}</Text>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => { /* Implementar lógica de compartilhamento */ }}
            accessibilityLabel="Compartilhar vídeo"
          >
            <Ionicons name="share-social-outline" size={23} color="#fff" />
            <Text style={styles.actionButtonText}>Partilhar</Text>
          </TouchableOpacity>

          {/* Download Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => { /* Implementar lógica de download */ }}
            accessibilityLabel="Baixar vídeo"
          >
            <Image
              source={require('@/assets/images/audioPlayerBar/icons8_download_120px_2.png')}
              style={styles.iconButton}
            />
            <Text style={styles.actionButtonText}>Baixar</Text>
          </TouchableOpacity>

          {/* Playlist posted videos Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => { /* Implementar lógica de adicionar à playlist */ }}
            accessibilityLabel="Adicionar à playlist"
          >
            <Ionicons name="list" size={23} color="#fff" />
            <Text style={styles.actionButtonText}>Playlist</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: { padding: 15, backgroundColor: '#191919' },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  profileImage: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#444' },
  artistName: { color: '#fff', fontSize: 18 },
  followersText: { color: '#b3b3b3', fontSize: 14, flex: 1 },
  followButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  followButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  mainVideoTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  viewsTimeText: { color: '#b3b3b3', fontSize: 14, marginBottom: 10 },
  actionButtonsContent: { paddingRight: 20, alignItems: 'center' },
  actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 20,
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  iconButton: { width: 25, height: 25, resizeMode: 'contain' },
  actionButtonText: { color: '#fff', fontSize: 12 },
});

export default VideoInfoAndActions;