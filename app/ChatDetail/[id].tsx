//app/ChatDetail/[id].tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Easing,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Checkbox } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { } from 'react-native';




export default function ChatDetailScreen() {
  // Captura o parâmetro da rota
  const { id } = useLocalSearchParams<{ id: string }>();

  const router = useRouter();

  // Estado da mensagem
  const [message, setMessage] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

  const [allowDownload, setAllowDownload] = useState(false);
  const [visibility, setVisibility] = useState('once'); // 'once', '24h', 'always'

  // Para animação:
  const [attachmentAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (showAttachmentOptions) {
      Animated.timing(attachmentAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    } else {
      Animated.timing(attachmentAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }).start();
    }
  }, [showAttachmentOptions]);


  const handleRecordAudio = () => {
    setIsRecording(true);
    // Aqui você começaria a gravar com Expo Audio, se quiser.
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Aqui você pararia a gravação.
  };

  const handlePickFile = () => {
    setShowAttachmentOptions(!showAttachmentOptions);
  };

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
          {/* Opções de anexo */}
          {showAttachmentOptions && (
            <Animated.View
              style={{
                backgroundColor: "#333",
                paddingHorizontal: 10,
                borderRadius: 6,
                opacity: attachmentAnim,
                transform: [{
                  translateY: attachmentAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  })
                }],
              }}
            >
              {/* Botões de tipo de arquivo */}
              <View style={styles.attachmentPanel}>
                <TouchableOpacity style={styles.attachmentOption}>
                  <Ionicons name="musical-notes" size={20} color="#fff" />
                  <Text style={styles.attachmentText}>Áudio</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.attachmentOption}>
                  <Ionicons name="image" size={20} color="#fff" />
                  <Text style={styles.attachmentText}>Imagem</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.attachmentOption}>
                  <Ionicons name="document" size={20} color="#fff" />
                  <Text style={styles.attachmentText}>Documento</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.attachmentOption}>
                  <Ionicons name="videocam" size={20} color="#fff" />
                  <Text style={styles.attachmentText}>Vídeo</Text>
                </TouchableOpacity>
              </View>

              {/* Checkbox para permitir download */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
                <Checkbox
                  status={allowDownload ? 'checked' : 'unchecked'}
                  onPress={() => setAllowDownload(!allowDownload)}
                  color="#1E90FF"
                  uncheckedColor="#fff"
                />
                <Text style={{ color: '#fff' }}>Permitir download</Text>
              </View>

              {/* Visibilidade (Radio buttons com Checkbox visual) */}
              <View style={{ marginTop: 16 }}>
                <Text style={{ color: '#fff', marginBottom: 6 }}>Visibilidade:</Text>

                {[
                  { label: 'Visualização única', value: 'once' },
                  { label: 'Durante 24h', value: '24h' },
                  { label: 'Sempre', value: 'always' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => setVisibility(option.value)}
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                  >
                    <Checkbox
                      status={visibility === option.value ? 'checked' : 'unchecked'}
                      onPress={() => setVisibility(option.value)}
                      color="#1E90FF"
                      uncheckedColor="#fff"
                    />
                    <Text style={{ color: '#fff' }}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Gravação de áudio em andamento */}
          {isRecording && (
            <View style={styles.recordingBanner}>
              <Text style={{ color: "#fff", }}>Gravando áudio...</Text>
              <TouchableOpacity onPress={handleStopRecording} style={{ marginLeft: 12 }}>
                <Ionicons name="stop-circle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={handlePickFile} style={styles.iconButton}>
              <Ionicons name="attach" size={26} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRecordAudio} style={styles.iconButton}>
              <Ionicons name="mic" size={26} color="#ccc" />
            </TouchableOpacity>

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
    marginBottom: 10,
    //borderTopWidth: 1,
    borderTopColor: "#333",
    //backgroundColor: "#222",
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
  iconButton: {
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  recordingBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e53935",
    padding: 10,
    marginTop: 6,
    borderRadius: 6,
  },
  attachmentPanel: {
    backgroundColor: "#333",
    //padding: 10,
    marginTop: 18,
    //borderRadius: 6,
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-around",
  },
  attachmentOption: {
    alignItems: "center",
    borderColor: '#1E90FF',
    backgroundColor: '#1E90FF33',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    //alignSelf: "flex-start",
  },
  attachmentText: {
    color: "#fff",
    marginTop: 4,
    fontSize: 12,
  },
});

