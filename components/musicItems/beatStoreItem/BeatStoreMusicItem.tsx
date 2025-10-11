// components/musicItems/beatStoreItem/BeatStoreMusicItem.tsx
import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Platform,
} from 'react-native';
//import { Track } from '@/src/redux/playerSlice';
import { useAppSelector } from '@/src/redux/hooks';
import { BlurView } from 'expo-blur';
// Importe os tipos específicos de beats para uma tipagem mais precisa
import { ExclusiveBeat, FreeBeat } from '@/src/types/contentType'; // Ajuste o caminho conforme necessário

interface BeatStoreMusicItemProps {
    // Definimos o item como uma união de ExclusiveBeat ou FreeBeat,
    // pois este componente é específico da BeatStore.
    item: ExclusiveBeat | FreeBeat;
    onPress: (track: ExclusiveBeat | FreeBeat) => void;
}

export default function BeatStoreMusicItem({ item, onPress }: BeatStoreMusicItemProps) {
    const isConnected = useAppSelector((state) => state.network.isConnected);

    const getDynamicCoverSource = () => {
        if (isConnected === false || !item.cover || item.cover.trim() === '') {
            return require('@/assets/images/Default_Profile_Icon/unknown_track.png');
        }
        return { uri: item.cover };
    };

    const coverSource = getDynamicCoverSource();
    const titleText = item.title; // 'title' é obrigatório, então não precisa de || 'Sem título'
    const artistText = item.artist; // 'artist' é obrigatório
    const genreText = item.genre;   // 'genre' é obrigatório

    // Para beats, a categoria é sempre 'beat', então simplificamos:
    const typeText = "Beat";

    // Adicione propriedades específicas de beat
    const producerText = item.producer;
    const bpmText = `${item.bpm} BPM`;
    const priceText = (item as ExclusiveBeat).price ? `R$ ${(item as ExclusiveBeat).price.toFixed(2)}` : 'Free';


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
                                <Text style={styles.cardGenreText}>{genreText}</Text>
                                <Text style={styles.cardBpmText}>{bpmText}</Text>
                                <Text style={styles.cardCategoryText}>{typeText}</Text>
                                <Text style={styles.cardPriceText}>{priceText}</Text>
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
                                <Text style={styles.cardGenreText}>{genreText}</Text>
                                <Text style={styles.cardBpmText}>{bpmText}</Text>
                                <Text style={styles.cardCategoryText}>{typeText}</Text>
                                <Text style={styles.cardPriceText}>{priceText}</Text>
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
        width: '49%',
        height: 260,
        //marginHorizontal: 2,
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
        paddingVertical: 10,
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
        textAlign: 'center',
    },
    cardSubtitle: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 2,
        textAlign: 'center',
    },
    cardProducerText: { // NOVO ESTILO
        color: '#ccc',
        fontSize: 11,
        marginBottom: 2,
        textAlign: 'center',
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
    cardBpmText: { // NOVO ESTILO
        color: '#999',
        fontSize: 11,
        marginBottom: 2,
    },
    cardPriceText: { // NOVO ESTILO
        color: '#1E90FF', // Ou uma cor que destaque o preço
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 5,
    },
});