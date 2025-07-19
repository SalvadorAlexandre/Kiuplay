// components/musicItems/beatStoreItem/BeatStoreMusicItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Track } from '@/src/redux/playerSlice'; // Importe a interface Track

// NOVO: Definição da interface para as props do componente
interface BeatStoreMusicItemProps {
  music: Track;
  onPress: () => void;
  onToggleFavorite: (music: Track) => void;
  isFavorited: boolean;
  isCurrent: boolean;
  // TODO: Adicionar propriedades para preço/tipo (gratuito/pago) aqui futuramente
}

export default function BeatStoreMusicItem({
  music,
  onPress,
  onToggleFavorite,
  isFavorited,
  isCurrent,
}: BeatStoreMusicItemProps) {
  const coverImage = music.cover
    ? { uri: music.cover }
    : require('@/assets/images/Default_Profile_Icon/unknown_track.png'); // Fallback para capa

  return (
    <TouchableOpacity style={styles.musicItemContainer} onPress={onPress}>
      <Image source={coverImage} style={styles.musicCover} />
      <View style={styles.musicDetails}>
        <Text style={styles.musicTitle} numberOfLines={1}>
          {music.title}
        </Text>
        <Text style={styles.musicArtist} numberOfLines={1}>
          {music.artist}
        </Text>
        {/* TODO: Adicionar exibição de preço/tipo (gratuito/pago) aqui */}
        {/* <Text style={styles.musicPrice}>Gratuito / $99.99</Text> */}
      </View>

      
      <View style={styles.musicActions}>
        <TouchableOpacity onPress={() => onToggleFavorite(music)} style={styles.favoriteButton}>
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorited ? '#FF3D00' : '#ccc'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress}>
          <Ionicons
            name={isCurrent ? 'pause-circle' : 'play-circle'}
            size={30}
            color="#1E90FF"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  musicItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#282828',
    borderRadius: 8,
    marginHorizontal: 15,
  },
  musicCover: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 10,
  },
  musicDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  musicTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  musicArtist: {
    color: '#aaa',
    fontSize: 13,
  },
  musicActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  favoriteButton: {
    padding: 5,
  },
});