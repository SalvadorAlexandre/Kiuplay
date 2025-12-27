import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Single } from '@/src/types/contentType';
import { useAppSelector } from '@/src/redux/hooks';

interface Props {
  track: Single;
  onPlay: (track: Single) => void;
  isFavorited: boolean;
  onToggleFavorite: (track: Single) => void;
  isCurrent: boolean;
}

export const TrackListItem = ({ track, onPlay, isFavorited, onToggleFavorite, isCurrent }: Props) => {
  const isConnected = useAppSelector((state) => state.network.isConnected);
 
  const getImageSource = () => {
    if (isConnected === false || !track.cover || track.cover.trim() === '') {
      return require('@/assets/images/Default_Profile_Icon/unknown_track.png');
    }
    return { uri: track.cover };
  };

  const imageSource = getImageSource();

  return (
    <TouchableOpacity 
      style={[styles.container, isCurrent && styles.currentTrackItem]} 
      onPress={() => onPlay(track)}
    >
      <Image source={imageSource} style={styles.coverImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {isCurrent ? '▶ ' : ''}{track.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>{track.artist}</Text>
      </View>
      <TouchableOpacity onPress={() => onToggleFavorite(track)} style={styles.favoriteButton}>
        <Ionicons 
          name={isFavorited ? 'heart' : 'heart-outline'} 
          size={24} 
          color={isFavorited ? '#FF3D00' : '#bbb'} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15 },
  currentTrackItem: { borderRadius: 8, backgroundColor: 'rgba(255, 255, 255, 0.05)' },
  infoContainer: { flex: 1, marginRight: 10 },
  title: { color: '#fff', fontSize: 16, fontWeight: '500' },
  artist: { color: '#bbb', fontSize: 13, marginTop: 2 },
  favoriteButton: { padding: 5 },
  coverImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12, backgroundColor: '#333' },
});