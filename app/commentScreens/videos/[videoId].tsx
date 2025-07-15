// app/commentScreens/videoComments/[videoId].tsx
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
import { Stack, useLocalSearchParams } from "expo-router"; // Não precisamos de useRouter aqui se o Stack.Screen já gerencia o back
import { Ionicons } from "@expo/vector-icons";

/* ─── Mock Data ────────────────────────────────────────── */
interface Comment {
  id: string;
  user: { name: string; avatar: number | string | null };
  text: string;
  timestamp: string;
}

const generateMockComments = (count: number): Comment[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: String(i + 1),
    user: {
      name: `User ${i + 1}`,
      avatar: require("@/assets/images/Default_Profile_Icon/unknown_artist.png"),
    },
    text: `Comentário genérico para testar rolagem da FlatList. Este é o comentário número ${i + 1}.`,
    timestamp: `${i + 2} min atrás`,
  }));
};
/* ─────────────────────────────────────────────────────── */

export default function VideoCommentsScreen() {
  // RECEBENDO OS NOVOS PARÂMETROS
  const { videoId, commentCount, videoThumbnailUrl, videoTitle, videoArtist} = useLocalSearchParams<{
    videoId: string;
    commentCount?: string; // Expo Router passa tudo como string
    videoThumbnailUrl?: string; // Expo Router passa tudo como string
    videoTitle?: string;
    videoArtist?: string;
  }>();

  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Placeholder for user's avatar (replace with actual user data)
  const userAvatarUrl: string | null = null; // e.g., useAppSelector(s => s.auth.user?.avatarUrl);

  useEffect(() => {
    setIsLoading(true);
    // Simule a busca de comentários. Você usaria o videoId para buscar os comentários reais.
    setTimeout(() => {
      setComments(generateMockComments(30)); // Carrega comentários mockados
      setIsLoading(false);
    }, 1000);
  }, [videoId]);

  function handleSend() {
    const txt = input.trim();
    if (!txt) return;

    const avatarSource = userAvatarUrl
      ? { uri: userAvatarUrl }
      : require("@/assets/images/Default_Profile_Icon/unknown_artist.png");

    setComments((prev) => [
      {
        id: Date.now().toString(),
        user: {
          name: 'Você',
          avatar: avatarSource,
        },
        text: txt,
        timestamp: 'agora',
      },
      ...prev,
    ]);
    setInput('');
    // Lógica para enviar o comentário ao backend
  }

  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={styles.row}>
      <Image
        style={styles.avatar}
        source={
          typeof item.user.avatar === 'string' && item.user.avatar
            ? { uri: item.user.avatar }
            : (item.user.avatar === null
                ? require("@/assets/images/Default_Profile_Icon/unknown_artist.png")
                : item.user.avatar
              )
        }
        onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
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
        {/* Nova seção para a thumbnail e o número de comentários */}
        <View style={styles.headerInfo}>
          {videoThumbnailUrl ? (
            <Image
              source={{ uri: videoThumbnailUrl }}
              style={styles.thumbnail}
              accessibilityLabel="Thumbnail do vídeo"
            />
          ) : (
            // Fallback se não houver thumbnail
            <View style={styles.thumbnailPlaceholder}>
              <Ionicons name="image-outline" size={40} color="#555" />
            </View>
          )}
          <View style={styles.headerTextContainer}>
            {videoTitle && ( // <--- NOVO: Exibindo o título do vídeo se estiver disponível
              <Text style={styles.commentCountText} numberOfLines={1}>
                {videoTitle}
              </Text>
            )}
            <Text style={styles.videoTitleInComments}>{videoArtist}</Text> 
            <Text style={styles.videoTitleInComments}>
              {commentCount ? `${commentCount} Comentários` : 'Comentários'}
            </Text>
            
          </View>
        </View>

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
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
                <Text style={styles.emptyCommentsText}>
                    Nenhum comentário ainda. Seja o primeiro a comentar!
                </Text>
            )}
          />
        )}

       

        {/* Fixed input bar at the bottom */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          style={styles.inputBar}
        >
          <Image
            source={userAvatarUrl ? { uri: userAvatarUrl } : require("@/assets/images/Default_Profile_Icon/unknown_artist.png")}
            style={styles.myAvatar}
            accessibilityLabel="Seu avatar"
          />

          <TextInput
            style={styles.input}
            placeholder="Escreva um comentário..."
            placeholderTextColor="#888"
            value={input}
            onChangeText={setInput}
            //multiline
            //maxHeight={100}
          />

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={handleSend}
            disabled={input.trim().length === 0}
            accessibilityLabel="Enviar comentário"
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
  container: {
    flex: 1,
    backgroundColor: "#191919",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ccc',
    marginTop: 10,
    fontSize: 16,
  },
  // NOVOS ESTILOS PARA O CABEÇALHO DE INFORMAÇÕES
  headerInfo: {
    flexDirection: 'row',
    //alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#222', // Fundo para destacar
  },
  thumbnail: {
    width: 100,
    height: 62,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#444', // Fallback color while loading
  },
  thumbnailPlaceholder: {
    width: 100,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  commentCountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoTitleInComments: {
    color: '#b3b3b3',
    fontSize: 12,
    marginTop: 4,
  },
  // FIM DOS NOVOS ESTILOS

  flatListContentContainer: {
    paddingTop: 80,
    paddingBottom: 30,
  },
  emptyCommentsText: {
    color: '#b3b3b3',
    textAlign: 'center',
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
  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  time: {
    color: "#888",
    fontSize: 12,
    fontWeight: "normal",
    marginLeft: 5,
  },
  text: {
    color: "#ccc",
    fontSize: 14,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#191919",
    borderTopWidth: 1,
    borderTopColor: "#333",
    position: 'absolute',
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
    paddingVertical: 10,
    paddingHorizontal: 11,
    borderRadius: 20,
    backgroundColor:"#2a2a2a",
  },
  
});
