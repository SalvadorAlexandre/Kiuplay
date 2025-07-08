// components/ChatComponents/FriendRequestItem.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface FriendRequestItemProps {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onProfilePress: (id: string) => void;
}

export default function FriendRequestItem({
  id,
  name,
  avatar,
  bio = "Usuário do Kiuplay",
  onAccept,
  onReject,
  onProfilePress,
}: FriendRequestItemProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onProfilePress(id)}
        style={styles.profileArea}
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
      </TouchableOpacity>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => onReject(id)}
        >
          <Text style={{color: '#ff6666', fontSize: 16}}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  profileArea: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#555",
  },
  textContainer: {
    marginLeft: 12,
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
  buttonsContainer: {
    flexDirection: "row",
  },
  button: {
    padding: 6,
    borderRadius: 16,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: "#28a745",
  },
  rejectButton: {
    backgroundColor: "#d32f2f",
  },
});