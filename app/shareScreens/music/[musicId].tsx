// app/shareScreens/music/[musicId].tsx
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
    Share, // <-- Adicionado para o compartilhamento nativo final
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

const ShareMusicScreen = () => { // Renomeado para ShareMusicScreen
    // Obtém todos os parâmetros de uma vez
    const params = useLocalSearchParams();

    // Garante que cada parâmetro seja uma string, tratando o caso de ser um array
    // O nome dos parâmetros agora reflete o que foi passado do AudioPlayerBar
    const musicId = Array.isArray(params.musicId) ? params.musicId[0] : (params.musicId || '');
    const musicTitle = Array.isArray(params.musicTitle) ? params.musicTitle[0] : (params.musicTitle || 'Título Desconhecido');
    const artistName = Array.isArray(params.artistName) ? params.artistName[0] : (params.artistName || 'Artista Desconhecido');
    const albumArtUrl = Array.isArray(params.albumArtUrl)
        ? params.albumArtUrl[0]
        : (params.albumArtUrl || ''); // Usado 'albumArtUrl' conforme passado do AudioPlayerBar

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

    const handleShare = async () => { // Adicionado 'async'
        if (selectedUsers.length === 0) {
            Alert.alert('Nenhum selecionado', 'Por favor, selecione pelo menos um amigo ou seguidor para compartilhar internamente.');
            return;
        }

        const selectedUserNames = usersToShow
            .filter(user => selectedUsers.includes(user.id))
            .map(user => user.name)
            .join(', ');

        Alert.alert(
            'Música Compartilhada Internamente!',
            `"${musicTitle}" de ${artistName} compartilhado com: ${selectedUserNames}`
        );

        // Lógica para compartilhar a música internamente no seu aplicativo
        // Por exemplo, enviar uma notificação para esses usuários, salvar no banco de dados, etc.
        console.log('Compartilhando música internamente:', { musicId, selectedUsers });

        // Opcional: Aqui você pode adicionar um pop-up ou outra opção
        // para o usuário decidir se quer compartilhar externamente também.
        // Por exemplo, após o compartilhamento interno, perguntar: "Deseja compartilhar em outras plataformas?"
    };

    // ✨ NOVO: Função para o compartilhamento nativo (para fora do app)
    const handleNativeShare = async () => {
        try {
            // Criar um link compartilhável para a música (URL real da música no seu app ou um link genérico)
            // Exemplo: se suas músicas tiverem uma página web: `https://seusite.com/musica/${musicId}`
            const shareableLink = `https://kiuplay.com/music/${musicId}`; // Substitua pelo link real da sua música

            const result = await Share.share({
                message: `Ouça agora: ${musicTitle} de ${artistName} na Kiuplay!`,
                url: shareableLink,
                title: `Compartilhar Música: ${musicTitle}`,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log(`Compartilhado com o tipo de atividade: ${result.activityType}`);
                } else {
                    console.log('Compartilhado com sucesso!');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Compartilhamento nativo cancelado.');
            }
        } catch (error: any) {
            console.error('Erro ao compartilhar nativamente:', error.message);
            Alert.alert('Erro', 'Não foi possível preparar o compartilhamento nativo.');
        }
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
                    title: 'Partilhar Música', // Título adaptado
                    headerStyle: { backgroundColor: '#1E1E1E' },
                    headerTintColor: '#fff',
                }}
            />

            <View style={styles.musicInfoCard}> {/* Renomeado para musicInfoCard */}
                {/* Agora albumArtUrl é garantido ser uma string ou vazia */}
                {albumArtUrl ? (
                    <Image source={{ uri: albumArtUrl }} style={styles.albumArt} />
                ) : (
                    // Opcional: um placeholder visual caso a capa não esteja disponível
                    <View style={styles.albumArtPlaceholder}> {/* Renomeado para albumArtPlaceholder */}
                        <Ionicons name="image-outline" size={40} color="#888" />
                    </View>
                )}
                <View style={styles.musicTextInfo}> {/* Renomeado para musicTextInfo */}
                    <Text style={styles.musicTitle}>{musicTitle}</Text> {/* Renomeado para musicTitle */}
                    <Text style={styles.artistName}>{artistName}</Text> {/* Renomeado para artistName */}
                </View>
            </View>

            <TouchableOpacity style={styles.nativeShareButton} onPress={handleNativeShare}>
                <Ionicons name="share-outline" size={22} color="#fff" />
                <Text style={styles.nativeShareButtonText}>Partilhar em outras apps</Text>
            </TouchableOpacity>

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
                    Partilhar Internamente {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}
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
    // Renomeado para refletir 'música'
    musicInfoCard: {
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    // Renomeado para refletir 'capa do álbum'
    albumArt: {
        width: 80,
        height: 80, // Capas de álbum costumam ser quadradas
        borderRadius: 4,
        marginRight: 10,
        backgroundColor: '#333',
    },
    albumArtPlaceholder: {
        width: 80,
        height: 80, // Capas de álbum costumam ser quadradas
        borderRadius: 4,
        marginRight: 10,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    musicTextInfo: {
        flex: 1,
    },
    musicTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    artistName: {
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
        color: '#888',
        fontSize: 16,
        fontWeight: 'bold',
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
    // ✨ NOVO: Estilos para o botão de compartilhamento nativo
    nativeShareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#34A853', // Um verde para destacar o compartilhamento externo
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 15,
        gap: 8,
    },
    nativeShareButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ShareMusicScreen;