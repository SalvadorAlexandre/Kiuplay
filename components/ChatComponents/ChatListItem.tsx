// components/ChatComponents/ChatListItem.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface ChatListItemProps {
  id: string;
  name: string;
  avatar?: string; // url ou undefined
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  onPress: (id: string) => void;
}

export default function ChatListItem({
  id,
  name,
  avatar,
  lastMessage,
  timestamp,
  unreadCount = 0,
  onPress,
}: ChatListItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(id)}>
      <Image
        source={
          avatar
            ? { uri: avatar }
            : require("@/assets/images/Default_Profile_Icon/icon_profile_white_120px.png")
        }
        style={styles.avatar}
      />

      <View style={styles.textContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>

        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessage}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#888" />
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
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#555",
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    maxWidth: "70%",
  },
  timestamp: {
    color: "#888",
    fontSize: 12,
  },
  messageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    color: "#aaa",
    fontSize: 14,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: "#1565C0",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
    minWidth: 20,
    alignItems: "center",
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});