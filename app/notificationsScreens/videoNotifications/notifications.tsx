// app/notificationsScreens/videoNotifications/notifications.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
//import { useSelector } from 'react-redux';
//import { RootState } from '@/src/redux/store'; // Importe RootState para acessar o estado do Redux
import { useSelector, useDispatch } from 'react-redux'; // ADIÇÃO: Importar useDispatch
import { RootState, AppDispatch } from '@/src/redux/store'; // ADIÇÃO: Importar AppDispatch
//import VideoItem from '@/components/PlayerVideoComponents/VideoItem'; // Reutilizar o VideoItem
// ADIÇÃO: Importar as ações e a interface do slice de notificações
import {
    addNotifications,
    removeNotification,
    removeAllNotifications,
    markNotificationAsRead,
    VideoNotification, // Usar a interface do slice
} from '@/src/redux/notificationsSlice';
//import { MOCKED_VIDEO_DATA } from '@/app/(tabs)/videoClipes'; // ALTERAÇÃO: Assumindo que MOCKED_VIDEO_DATA é importado de VideoClipes.tsx

// Interface para os dados do vídeo (certifique-se de que é a mesma usada em VideoClipes.tsx)
interface VideoData {
    id: string;
    title: string;
    artist: string;
    artistId: string;
    artistProfileImageUrl?: string;
    thumbnail: string;
    videoUrl: string;
    uploadTime: string; // Adicionado para simular "novos" vídeos
    read: boolean;
}

