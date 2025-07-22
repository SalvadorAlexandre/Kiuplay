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
import { Single } from '@/src/types/library';
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

  if (item.type === 'single') {
    const singleItem = item as Single;

    coverSource = getDynamicCoverSource(
      singleItem.cover,
      require('@/assets/images/Default_Profile_Icon/unknown_track.png')
    );
    titleText = singleItem.title;
    subtitleText = singleItem.artist;
    genreText = singleItem.genre;
    categoryText = 'Single'; // Fixamos isso aqui se quiser

  } else if (item.type === 'album') {
    const album = item; // tipado automaticamente como AlbumItem
    coverSource = getDynamicCoverSource(album.cover, require('@/assets/images/Default_Profile_Icon/unknown_track.png'));
    titleText = album.title;
    subtitleText = album.artist;
    genreText = album.genre;
    categoryText = 'Álbum';

  } else if (item.type === 'ep') {
    const ep = item; // tipado automaticamente como EPItem
    coverSource = getDynamicCoverSource(ep.cover, require('@/assets/images/Default_Profile_Icon/unknown_track.png'));
    titleText = ep.title;
    subtitleText = ep.artist;
    genreText = ep.genre;
    categoryText = 'EP';
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