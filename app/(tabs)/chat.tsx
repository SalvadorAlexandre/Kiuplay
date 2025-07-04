// app/(tabs)/chat.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useChatTabs from "@/hooks/useChatTabs";
import TopTabBarChat from "@/components/topTabBarChatScreen";
import ChatListItem from "@/components/ChatComponents/ChatListItem"
import UserDiscoveryItem from "@/components/ChatComponents/UserDiscoveryItem"
import FriendRequestItem from "@/components/ChatComponents/FriendRequestItem"
import GroupItem from "@/components/ChatComponents/GroupItem"

export default function ChatScreen() {
  const { activeTab, handleTabChange } = useChatTabs();

  const [message, setMessage] = useState("") //Hook para armazenar a mensagem
  const handleSendMessage = () => {
    if (message.trim() === "") return
    alert(`Mensagem enviada: ${message}`)
    setMessage("")
  }

  //DADOS FICTICIOS PARA A TAB TODAS
  const mockConversations = [
    {
      id: "1",
      name: "Maria",
      avatar: undefined,
      lastMessage: "Oi, tudo bem?",
      timestamp: "14:30",
      unreadCount: 2,
    },
    {
      id: "2",
      name: "João",
      avatar: "https://i.pravatar.cc/100",
      lastMessage: "Enviei o beat.",
      timestamp: "Ontem",
      unreadCount: 0,
    },
  ];
  //DADOS FICTICIOS PARA A TAB USUARIOS
  const mockUsers = [
    {
      id: "1",
      name: "Ana Souza",
      avatar: undefined,
      bio: "Produtora de beats",
      isFollowing: false,
    },
    {
      id: "2",
      name: "DJ BeatMaster",
      avatar: "https://i.pravatar.cc/150?img=5",
      bio: "Artista independente",
      isFollowing: true,
    },
  ];
  //DADOS FICTICIOS PARA A TAB PEDIDOS
  const mockRequests = [
    {
      id: "1",
      name: "Marcos Vinicius",
      avatar: undefined,
      bio: "Produtor de beats",
    },
    {
      id: "2",
      name: "DJ Flow",
      avatar: "https://i.pravatar.cc/150?img=12",
      bio: "Cantor e compositor",
    },
  ];

  //DADOS FICTICIOS PARA A TAB GRUPOS
  const mockGroups = [
    {
      id: "g1",
      name: "Kiuplay Producers",
      avatar: undefined,
      description: "23 membros",
    },
    {
      id: "g2",
      name: "Rappers Angola",
      avatar: "https://i.pravatar.cc/150?img=15",
      description: "8 membros",
    },
  ];


  return (
    <View style={styles.container}>
      {/* Topo fixo */}
      <TopTabBarChat />

      {/* Cabeçalho e tabs */}
      <View style={styles.header}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            Tire o máximo proveito do KiuplayChat para interagir e colaborar com
            Produtores e Artistas da comunidade Kiuplay!
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {["todas", "naolidas", "usuarios", "pedidos", "grupos"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() =>
                handleTabChange(
                  tab as
                  | "todas"
                  | "naolidas"
                  | "usuarios"
                  | "pedidos"
                  | "grupos"
                )
              }
              style={[
                styles.tabButton,
                activeTab === tab && styles.tabButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.tabButtonCreate}>
            <Text style={styles.tabTextCreate}>Criar grupo</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Conteúdo ocupando o resto */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "todas" && (
          <>
            {mockConversations.map((item) => (
              <ChatListItem
                key={item.id}
                id={item.id}
                name={item.name}
                avatar={item.avatar}
                lastMessage={item.lastMessage}
                timestamp={item.timestamp}
                unreadCount={item.unreadCount}
                onPress={(id) => {
                  // Aqui você vai navegar para a tela de chat individual
                  console.log("Abrir conversa com", id);
                }}
              />
            ))}
          </>
        )}
        {activeTab === "naolidas" && (
          <Text style={styles.sectionText}>Mensagens não lidas</Text>
        )}
        {activeTab === "usuarios" && (
          <>
            {mockUsers.map((user) => (
              <UserDiscoveryItem
                key={user.id}
                id={user.id}
                name={user.name}
                avatar={user.avatar}
                bio={user.bio}
                isFollowing={user.isFollowing}
                onFollowPress={(id) => {
                  console.log("Seguir/cancelar seguir:", id);
                }}
                onProfilePress={(id) => {
                  console.log("Abrir perfil do usuário:", id);
                }}
              />
            ))}
          </>
        )}
        {activeTab === "pedidos" && (
          <>
            {mockRequests.map((req) => (
              <FriendRequestItem
                key={req.id}
                id={req.id}
                name={req.name}
                avatar={req.avatar}
                bio={req.bio}
                onAccept={(id) => {
                  console.log("Aceitou o pedido:", id);
                }}
                onReject={(id) => {
                  console.log("Rejeitou o pedido:", id);
                }}
                onProfilePress={(id) => {
                  console.log("Abriu perfil:", id);
                }}
              />
            ))}
          </>
        )}
        {activeTab === "grupos" && (
          <>
            {mockGroups.map((group) => (
              <GroupItem
                key={group.id}
                id={group.id}
                name={group.name}
                avatar={group.avatar}
                description={group.description}
                onPress={(id) => {
                  console.log("Entrou no chat do grupo:", id);
                }}
              />
            ))}
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/*TextInput fixo para as SMS*/}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Escreva uma mensagem..."
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // essencial para ocupar toda a tela
    backgroundColor: "#191919",
  },
  header: {
    flexShrink: 0, // cabeçalho não ocupa espaço do flex
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  descriptionText: {
    color: "#ccc",
    fontSize: 14,
  },
  tabsContent: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#333",
    marginRight: 8,
  },
  tabButtonActive: {
    backgroundColor: "#1565C0",
  },
  tabText: {
    color: "#aaa",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#fff",
  },
  tabButtonCreate: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#28a745",
    marginLeft: 8,
  },
  tabTextCreate: {
    color: "#fff",
    fontWeight: "bold",
  },
  contentScroll: {
    flex: 1, // ESSENCIAL: ocupa o espaço restante
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 12,
  },
  messageInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  messageInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#333",
    borderRadius: 20,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#1565C0",
    alignItems: 'center',
    justifyContent: 'center',
    //padding: 10,
    width: 50,
    height: 50,
    borderRadius: 100,
  },
});