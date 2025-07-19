// components/musicItems/LibraryItem/LibraryContentCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { LibraryFeedItem, AlbumOrEP, ArtistProfile, Playlist } from '@/src/types/library';
import { Track } from '@/src/redux/playerSlice';

interface LibraryContentCardProps {
  item: LibraryFeedItem;
  onPress: (item: LibraryFeedItem) => void;
}

export default function LibraryContentCard({
  item,
  onPress,
}: LibraryContentCardProps) {
  let coverSource;
  let titleText;
  let subtitleText;
  let genreText: string | undefined;
  let categoryText: string | undefined;
  let typeLabel: string | undefined;

  if (item.type === 'single' || item.type === 'album' || item.type === 'ep') {
    const musicItem = item as Track | AlbumOrEP;
    coverSource = musicItem.cover
      ? { uri: musicItem.cover }
      : require('@/assets/images/Default_Profile_Icon/unknown_track.png');
    titleText = musicItem.title;
    subtitleText = musicItem.artist;
    genreText = musicItem.genre;
    categoryText = musicItem.type!.charAt(0).toUpperCase() + musicItem.type!.slice(1);
  } else if (item.type === 'artist') {
    const artistItem = item as ArtistProfile;
    coverSource = artistItem.avatar
      ? { uri: artistItem.avatar }
      : require('@/assets/images/Default_Profile_Icon/unknown_artist.png');
    titleText = artistItem.name;
    subtitleText = artistItem.genres?.join(', ') || '';
    typeLabel = 'Artista';
  } else if (item.type === 'playlist') {
    const playlistItem = item as Playlist;
    coverSource = playlistItem.cover
      ? { uri: playlistItem.cover }
      : require('@/assets/images/Default_Profile_Icon/kiuplayDefault.png');
    titleText = playlistItem.name;
    subtitleText = `Por ${playlistItem.creator}`;
    typeLabel = 'Playlist';
  } else {
    coverSource = require('@/assets/images/Default_Profile_Icon/unknown_track.png');
    titleText = 'Conteúdo Desconhecido';
    subtitleText = '';
  }

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={() => onPress(item)}>
      <View style={{backgroundColor: '#fff', flex: 1, borderRadius: 4,}}>
        <Image source={coverSource} style={styles.cardCoverImage} />
      </View>

      <View style={styles.musicDetails}>

        <Text style={styles.cardTitle} numberOfLines={1}>
          {titleText}
        </Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>
          {subtitleText}
        </Text>

        {genreText && (item.type === 'single' || item.type === 'album' || item.type === 'ep') && (
          <Text style={styles.cardGenreText} numberOfLines={1}>
            Gênero: {genreText}
          </Text>
        )}

        {categoryText && (item.type === 'single' || item.type === 'album' || item.type === 'ep') && (
          <Text style={styles.cardCategoryText} numberOfLines={1}>
            {categoryText}
          </Text>
        )}
        {typeLabel && (item.type === 'playlist' || item.type === 'artist') && (
          <Text style={styles.cardTypeLabelText} numberOfLines={1}>
            {typeLabel}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // === AJUSTE 2: largura do card baseada na tela para permitir 2 colunas === //
  cardContainer: { 
    height: 250,
    marginHorizontal: 3, 
    marginBottom: 10,
    backgroundColor: '#282828',
    borderRadius: 8,
    padding: 5,
  },
  musicDetails: {
    //flex: 1,
    justifyContent: 'center',
  },
  cardCoverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    //marginBottom: 8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    width: '100%',
  },
  cardSubtitle: {
    color: '#aaa',
    fontSize: 12,
    width: '100%',
    marginBottom: 2,
  },
  cardCategoryText: {
    color: '#bbb',
    fontSize: 11,
    width: '100%',
    marginBottom: 2,
  },
  cardGenreText: {
    color: '#bbb',
    fontSize: 11,
    width: '100%',
  },
  cardTypeLabelText: {
    color: '#999',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
    width: '100%',
  },
});