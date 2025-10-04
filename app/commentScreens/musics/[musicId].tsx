// app/commentScreens/musicComments/[musicId].tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// 🔹 [1] IMPORTES DOS MOCKS CENTRALIZADOS
import { MOCKED_CLOUD_FEED_DATA, MOCKED_BEATSTORE_FEED_DATA } from "@/src/types/contentServer"; // ✅ ajuste
import { Comment } from "@/src/types/contentType"; // ✅ usa tua interface padronizada

export default function MusicCommentsScreen() {
  // 🔹 [2] Recebendo parâmetros da música
  const {
    musicId,
    musicTitle,
    artistName,
    albumArtUrl,
    contentType, // ← pode vir "single" ou "freebeat"
  } = useLocalSearchParams<{
    musicId: string;
    musicTitle?: string;
    artistName?: string;
    albumArtUrl?: string;
    contentType?: string;
  }>();

  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const userAvatarUrl: string | null = null;

  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      let mockComments: Comment[] = [];

      if (contentType === "single") {
        // 🔹 Garante que o item é realmente um "Single"
        const single = MOCKED_CLOUD_FEED_DATA.find((item) => item.id === musicId);
        if (single && "comments" in single) {
          mockComments = (single as { comments?: Comment[] }).comments || [];
        }
      } else if (contentType === "freebeat") {
        // 🔹 Garante que o item é realmente um "FreeBeat"
        const beat = MOCKED_BEATSTORE_FEED_DATA.find((item) => item.id === musicId);
        if (beat && "comments" in beat) {
          mockComments = (beat as { comments?: Comment[] }).comments || [];
        }
      }

      setComments(mockComments);
      setIsLoading(false);
    }, 800);
  }, [musicId, contentType]);

  // 🔹 [4] Função de envio local
  function handleSend() {
    const txt = input.trim();
    if (!txt) return;

    const avatarSource = userAvatarUrl
      ? userAvatarUrl
      : null;

    const newComment: Comment = {
      id: Date.now().toString(),
      user: { name: "Você", avatar: avatarSource },
      text: txt,
      timestamp: "agora",
    };

    setComments((prev) => [newComment, ...prev]);
    setInput("");
  }

  // 🔹 [5] Renderização de cada comentário
  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={styles.row}>
      <Image
        style={styles.avatar}
        source={
          item.user.avatar
            ? { uri: item.user.avatar }
            : require("@/assets/images/Default_Profile_Icon/unknown_artist.png")
        }
      />
      <View style={styles.bubble}>
        <Text style={styles.name}>
          {item.user.name} <Text style={styles.time}>{item.timestamp}</Text>
        </Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Comentários",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#191919" },
        }}
      />

      <View style={styles.container}>
        {/* Cabeçalho da música */}
        <View style={styles.headerInfo}>
          {albumArtUrl ? (
            <Image source={{ uri: albumArtUrl }} style={styles.thumbnail} />
          ) : (
            <View style={styles.thumbnailPlaceholder}>
              <Ionicons name="musical-notes-outline" size={40} color="#555" />
            </View>
          )}
          <View style={styles.headerTextContainer}>
            {musicTitle && (
              <Text style={styles.musicTitleInComments} numberOfLines={1}>
                {musicTitle}
              </Text>
            )}
            {artistName && (
              <Text style={styles.artistNameInComments} numberOfLines={1}>
                {artistName}
              </Text>
            )}
            <Text style={styles.commentCountText}>
              {comments.length > 0
                ? `${comments.length} Comentário${comments.length > 1 ? "s" : ""}`
                : "Comentários"}
            </Text>
          </View>
        </View>

        {/* Lista de comentários */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E90FF" />
            <Text style={styles.loadingText}>Carregando comentários...</Text>
          </View>
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            inverted
            renderItem={renderCommentItem}
            contentContainerStyle={styles.flatListContentContainer}
            ListEmptyComponent={() => (
              <Text style={styles.emptyCommentsText}>
                Nenhum comentário para esta música ainda. Seja o primeiro!
              </Text>
            )}
          />
        )}

        {/* Campo de input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          style={styles.inputBar}
        >
          <Image
            source={
              userAvatarUrl
                ? { uri: userAvatarUrl }
                : require("@/assets/images/Default_Profile_Icon/unknown_artist.png")
            }
            style={styles.myAvatar}
          />

          <TextInput
            style={styles.input}
            placeholder="Adicionar um comentário público..."
            placeholderTextColor="#888"
            value={input}
            onChangeText={setInput}
          />

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={handleSend}
            disabled={input.trim().length === 0}
          >
            <Ionicons
              name="send"
              size={20}
              color={input.trim().length === 0 ? "#ccc" : "#1E90FF"}
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#191919" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#ccc", marginTop: 10, fontSize: 16 },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "#222",
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#444",
  },
  thumbnailPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#444",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: { flex: 1 },
  musicTitleInComments: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  artistNameInComments: { color: "#b3b3b3", fontSize: 12, marginTop: 2 },
  commentCountText: { color: "#aaa", fontSize: 12, marginTop: 4 },
  flatListContentContainer: { paddingTop: 80, paddingBottom: 30 },
  emptyCommentsText: {
    color: "#b3b3b3",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: "#444",
  },
  bubble: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 10,
  },
  name: { color: "#fff", fontWeight: "bold", fontSize: 14, marginBottom: 4 },
  time: { color: "#888", fontSize: 12, fontWeight: "normal", marginLeft: 5 },
  text: { color: "#ccc", fontSize: 14 },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#191919",
    borderTopWidth: 1,
    borderTopColor: "#333",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  myAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    backgroundColor: "#444",
  },
  input: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    color: "#fff",
    fontSize: 15,
  },
  sendBtn: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#2a2a2a",
  },
});