// Dados de exemplo (mockados) - Idealmente, isso viria de uma API.
// Incluí 'uploadTime' para simular quais vídeos são "novos".
const MOCKED_VIDEO_DATA: VideoData[] = [
    { id: '1', title: 'Minha Música Perfeita', artist: 'Artista A', artistId: 'artist1', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=1', thumbnail: 'https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', uploadTime: 'há 1 dia', read: false },
    { id: '2', title: 'Ritmo da Cidade Noturna', artist: 'Banda B', artistId: 'artist2', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=2', thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', uploadTime: 'há 2 dias', read: false },
    { id: '3', title: 'Noite Estrelada de Verão', artist: 'Cantor C', artistId: 'artist3', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=3', thumbnail: 'https://i.ytimg.com/vi/3y7Kq2l_k6w/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/c.mp4', uploadTime: 'há 1 semana', read: false },
    { id: '4', title: 'Sons da Natureza Selvagem', artist: 'Grupo D', artistId: 'artist4', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=4', thumbnail: 'https://i.ytimg.com/vi/F-glUq_jWv0/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/d.mp4', uploadTime: 'há 3 dias', read: false },
    { id: '5', title: 'Caminhos da Descoberta', artist: 'Artista E', artistId: 'artist5', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=5', thumbnail: 'https://i.ytimg.com/vi/2N7TfX6f4oM/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/a.mp4', uploadTime: 'há 4 dias', read: false },
    { id: '6', title: 'Amanhecer Dourado', artist: 'Solista F', artistId: 'artist6', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=6', thumbnail: 'https://i.ytimg.com/vi/eJk8e8e8e8e/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/b.mp4', uploadTime: 'há 1 mês', read: false },
    { id: '7', title: 'Energia Vibrante', artist: 'DJ G', artistId: 'artist7', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=7', thumbnail: 'https://i.ytimg.com/vi/xM6uD7n1BfQ/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/c.mp4', uploadTime: 'há 2 horas', read: true }, // Este é bem novo!
    { id: '8', title: 'Reflexões Profundas', artist: 'Poeta H', artistId: 'artist8', artistProfileImageUrl: 'https://i.pravatar.cc/150?img=8', thumbnail: 'https://i.ytimg.com/vi/wA5wA5wA5wA/hqdefault.jpg', videoUrl: 'http://d23dyxekqfd0rc.cloudfront.net/d.mp4', uploadTime: 'há 5 dias', read: true },
    // Adicione mais vídeos aqui, se quiser testar mais casos
];

export default function NotificationsScreen() {
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch(); // ADIÇÃO: Hook useDispatch

    // ADIÇÃO: Obter as notificações do estado global do Redux
    const notifications = useSelector((state: RootState) => state.notifications.notifications);
    const followedArtists = useSelector((state: RootState) => state.followedArtists.artists);

    // REMOÇÃO: Não precisamos mais do estado local 'newVideos'

    useEffect(() => {
        const followedArtistIds = followedArtists.map(artist => artist.id);
        const recentVideos: VideoNotification[] = MOCKED_VIDEO_DATA.filter(video => {
            const isFollowed = followedArtistIds.includes(video.artistId);
            const isRecent = video.uploadTime.includes('horas') || video.uploadTime.includes('dia');
            return isFollowed && isRecent;
        })
            .map(video => ({ // ALTERAÇÃO: Garanta que todas as propriedades do 'video' original sejam copiadas
                ...video, // Isso copia todas as propriedades de 'video', incluindo 'uploadTime'
                read: false // E adiciona/sobrescreve 'read'
            }));
        // ADIÇÃO: Despacha a ação para adicionar as notificações iniciais (se ainda não existirem no Redux)
        // Isso evita adicionar duplicatas toda vez que o componente renderiza.
        // Comparar o length pode ser simples demais, para um app real, você verificaria IDs únicos.
        if (notifications.length === 0 && recentVideos.length > 0) {
            dispatch(addNotifications(recentVideos));
        }

    }, [followedArtists, dispatch, notifications.length]); // ALTERAÇÃO: Adicionar dependências para useEffect (dispatch e notifications.length)

    const handleVideoPress = (item: VideoNotification) => { // ALTERAÇÃO: Usar VideoNotification
        console.log(`Tentando reproduzir vídeo de notificação: ${item.title}`);
        dispatch(markNotificationAsRead(item.id)); // ADIÇÃO: Marca a notificação como lida ao clicar
        router.push({
            pathname: '/(tabs)/videoClipes', // Navega para a tela principal de vídeos
            params: {
                videoIdToPlay: item.id // Você precisaria de lógica em VideoClipes.tsx para lidar com isso
            }
        });
    };

    // ADIÇÃO: Função para remover uma notificação individualmente
    const handleRemoveNotification = (notificationId: string) => {
        Alert.alert(
            'Confirmar',
            'Tem certeza que deseja remover esta notificação?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    onPress: () => {
                        dispatch(removeNotification(notificationId)); // ADIÇÃO: Despacha a ação removeNotification do Redux
                        Alert.alert('Notificação Removida', 'A notificação foi removida com sucesso.');
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    // ADIÇÃO: Função para remover todas as notificações
    const handleRemoveAllNotifications = () => {
        Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza de que deseja remover todas as notificações?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Remover Todas',
                    onPress: () => {
                        dispatch(removeAllNotifications()); // ADIÇÃO: Despacha a ação removeAllNotifications do Redux
                        Alert.alert('Sucesso', 'Todas as notificações foram removidas.');
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false, // Oculta o cabeçalho padrão
                    animation: 'slide_from_right',
                }}
            />
            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notificações de Vídeos</Text>
                {/* ADIÇÃO: Botão "Remover Todas" no cabeçalho */}
                {notifications.length > 0 && ( // Só mostra se houver notificações
                    <TouchableOpacity
                        onPress={handleRemoveAllNotifications}
                        style={styles.removeAllButton}
                        accessibilityLabel="Remover todas as notificações"
                    >
                        <Text style={styles.removeAllButtonText}>Remover Todas</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Lista de Notificações (Novos Vídeos) */}
            {notifications.length > 0 ? (
                <FlatList
                    data={notifications} // ALTERAÇÃO: Dados vêm do estado global 'notifications' do Redux
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={[styles.notificationItem, item.read && styles.readNotification]}> {/* ADIÇÃO: Estilo condicional para notificação lida */}
                            <TouchableOpacity onPress={() => handleVideoPress(item)} style={styles.notificationContent}> {/* ADIÇÃO: TouchableOpacity para conteúdo clicável */}
                                {/* Poderíamos ter uma imagem do perfil do artista aqui também */}
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        source={item.artistProfileImageUrl ? { uri: item.artistProfileImageUrl } : require('@/assets/images/Default_Profile_Icon/unknown_artist.png')}
                                        style={styles.artistProfileImage}
                                    />
                                    <View style={styles.videoInfo}>
                                        <Text style={styles.notificationText}>
                                            <Text style={styles.artistNameHighlight}>{item.artist}</Text>, novo vídeo: <Text style={styles.videoTitleHighlight}>{item.title}</Text>
                                        </Text>
                                        <Text style={styles.uploadTimeText}>{item.uploadTime}</Text>
                                    </View>
                                </View>
                                {/* Poderíamos adicionar o thumbnail do vídeo também <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />*/}
                            </TouchableOpacity>
                            {/* ADIÇÃO: Botão de remover notificação individual */}
                            <TouchableOpacity
                                onPress={() => handleRemoveNotification(item.id)}
                                style={styles.removeIndividualButton}
                                accessibilityLabel={`Remover notificação do vídeo ${item.title}`}
                            >
                                <Text style={styles.removeButtonText}>Remover</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    contentContainerStyle={styles.flatListContentContainer}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyListContainer}>
                    <Text style={styles.emptyListText}>Nenhuma notificação de novos vídeos no momento.</Text> {/* ALTERAÇÃO: Texto mais genérico */}
                    <Text style={styles.emptyListSubText}>Comece a seguir artistas para receber atualizações!</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#191919',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        //fontWeight: 'bold',
        flexShrink: 1,
        // REMOÇÃO IMPLÍCITA: `flex: 1` foi removido daqui para dar espaço ao botão "Remover Todas"
    },
    // ADIÇÃO: Estilo para o botão "Remover Todas"
    removeAllButton: {
        marginLeft: 'auto', // Empurra para a direita
        backgroundColor: '#444', // Cor vermelha para indicar ação de exclusão
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    // ADIÇÃO: Estilo para o texto do botão "Remover Todas"
    removeAllButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    removeButtonText: {
        color: '#FF3D00',
        fontSize: 14,
        fontWeight: 'bold',
    },
    flatListContentContainer: {
        paddingVertical: 10,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#333',
        backgroundColor: '#282828', // Um pouco mais claro para destacar
        marginBottom: 5,
        borderRadius: 8,
        marginHorizontal: 10,
    },
    // ADIÇÃO: Estilo para notificações lidas (opcional, para visualização)
    readNotification: {
        opacity: 0.7, // Torna notificações lidas um pouco transparentes
        backgroundColor: '#1f1f1f', // Cor de fundo mais escura para lidas
    },
    // ADIÇÃO: Estilo para o conteúdo clicável da notificação (excluindo o botão de remover)
    notificationContent: {
        //flexDirection: 'row',
        //alignItems: 'center',
        flex: 1, // Permite que o conteúdo ocupe o máximo de espaço possível
        marginRight: 10, // Espaço entre o conteúdo e o botão de remover
    },
    artistProfileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#555',
    },
    videoInfo: {
        flex: 1, // Para ocupar o espaço restante
        marginRight: 10,
    },
    notificationText: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
    },
    artistNameHighlight: {
        fontWeight: 'bold',
        color: '#1E90FF', // Cor de destaque para o artista
    },
    videoTitleHighlight: {
        fontWeight: 'bold',
        color: '#FFD700', // Cor de destaque para o título do vídeo
    },
    uploadTimeText: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 2,
    },
    videoThumbnail: {
        width: 80,
        height: 45, // Proporção 16:9
        borderRadius: 4,
        backgroundColor: '#444',
    },
    // ADIÇÃO: Estilo para o botão de remover individual
    removeIndividualButton: {
        padding: 5,
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 50,
    },
    emptyListText: {
        color: '#ccc',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 8,
    },
    emptyListSubText: {
        color: '#888',
        fontSize: 14,
        textAlign: 'center',
    },
});