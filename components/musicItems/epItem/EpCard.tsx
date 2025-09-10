// components/musicItems/epItem/EpCard.tsx
import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { ExtendedPlayEP } from "@/src/types/contentType";
import { useAppSelector } from "@/src/redux/hooks";

interface EpCardProps {
    item: ExtendedPlayEP;
    onPress: (ep: ExtendedPlayEP) => void;
}

export default function EpCard({ item, onPress }: EpCardProps) {
    const isConnected = useAppSelector((state) => state.network.isConnected);
    const getDynamicCoverSource = () => {
        if (isConnected === false || !item.cover || item.cover.trim() === "") {
            return require("@/assets/images/Default_Profile_Icon/unknown_track.png");
        }
        return { uri: item.cover };
    };
    const coverSource = getDynamicCoverSource()
    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => onPress(item)}
        >
            <ImageBackground
                source={coverSource}
                style={styles.imageBackground}
                resizeMode="cover"
                imageStyle={{ borderRadius: 8 }}
            >
                {Platform.OS !== "web" ? (
                    <BlurView intensity={80} tint="dark" style={styles.blurLayer}>
                        <CardContent item={item} coverSource={coverSource} />
                    </BlurView>
                ) : (
                    <View
                        style={[styles.blurLayer, { backgroundColor: "rgba(0,0,0,0.5)" }]}
                    >
                        <CardContent item={item} coverSource={coverSource} />
                    </View>
                )}
            </ImageBackground>
        </TouchableOpacity>
    );
}

function CardContent({
    item,
    coverSource,
}: {
    item: ExtendedPlayEP;
    coverSource: any;
}) {
    return (
        <View style={styles.mainContentWrapper}>
            <Image source={coverSource} style={styles.cardCoverImage} />
            <View style={styles.musicDetails}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.artist}</Text>
                <Text style={styles.cardGenreText}>{item.mainGenre}</Text>
                <Text style={styles.cardYearText}>{item.releaseYear}</Text>
                <Text style={styles.cardCategoryText}>{item.category}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: "48%",
        height: 250,
        marginHorizontal: 3,
        marginBottom: 8,
        backgroundColor: "#282828",
        borderRadius: 8,
        overflow: "hidden",
    },
    imageBackground: {
        flex: 1,
        justifyContent: "center",
        width: "100%",
    },
    blurLayer: {
        flex: 1,
        padding: 7,
        borderRadius: 8,
        overflow: "hidden",
    },
    mainContentWrapper: {
        backgroundColor: "rgba(255,255,255,0.05)",
        flex: 1,
        borderRadius: 8,
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    cardCoverImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 10,
    },
    musicDetails: {
        alignItems: "center",
    },
    cardTitle: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 2,
        textAlign: "center",
    },
    cardSubtitle: {
        color: "#aaa",
        fontSize: 12,
        marginBottom: 2,
        textAlign: "center",
    },
    cardGenreText: {
        color: "#bbb",
        fontSize: 11,
        marginBottom: 2,
    },
    cardYearText: {
        color: "#999",
        fontSize: 11,
        marginBottom: 2,
    },
    cardCategoryText: {
        color: "#1E90FF",
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 4,
    },
});