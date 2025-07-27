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
// IMPORTANTE: Ajuste os imports para incluir APENAS os tipos que serão usados
import {
    LibraryFeedItem,
    Album,
    ExtendedPlayEP,
    ArtistProfile,
    Single,
    // REMOVIDOS: ExclusiveBeat, FreeBeat, Playlist, Video, Promotion
} from '@/src/types/contentType';
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
    let releaseYearText: string | undefined;
    // REMOVIDO: let priceStatusText: string | undefined;

    const getDynamicCoverSource = (coverUrl: string | undefined | null, defaultImage: any) => {
        if (isConnected === false || !coverUrl || coverUrl.trim() === '') {
            return defaultImage;
        }
        return { uri: coverUrl };
    };

    // Lógica de tipagem e acesso a propriedades baseada em 'item.category'
    if (item.category === 'single') {
        const singleItem = item as Single;
        coverSource = getDynamicCoverSource(
            singleItem.cover,
            require('@/assets/images/Default_Profile_Icon/unknown_track.png')
        );
        titleText = singleItem.title;
        subtitleText = singleItem.artist;
        genreText = singleItem.genre;
        categoryText = 'Single';
        releaseYearText = singleItem.releaseYear;
    } else if (item.category === 'album') {
        const albumItem = item as Album;
        coverSource = getDynamicCoverSource(
            albumItem.cover,
            require('@/assets/images/Default_Profile_Icon/unknown_track.png')
        );
        titleText = albumItem.title;
        subtitleText = albumItem.artist;
        genreText = albumItem.mainGenre;
        categoryText = 'Álbum';
        releaseYearText = albumItem.releaseYear;
    } else if (item.category === 'ep') {
        const epItem = item as ExtendedPlayEP;
        coverSource = getDynamicCoverSource(
            epItem.cover,
            require('@/assets/images/Default_Profile_Icon/unknown_track.png')
        );
        titleText = epItem.title;
        subtitleText = epItem.artist;
        genreText = epItem.mainGenre;
        categoryText = 'EP';
        releaseYearText = epItem.releaseYear;
    } else if (item.category === 'artist') {
        const artistItem = item as ArtistProfile;
        coverSource = getDynamicCoverSource(
            artistItem.avatar,
            require('@/assets/images/Default_Profile_Icon/unknown_artist.png')
        );
        titleText = artistItem.name;
        subtitleText = artistItem.genres?.join(', ') || 'Artista';
        typeLabel = 'Artista';
        releaseYearText = artistItem.releaseYear;
    }
    // REMOVIDOS: Blocos 'else if' para 'beat', 'playlist', 'video', 'promotion'
    else {
        // Fallback genérico para qualquer tipo desconhecido que possa vir em LibraryFeedItem
        // Se LibraryFeedItem agora só inclui os tipos acima, este 'else' pode indicar um problema de dados.
        coverSource = require('@/assets/images/Default_Profile_Icon/unknown_track.png');
        titleText = 'Conteúdo Desconhecido';
        subtitleText = '';
        categoryText = 'Desconhecido';
        typeLabel = 'Item';
        releaseYearText = undefined;
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
                                <Text style={styles.cardTitle} numberOfLines={1}>{titleText}</Text>
                                <Text style={styles.cardSubtitle} numberOfLines={1}>{subtitleText}</Text>
                                {releaseYearText && <Text style={styles.cardReleaseYearText}>{releaseYearText}</Text>}
                                {genreText && <Text style={styles.cardGenreText} numberOfLines={1}>{genreText}</Text>}
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
                                <Text style={styles.cardTitle} numberOfLines={1}>{titleText}</Text>
                                <Text style={styles.cardSubtitle} numberOfLines={1}>{subtitleText}</Text>
                                {releaseYearText && <Text style={styles.cardReleaseYearText}>{releaseYearText}</Text>}
                                {genreText && <Text style={styles.cardGenreText} numberOfLines={1}>{genreText}</Text>}
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
        marginBottom: 5,
        backgroundColor: '#282828',
        borderRadius: 8,
        overflow: 'hidden',
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
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
    cardReleaseYearText: {
        color: '#ddd',
        fontSize: 10,
        marginBottom: 2,
    },
    // REMOVIDO: cardPriceStatusText
});