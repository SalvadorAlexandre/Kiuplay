// components/PlayerVideoComponents/VideoInfoAndActions.tsx
import React, { useState } from 'react'; // Não precisamos mais de useState aqui
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomHalfModal from '@/components/commentScreens/BottomHalfModal'; // Ajuste o caminho se necessário

export interface VideoInfoAndActionsProps {
    title: string;
    artist: string;
    videoId: string; // Adicione o ID do vídeo para que as funções de callback saibam qual vídeo atualizar
    liked: boolean; // Estado de 'curtido' recebido como prop
    disliked: boolean; // Estado de 'descurtido' recebido como prop
    isFavorited: boolean; // Estado de 'favorito' recebido como prop
    onToggleLike: (videoId: string) => void; // Função para alternar o like, recebida como prop
    onToggleDislike: (videoId: string) => void; // Função para alternar o dislike, recebida como prop
    onToggleFavorite: (videoId: string) => void; // Função para alternar o favorito, recebida como prop
}

const VideoInfoAndActions = ({
    title,
    artist,
    videoId,
    liked,
    disliked,
    isFavorited,
    onToggleLike,
    onToggleDislike,
    onToggleFavorite,
}: VideoInfoAndActionsProps) => {
    // Agora as funções de toggle apenas chamam as props, passando o ID do vídeo
    // Não há mais estado interno (useState) aqui para liked, disliked, isFavorited

    const [isCommentModalVisible, setCommentModalVisible] = useState(false);
    const [commentText, setCommentText] = useState('');

    const handleOpenCommentModal = () => {
        setCommentModalVisible(true);
    };

    const handleCloseCommentModal = () => {
        setCommentModalVisible(false);
    };

    const handleSubmitComment = () => {
        console.log("Comentário enviado:", commentText);
        // Lógica para enviar o comentário (ex: API call)
        setCommentText(''); // Limpa o campo
        handleCloseCommentModal(); // Fecha o modal após enviar
    };

    return (
        <View style={styles.infoContainer}>
            {/* Artist Profile and Follow Button Row */}
            <View style={styles.artistRow}>
                <Image
                    source={require('@/assets/images/Default_Profile_Icon/unknown_artist.png')}
                    style={styles.profileImage}
                />
                <Text style={styles.artistName}>{artist}</Text>
                <Text style={styles.followersText} numberOfLines={1}> | 500 mil seguidores</Text>
                <TouchableOpacity style={styles.followButton} onPress={() => { /* Follow logic */ }}>
                    <Text style={styles.followButtonText}>Seguir</Text>
                </TouchableOpacity>
            </View>

            {/* Video Title and Views/Time */}
            <Text style={styles.mainVideoTitle}>{title}</Text>
            <Text style={styles.viewsTimeText} numberOfLines={1}>8 mil visualizações há 3 semanas</Text>

            {/* Action Buttons (Likes, Dislikes, Download, Share, Playlist) */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.actionButtonsContent}
            >
                <View style={styles.actionButtons}>
                    {/* Like Button */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onToggleLike(videoId)} // Chama a prop passando o videoId
                    >
                        <Image
                            source={
                                liked
                                    ? require('@/assets/images/videoItems/icons8_like_120px_2.png')
                                    : require('@/assets/images/videoItems/icons8_like_outline_120px.png')
                            }
                            style={[
                                styles.iconButton,
                                { tintColor: liked ? '#1E90FF' : '#fff' },
                            ]}
                        />
                        <Text style={styles.actionButtonText}>12.1K</Text>
                    </TouchableOpacity>

                    {/* Dislike Button */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onToggleDislike(videoId)} // Chama a prop passando o videoId
                    >
                        <Image
                            source={
                                disliked
                                    ? require('@/assets/images/videoItems/icons8_not_like_120px.png')
                                    : require('@/assets/images/videoItems/icons8_not_like_outline_120px.png')
                            }
                            style={[
                                styles.iconButton,
                                { tintColor: disliked ? '#fff' : '#fff' },
                            ]}
                        />
                        <Text style={styles.actionButtonText}>2</Text>
                    </TouchableOpacity>

                    {/* Favorite/Heart Button */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onToggleFavorite(videoId)} // Chama a prop passando o videoId
                    >
                        <Ionicons
                            name={isFavorited ? "heart" : "heart-outline"}
                            size={23}
                            color={isFavorited ? "#FF3D00" : "#fff"}
                        />
                        <Text style={styles.actionButtonText}>14K</Text>
                    </TouchableOpacity>

                    {/* Download Button */}
                    <TouchableOpacity style={styles.actionButton} onPress={() => { /* Download logic */ }}>
                        <Image
                            source={require('@/assets/images/audioPlayerBar/icons8_download_120px_2.png')}
                            style={styles.iconButton}
                        />
                        <Text style={styles.actionButtonText}>Baixar</Text>
                    </TouchableOpacity>

                    {/* Comment Button */}
                    <TouchableOpacity style={styles.actionButton} onPress={handleOpenCommentModal}>
                        <Image
                            source={require('@/assets/images/audioPlayerBar/icons8_sms_120px.png')}
                            style={styles.iconButton}
                        />
                        <Text style={styles.actionButtonText}>Coment.</Text>
                    </TouchableOpacity>

                    {/* Share Button */}
                    <TouchableOpacity style={styles.actionButton} onPress={() => { /* Share logic */ }}>
                        <Ionicons name="share-social-outline" size={23} color="#fff" />
                        <Text style={styles.actionButtonText}>Compart.</Text>
                    </TouchableOpacity>

                    {/* Add to Playlist Button */}
                    <TouchableOpacity style={styles.actionButton} onPress={() => { /* Add to playlist logic */ }}>
                        <Ionicons name="list" size={23} color="#fff" />
                        <Text style={styles.actionButtonText}>Playlist</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {/* O Modal é renderizado aqui */}
            <BottomHalfModal
                isVisible={isCommentModalVisible}
                onClose={handleCloseCommentModal}
                heightPercentage={0.7} // Este modal ocupará 70% da altura da tela
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Adicionar Comentário</Text>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Digite seu comentário aqui..."
                        placeholderTextColor="#888"
                        multiline
                        value={commentText}
                        onChangeText={setCommentText}
                    />
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmitComment}
                        disabled={commentText.trim().length === 0} // Desabilita se o comentário estiver vazio
                    >
                        <Text style={styles.submitButtonText}>Enviar Comentário</Text>
                    </TouchableOpacity>
                </View>
            </BottomHalfModal>
        </View>
    );
};

const styles = StyleSheet.create({
    infoContainer: {
        padding: 15,
        backgroundColor: '#191919',
    },
    artistRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 10,
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#444',
    },
    artistName: {
        color: '#fff',
        fontSize: 18,
    },
    followersText: {
        color: '#b3b3b3',
        fontSize: 14,
        flex: 1,
    },
    followButton: {
        backgroundColor: '#1E90FF',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    followButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    mainVideoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    viewsTimeText: {
        color: '#b3b3b3',
        fontSize: 14,
        marginBottom: 10,
    },
    actionButtonsContent: {
        paddingRight: 20,
        alignItems: 'center',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    actionButton: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        borderRadius: 20,
        backgroundColor: '#333',
        paddingVertical: 8,
        paddingHorizontal: 18,
    },
    iconButton: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 12,
    },


    modalContent: {
        flex: 1, // Faz o conteúdo ocupar o espaço disponível no modal
        width: '100%',
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    commentInput: {
        width: '100%',
        height: 120,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        textAlignVertical: 'top', // Para o texto começar no topo em multiline
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#28a745', // Verde para o botão de enviar
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default VideoInfoAndActions;