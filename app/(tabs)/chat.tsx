// app/(tabs)/chat.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useChatTabs from "@/hooks/useChatTabs";
import TopTabBarChat from "@/components/topTabBarChatScreen";
import ChatListItem from "@/components/ChatComponents/ChatListItem"
import UserDiscoveryItem from "@/components/ChatComponents/UserDiscoveryItem"
import FriendRequestItem from "@/components/ChatComponents/FriendRequestItem"
import GroupItem from "@/components/ChatComponents/GroupItem"
import { useRouter } from 'expo-router'


export default function ChatScreen() {
  const { activeTab, handleTabChange } = useChatTabs(); //Hook para controlar tabs ativas e inativas
  const [expanded, setExpanded] = useState(false); //Hook para controlar conteudo expandido

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

  const router = useRouter()

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
          <TouchableOpacity
          style={styles.tabButtonCreate}
          onPress={() => router.push("/createGroup/CreateGroup")}
          >
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
                  router.push({
                    pathname: "/ChatDetail/[id]",
                    params: { id },
                  })
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
                  router.push({
                    pathname: "/UserProfile/[id]",
                    params: { id },
                  });
                  console.log("Abrir perfil do usuário:", id);
                }}
              />
            ))}
          </>
        )}
        {activeTab === "pedidos" && (
          <>
            <View style={styles.discoveryContainer}>
              {/* Linha de topo */}
              <View style={styles.headerRow}>
                <Image
                  source={require("@/assets/images/4/icons8_info_120px.png")}
                  style={styles.iconLeft}
                />
                <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                  <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>

              {/* Conteúdo expansível */}
              {expanded && (
                <View style={styles.expandedContent}>
                  <Text style={styles.userHandle}>
                    A opção (aguardar que eu responda pedidos) está ativada! Significa
                    que ninguém poderá te enviar mensagens sem aceitares antes o
                    pedido. Acesse as definições para mudar...
                  </Text>
                  <TouchableOpacity style={styles.ButtonChange}>
                    <Text style={styles.tabTextCreate}>Mudar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
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
                  router.push({
                    pathname: "/FriendRequest/[id]",
                    params: { id },
                  });
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
                  router.push({
                    pathname: "/GroupChat/[id]",
                    params: { id },
                  });
                  console.log("Entrou no chat do grupo:", id);
                }}
              />
            ))}
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
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
  discoveryContainer: {
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    marginTop: -10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconLeft: {
    width: 24,
    height: 24,
    //tintColor: "#fff",
  },
  expandedContent: {
    marginTop: 8,
  },
  userHandle: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 8,
  },
  ButtonChange: {
    borderColor: '#1E90FF',
    backgroundColor: '#1E90FF33',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
  },
  tabTextCreate: {
    color: "#fff",
    fontWeight: "bold",
  },
});