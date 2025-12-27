// components/cardsItems/FreeBeatCard.tsx
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    ImageBackground,
} from 'react-native';
import { ArtistProfile } from '@/src/types/contentType';
import { useAppSelector } from '@/src/redux/hooks';
import { BlurView } from 'expo-blur';
import { useTranslation } from '@/src/translations/useTranslation';
import { cardStyles as styles } from './styles/cardStyles';

interface ArtistProfileCardProps {
    item: ArtistProfile;
    onPress: (item: ArtistProfile) => void;
}

export default function ArtistProfileCard({ item, onPress }: ArtistProfileCardProps) {
    const isConnected = useAppSelector((state) => state.network.isConnected);
    const { t } = useTranslation();

    // Definição da imagem de capa com fallback
    const getDynamicCoverSource = () => {
        if (isConnected === false || !item.avatar || item.avatar.trim() === "") {
            return require("@/assets/images/Default_Profile_Icon/unknown_artist.png");
        }
        return { uri: item.avatar };
    };

    const coverSource = getDynamicCoverSource();

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={() => onPress(item)}>
            <ImageBackground
                source={coverSource}
                style={styles.imageBackground}
                imageStyle={{ borderRadius: 8 }}
            >
                {Platform.OS !== 'web' ? (
                    <BlurView intensity={80} tint="dark" style={styles.blurLayer}>
                        <View style={styles.overlay} />
                        <CardContent item={item} coverSource={coverSource} />
                    </BlurView>
                ) : (
                    <View style={[styles.blurLayer, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                        <View style={styles.overlay} />
                        <CardContent item={item} coverSource={coverSource} />
                    </View>
                )}
            </ImageBackground>
        </TouchableOpacity>
    );
}

/**
 * Sub-componente interno para evitar repetição de código entre BlurView e View (Web)
 */
const CardContent = ({ item, coverSource }: { item: ArtistProfile, coverSource: any }) => (
    <View style={styles.mainContentWrapper}>
        <Image source={coverSource} style={styles.cardCoverImage} />
        <View style={styles.musicDetails}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.cardSubtitle} numberOfLines={1}>{item.name}</Text>

            <View style={styles.infoRow}>
                {item.releaseYear && <Text style={styles.cardDetailText}>{item.releaseYear}</Text>}
                {item.releaseYear && item.releaseYear && <Text style={styles.dotSeparator}> • </Text>}
                {item.releaseYear && <Text style={styles.cardDetailText} numberOfLines={1}>{item.releaseYear}</Text>}
            </View>

            <Text style={styles.cardTypeLabelText}>{item.category}</Text>
        </View>
    </View>
);