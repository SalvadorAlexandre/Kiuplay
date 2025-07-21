// components/musicItems/LibraryItem/LibraryContentCard.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  ImageBackground,
} from 'react-native';
import { LibraryFeedItem, AlbumOrEP, ArtistProfile, Playlist } from '@/src/types/library';
import { Track } from '@/src/redux/playerSlice';
import { useAppSelector } from '@/src/redux/hooks';
import { BlurView } from 'expo-blur';

interface LibraryContentCardProps {
  item: LibraryFeedItem;
  onPress: (item: LibraryFeedItem) => void;
}

export default function LibraryContentCard({
  item,
  onPress,
}: LibraryContentCardProps) {
  const isConnected = useAppSelector((state) => state.network.isConnected);

  let coverSource;
  let titleText;
  let subtitleText;
  let genreText: string | undefined;
  let categoryText: string | undefined;
  let typeLabel: string | undefined;

  const getDynamicCoverSource = (coverUrl: string | undefined | null, defaultImage: any) => {
    if (isConnected === false || !coverUrl || coverUrl.trim() === '') {
      return defaultImage;
    }
    return { uri: coverUrl };
  };

  if (item.type === 'single' || item.type === 'album' || item.type === 'ep') {
    const musicItem = item as Track | AlbumOrEP;
    coverSource = getDynamicCoverSource(
      musicItem.cover,
      require('@/assets/images/Default_Profile_Icon/unknown_track.png')
    );
    titleText = musicItem.title;
    subtitleText = musicItem.artist;
    genreText = musicItem.genre;
    categoryText = musicItem.type!.charAt(0).toUpperCase() + musicItem.type!.slice(1);
  } else if (item.type === 'artist') {
    const artistItem = item as ArtistProfile;
    coverSource = getDynamicCoverSource(
      artistItem.avatar,
      require('@/assets/images/Default_Profile_Icon/unknown_artist.png')
    );
    titleText = artistItem.name;
    subtitleText = artistItem.genres?.join(', ') || '';
    typeLabel = 'Artista';
  } else if (item.type === 'playlist') {
    const playlistItem = item as Playlist;
    coverSource = getDynamicCoverSource(
      playlistItem.cover,
      require('@/assets/images/Default_Profile_Icon/kiuplayDefault.png')
    );
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
      <ImageBackground
        source={coverSource}
        style={styles.imageBackground}
        resizeMode="cover"
        imageStyle={{ borderRadius: 8 }}
      >
        {Platform.OS !== 'web' ? (
          <BlurView intensity={80} tint="dark" style={styles.blurLayer}>
            <View style={styles.overlay} />
            <View style={styles.mainContentWrapper}>
              <Image source={coverSource} style={styles.cardCoverImage} />
              <View style={styles.musicDetails}>
                <Text style={styles.cardTitle}>{titleText}</Text>
                <Text style={styles.cardSubtitle}>{subtitleText}</Text>
                {genreText && <Text style={styles.cardGenreText}>{genreText}</Text>}
                {categoryText && <Text style={styles.cardCategoryText}>{categoryText}</Text>}
                {typeLabel && <Text style={styles.cardTypeLabelText}>{typeLabel}</Text>}
              </View>
            </View>
          </BlurView>
        ) : (
          <View style={[styles.blurLayer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <View style={styles.overlay} />
            <View style={styles.mainContentWrapper}>
              <Image source={coverSource} style={styles.cardCoverImage} />
              <View style={styles.musicDetails}>
                <Text style={styles.cardTitle}>{titleText}</Text>
                <Text style={styles.cardSubtitle}>{subtitleText}</Text>
                {genreText && <Text style={styles.cardGenreText}>{genreText}</Text>}
                {categoryText && <Text style={styles.cardCategoryText}>{categoryText}</Text>}
                {typeLabel && <Text style={styles.cardTypeLabelText}>{typeLabel}</Text>}
              </View>
            </View>
          </View>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    height: 250,
    marginHorizontal: 3,
    marginBottom: 10,
    backgroundColor: '#282828',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  blurLayer: {
    flex: 1,
    padding: 7,
    borderRadius: 8,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1,
  },
  mainContentWrapper: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    flex: 1,
    borderRadius: 8,
    padding: 5,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardCoverImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  musicDetails: {
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardSubtitle: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 2,
  },
  cardCategoryText: {
    color: '#bbb',
    fontSize: 11,
    marginBottom: 2,
  },
  cardGenreText: {
    color: '#bbb',
    fontSize: 11,
    marginBottom: 2,
  },
  cardTypeLabelText: {
    color: '#999',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
  },
});