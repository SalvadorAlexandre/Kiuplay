// components/cardsItems/ExclusiveBeatard.tsx
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    ImageBackground,
} from 'react-native';
import { ExclusiveBeat } from '@/src/types/contentType';
import { useAppSelector } from '@/src/redux/hooks';
import { BlurView } from 'expo-blur';
import { useTranslation } from '@/src/translations/useTranslation';
import { cardStyles as styles } from './styles/cardStyles';

interface ExclusiveBeatCardProps {
    item: ExclusiveBeat;
    onPress: (item: ExclusiveBeat) => void;
}

export default function ExclusiveBeatCard({ item, onPress }: ExclusiveBeatCardProps) {
    const isConnected = useAppSelector((state) => state.network.isConnected);
    const { t } = useTranslation();

    // Definição da imagem de capa com fallback
    const getDynamicCoverSource = () => {
        if (isConnected === false || !item.cover || item.cover.trim() === "") {
            return require("@/assets/images/Default_Profile_Icon/unknown_track.png");
        }
        return { uri: item.cover };
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
const CardContent = ({ item, coverSource }: { item: ExclusiveBeat, coverSource: any }) => (
    <View style={styles.mainContentWrapper}>
        <Image source={coverSource} style={styles.cardCoverImage} />
        <View style={styles.musicDetails}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.cardSubtitle} numberOfLines={1}>{item.artist}</Text>

            <View style={styles.infoRow}>
                {item.releaseYear && <Text style={styles.cardDetailText}>{item.releaseYear}</Text>}
                {item.releaseYear && item.genre && <Text style={styles.dotSeparator}> • </Text>}
                {item.genre && <Text style={styles.cardDetailText} numberOfLines={1}>{item.genre}</Text>}
            </View>

            <Text style={styles.cardTypeLabelText}>SINGLE</Text>
        </View>
    </View>
);