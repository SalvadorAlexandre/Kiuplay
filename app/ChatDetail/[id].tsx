//app/ChatDetail/[id].tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ChatDetailScreen() {
  // Captura o parâmetro da rota
  const { id } = useLocalSearchParams<{ id: string }>();

  const router = useRouter();

  // Estado da mensagem
  const [message, setMessage] = useState("");

  // Dados fictícios do "amigo" (você pode futuramente buscar isso de uma API)
  const friend = {
    name: "Usuário #" + id,
    avatar: "https://i.pravatar.cc/150?img=" + (parseInt(id) + 10), // Só pra ter imagem diferente
  };

  // Mensagens fictícias
  const mockMessages = [
    { id: "m1", fromMe: false, text: "Oi, tudo bem?" },
    { id: "m2", fromMe: true, text: "Tudo ótimo, e você?" },
    { id: "m3", fromMe: false, text: "Enviei o beat pra você!" },
  ];

  const handleSendMessage = () => {
    if (message.trim() === "") return;
    alert("Mensagem enviada: " + message);
    setMessage("");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        {/* Header simples */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: friend.avatar }}
            style={styles.avatar}
          />
          <Text style={styles.headerTitle}>{friend.name}</Text>
        </View>

        {/* Lista de mensagens */}
        <ScrollView
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {mockMessages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.fromMe ? styles.myMessage : styles.theirMessage,
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Campo de nova mensagem */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={80}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Digite sua mensagem..."
              placeholderTextColor="#888"
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191919",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    marginRight: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 100, // espaço extra para o input
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  myMessage: {
    backgroundColor: "#1565C0",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#333",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#fff",
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#333",
    backgroundColor: "#222",
  },
  input: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: "#fff",
    fontSize: 15,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#1565C0",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});