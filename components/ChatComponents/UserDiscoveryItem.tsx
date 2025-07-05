// components/ChatComponents/UserDiscoveryItem.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

export interface UserDiscoveryItemProps {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  isFollowing?: boolean;
  onFollowPress: (id: string) => void;
  onProfilePress: (id: string) => void;
}

export default function UserDiscoveryItem({
  id,
  name,
  avatar,
  bio = "Artista na Kiuplay",
  isFollowing = false,
  onFollowPress,
  onProfilePress,
}: UserDiscoveryItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={() => onProfilePress(id)}
    >
      <Image
        source={
          avatar
            ? { uri: avatar }
            : require("@/assets/images/Default_Profile_Icon/icon_profile_white_120px.png")
        }
        style={styles.avatar}
      />

      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.bio} numberOfLines={1}>
          {bio}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.followButton,
          isFollowing && styles.followingButton,
        ]}
        onPress={() => onFollowPress(id)}
      >
        <Text style={styles.followButtonText}>
          {isFollowing ? "Seguindo" : "Seguir"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 6,
    //borderBottomWidth: 1,
    //borderBottomColor: "#333",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#555",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bio: {
    color: "#aaa",
    fontSize: 13,
  },
  followButton: {
    backgroundColor: "#1565C0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  followingButton: {
    backgroundColor: "#555",
  },
  followButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});