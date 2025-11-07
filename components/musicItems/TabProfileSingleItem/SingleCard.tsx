// components/profileItems/singleItem/SingleCard.tsx
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
import { Single } from "@/src/types/contentType";
import { useAppSelector } from "@/src/redux/hooks";

import { useTranslation } from "@/src/translations/useTranslation";

interface SingleCardProps {
  item: Single;
  onPress: (track: Single) => void;
}

export default function SingleCard({ item, onPress }: SingleCardProps) {

  const { t } = useTranslation()

  const isConnected = useAppSelector((state) => state.network.isConnected);

  const getDynamicCoverSource = () => {
    if (isConnected === false || !item.cover || item.cover.trim() === "") {
      return require("@/assets/images/Default_Profile_Icon/unknown_track.png");
    }
    return { uri: item.cover };
  };

  const coverSource = getDynamicCoverSource();

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onPress(item)}
    >
      <ImageBackground
        source={coverSource}
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 8 }}
      >
        {Platform.OS !== "web" ? (
          <BlurView intensity={80} tint="dark" style={styles.blurLayer}>
            <View style={styles.overlay} />
            <View style={styles.mainContentWrapper}>
              <Image source={coverSource} style={styles.cardCoverImage} />
              <View style={styles.musicDetails}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardArtistText}>{item.artist}</Text>
                <Text style={styles.cardGenreText}>{item.genre}</Text>
                <Text style={styles.cardYearText}>
                  {t('singleCard.releasedIn', { year: item.releaseYear })}
                </Text>
              </View>
            </View>
          </BlurView>
        ) : (
          <View
            style={[styles.blurLayer, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          >
            <View style={styles.overlay} />
            <View style={styles.mainContentWrapper}>
              <Image source={coverSource} style={styles.cardCoverImage} />
              <View style={styles.musicDetails}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardArtistText}>{item.artist}</Text>
                <Text style={styles.cardGenreText}>{item.genre}</Text>
                <Text style={styles.cardYearText}>
                  {t("singleCard.releasedIn", { year: item.releaseYear })}
                </Text>
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
    width: "49%",
    height: 240,
    marginHorizontal: 2,
    marginBottom: 5,
    backgroundColor: "#282828",
    borderRadius: 8,
    overflow: "hidden",
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    resizeMode: "cover"
  },
  blurLayer: {
    flex: 1,
    padding: 7,
    borderRadius: 8,
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1,
  },
  mainContentWrapper: {
    backgroundColor: "rgba(255,255,255,0.05)",
    flex: 1,
    borderRadius: 8,
    padding: 5,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
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
  cardArtistText: {
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
});