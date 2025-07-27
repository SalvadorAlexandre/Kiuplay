// app/shareScreens/videos/[videoId].tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Dados mockados para demonstração
interface User {
  id: string;
  name: string;
  profileImage: string;
}

const mockFollowers: User[] = [
  { id: '1', name: 'Ana Silva', profileImage: 'https://via.placeholder.com/50/FF5733/FFFFFF?text=AS' },
  { id: '2', name: 'Bruno Costa', profileImage: 'https://via.placeholder.com/50/33FF57/FFFFFF?text=BC' },
  { id: '3', name: 'Carla Dias', profileImage: 'https://via.placeholder.com/50/3357FF/FFFFFF?text=CD' },
  { id: '4', name: 'Daniel Alves', profileImage: 'https://via.placeholder.com/50/FF33A1/FFFFFF?text=DA' },
];

const mockFriends: User[] = [
  { id: '5', name: 'Eduardo Lima', profileImage: 'https://via.placeholder.com/50/57FF33/FFFFFF?text=EL' },
  { id: '6', name: 'Fernanda Rocha', profileImage: 'https://via.placeholder.com/50/A133FF/FFFFFF?text=FR' },
  { id: '7', name: 'Gustavo Santos', profileImage: 'https://via.placeholder.com/50/FFD133/FFFFFF?text=GS' },
];

const ShareVideoScreen = () => {
  // Obtém todos os parâmetros de uma vez
  const params = useLocalSearchParams();

  // Garante que cada parâmetro seja uma string, tratando o caso de ser um array
  const videoId = Array.isArray(params.videoId) ? params.videoId[0] : (params.videoId || '');
  const videoTitle = Array.isArray(params.videoTitle) ? params.videoTitle[0] : (params.videoTitle || 'Título Desconhecido');
  const videoArtist = Array.isArray(params.videoArtist) ? params.videoArtist[0] : (params.videoArtist || 'Artista Desconhecido');
  const videoThumbnailUrl = Array.isArray(params.videoThumbnailUrl)
    ? params.videoThumbnailUrl[0]
    : (params.videoThumbnailUrl || ''); // Garante que seja string ou vazia

  const [activeTab, setActiveTab] = useState<'followers' | 'friends'>('followers');
  const [searchText, setSearchText] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // IDs dos usuários selecionados

  const usersToShow = activeTab === 'followers' ? mockFollowers : mockFriends;

  const filteredUsers = usersToShow.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleShare = () => {
    if (selectedUsers.length === 0) {
      Alert.alert('Nenhum selecionado', 'Por favor, selecione pelo menos um amigo ou seguidor para compartilhar.');
      return;
    }
    // Lógica para compartilhar o vídeo
    const selectedUserNames = usersToShow
      .filter(user => selectedUsers.includes(user.id))
      .map(user => user.name)
      .join(', ');

    Alert.alert(
      'Vídeo Compartilhado!',
      `"${videoTitle}" de ${videoArtist} compartilhado com: ${selectedUserNames}`
    );
    // Aqui você integraria a lógica real de compartilhamento,
    // como enviar uma notificação, salvar no banco de dados, etc.
    console.log('Compartilhando vídeo:', { videoId, selectedUsers });
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => toggleSelectUser(item.id)}
    >
      <Image source={{ uri: item.profileImage }} style={styles.userProfileImage} />
      <Text style={styles.userName}>{item.name}</Text>
      {selectedUsers.includes(item.id) ? (
        <Ionicons name="checkmark-circle" size={24} color="#1E90FF" />
      ) : (
        <View style={styles.checkboxOutline} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Partilhar Vídeo',
          //headerTitleAlign: 'center', // Centraliza o título do cabeçalho
          headerStyle: { backgroundColor: '#1E1E1E' },
          headerTintColor: '#fff',
        }}
      />

      <View style={styles.videoInfoCard}>
        {/* Agora videoThumbnailUrl é garantido ser uma string ou vazia */}
        {videoThumbnailUrl ? (
          <Image source={{ uri: videoThumbnailUrl }} style={styles.videoThumbnail} />
        ) : (
          // Opcional: um placeholder visual caso a thumbnail não esteja disponível
          <View style={styles.videoThumbnailPlaceholder}>
            <Ionicons name="image-outline" size={40} color="#888" />
          </View>
        )}
        <View style={styles.videoTextInfo}>
          <Text style={styles.videoTitle}>{videoTitle}</Text>
          <Text style={styles.videoArtist}>{videoArtist}</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar seguidores/amigos"
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'followers' && styles.activeTab]}
          onPress={() => setActiveTab('followers')}
        >
          <Text style={[styles.tabText, activeTab === 'followers' && styles.activeTabText]}>
            Seguidores
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
            Amigos
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.shareButton}
        onPress={handleShare}
        disabled={selectedUsers.length === 0}
      >
        <Text style={styles.shareButtonText}>
          Partilhar com {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
    padding: 15,
  },
  videoInfoCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  videoThumbnail: {
    width: 80,
    height: 45,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: '#333',
  },
  videoThumbnailPlaceholder: {
    width: 80,
    height: 45,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTextInfo: {
    flex: 1,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  videoArtist: {
    color: '#ccc',
    fontSize: 13,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#fff',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1E90FF',
  },
  tabText: {
    color: '#aaa',
    fontSize: 13,
  },
  activeTabText: {
    color: '#1E90FF',
  },
  listContent: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  userProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#333',
  },
  userName: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  checkboxOutline: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#888',
  },
  shareButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ShareVideoScreen;
