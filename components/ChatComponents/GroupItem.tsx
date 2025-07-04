// components/ChatComponents/GroupItem.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface GroupItemProps {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  onPress: (id: string) => void;
}

export default function GroupItem({
  id,
  name,
  avatar,
  description = "Grupo Kiuplay",
  onPress,
}: GroupItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.container}
      onPress={() => onPress(id)}
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
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={22} color="#888" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#555",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    color: "#aaa",
    fontSize: 13,
  },
});