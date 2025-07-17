// components/PlayerVideoComponents/VideoInfoAndActions.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert, // Importar Alert para exibir mensagens ao usuário
    Platform, // Importar Platform para checar o ambiente
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { addFollowedArtist, removeFollowedArtist } from '@/src/redux/followedArtistsSlice'; // Novas ações de followedArtistsSlice



export interface VideoInfoAndActionsProps {
    title: string;
    artist: string;
    videoId: string;
    liked: boolean;
    disliked: boolean;
    isFavorited: boolean; // Esta prop já vem do Redux via VideoClipesScreen

    likeCount?: number | string;
    dislikeCount?: number | string;
    favoriteCount?: number | string; // Use esta prop para exibir a contagem, se aplicável
    viewsCount?: string;
    uploadTime?: string;
    commentCount?: number | string;
    videoThumbnailUrl?: string;
    videoUrl: string; // <-- IMPORTANTE: Adicionar videoUrl aqui

    isArtistFollowed: boolean
    artistId: string
    artistProfileImageUrl?: string

    onToggleLike: (videoId: string) => void;
    onToggleDislike: (videoId: string) => void;
    onToggleFavorite: (videoId: string) => void;
}

const VideoInfoAndActions = ({
    title,
    artist,
    videoId,
    liked,
    disliked,
    isFavorited, // Recebido via props, já refletindo o estado do Redux
    likeCount = '12.1K',
    dislikeCount = '2',
    // favoriteCount não terá um valor padrão aqui, pois o que você queria era a contagem de likes
    // Se favoriteCount é para o número de vezes que ESTE vídeo foi favoritado por TODOS, isso precisaria vir do backend
    // Se é apenas para indicar se está nos favoritos, `isFavorited` já faz isso.
    // Se a contagem é dos likes, use likeCount
    viewsCount = '8 mil visualizações',
    uploadTime = 'há 3 semanas',
    commentCount = '30',
    videoThumbnailUrl,
    videoUrl, // <-- Receber videoUrl

    isArtistFollowed,
    artistId,
    artistProfileImageUrl,

    onToggleLike,
    onToggleDislike,
    onToggleFavorite,
}: VideoInfoAndActionsProps) => {
    const router = useRouter();
    const dispatch = useDispatch()



    // Lógica para alternar o estado de seguir
    const handleToggleFollow = () => {
        if (isArtistFollowed) {
            dispatch(removeFollowedArtist(artistId));
        } else {
            dispatch(addFollowedArtist({
                id: artistId,
                name: artist,
                profileImageUrl: artistProfileImageUrl, // Passa a URL da imagem de perfil
            }));
        }
    };

    const handleSharePress = () => {
        router.push({
            pathname: '/shareScreens/videos/[videoId]',
            params: {
                videoId,
                videoTitle: title,
                videoArtist: artist,
                videoThumbnailUrl: videoThumbnailUrl || '',
            },
        });
    };

    const handleCommentPress = () => {
        router.push({
            pathname: '/commentScreens/videos/[videoId]',
            params: {
                videoId,
                commentCount: String(commentCount),
                videoThumbnailUrl: videoThumbnailUrl || '',
                videoTitle: title,
                videoArtist: artist,
            },
        })
    }

    // --- NOVA LÓGICA PARA O BOTÃO PLAYLIST ---
    const handlePlaylistPress = () => {
        router.push({
            pathname: '/playlistScreens/playlistVideo/[playlistVideo]', // Rota da nova tela
            params: {
                artistId,
                artistName: artist,
                artistProfileImageUrl: artistProfileImageUrl || '', // Passar URL ou string vazia
                videoId: videoId,
            },
        });
    };

    // --- NOVA LÓGICA PARA O BOTÃO DOWNLOAD ---
    const handleDownloadPress = async () => {
        if (!videoUrl) {
            Alert.alert('Erro', 'URL do vídeo não disponível para download.');
            return;
        }

        if (Platform.OS === 'web') {
            try {
                // Tentativa de usar Fetch para obter o blob do vídeo
                // Isso é útil para lidar com CORS ou para obter o nome do arquivo dinamicamente
                const response = await fetch(videoUrl);
                if (!response.ok) {
                    throw new Error(`Erro ao baixar o vídeo: ${response.statusText}`);
                }
                const blob = await response.blob();

                // Cria um URL para o blob
                const blobUrl = URL.createObjectURL(blob);

                // Cria um link temporário no DOM e simula um clique
                const a = document.createElement('a');
                a.href = blobUrl;
                // Sugere um nome de arquivo, você pode torná-lo mais dinâmico
                a.download = `${title.replace(/[^a-z0-9]/gi, '_')}_${artist.replace(/[^a-z0-9]/gi, '_')}.mp4`;
                document.body.appendChild(a); // Necessário para Firefox
                a.click();
                document.body.removeChild(a); // Remove o link
                URL.revokeObjectURL(blobUrl); // Libera o objeto URL

                Alert.alert('Download Iniciado', 'Seu download deve começar em breve.');

            } catch (error) {
                console.error('Erro ao tentar baixar o vídeo via fetch:', error);
                // Fallback para a abordagem de link direto se fetch falhar ou por segurança
                Alert.alert('Erro no Download', 'Não foi possível baixar o vídeo diretamente. Tentando abordagem alternativa.');
                // Fallback para download direto do link (pode abrir em nova aba dependendo do navegador/servidor)
                window.open(videoUrl, '_blank');
            }
        } else {
            // Lógica para download em ambientes nativos (iOS/Android)
            // Isso exigiria uma biblioteca como `expo-file-system` e permissões
            Alert.alert('Download Indisponível', 'O download direto de vídeos para o sistema de arquivos não é totalmente suportado em ambientes nativos via Expo Go sem bibliotecas adicionais e permissões.');
            console.log('Implementar lógica de download nativo com expo-file-system para iOS/Android');
        }
    };
    // --- FIM NOVA LÓGICA ---

    return (
        <View style={styles.infoContainer}>
            <View style={styles.artistRow}>
                <Image
                    source={require('@/assets/images/Default_Profile_Icon/unknown_artist.png')}
                    style={styles.profileImage}
                    accessibilityLabel={`Avatar do artista ${artist}`}
                />
                <Text style={styles.artistName}>{artist}</Text>
                <Text style={styles.followersText} numberOfLines={1}> | 500 mil seguidores</Text>
                <TouchableOpacity
                    style={[styles.followButton, isArtistFollowed && styles.followedButton]} // Estilo condicional
                    onPress={handleToggleFollow} // <-- CHAMAR A NOVA FUNÇÃO AQUI
                    accessibilityLabel={isArtistFollowed ? "Deixar de seguir artista" : "Seguir artista"}
                >
                    <Text style={styles.followButtonText}>
                        {isArtistFollowed ? "Seguindo" : "Seguir"} {/* Texto condicional */}
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.mainVideoTitle}>{title}</Text>
            <Text style={styles.viewsTimeText} numberOfLines={1}>
                {viewsCount} {uploadTime ? ` ${uploadTime}` : ''}
            </Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.actionButtonsContent}
            >
                <View style={styles.actionButtons}>
                    {/* Like Button */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onToggleLike(videoId)}
                        accessibilityLabel={liked ? "Descurtir vídeo" : "Curtir vídeo"}
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
                        <Text style={styles.actionButtonText}>{likeCount}</Text>
                    </TouchableOpacity>

                    {/* Dislike Button */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onToggleDislike(videoId)}
                        accessibilityLabel={disliked ? "Remover descurtida" : "Descurtir vídeo"}
                    >
                        <Image
                            source={
                                disliked
                                    ? require('@/assets/images/videoItems/icons8_not_like_120px.png')
                                    : require('@/assets/images/videoItems/icons8_not_like_outline_120px.png')
                            }
                            style={[
                                styles.iconButton,
                                { tintColor: disliked ? '#900000' : '#fff' },
                            ]}
                        />
                        <Text style={styles.actionButtonText}>{dislikeCount}</Text>
                    </TouchableOpacity>

                    {/* Favorite/Heart Button */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onToggleFavorite(videoId)}
                        accessibilityLabel={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    >
                        <Ionicons
                            name={isFavorited ? "heart" : "heart-outline"}
                            size={23}
                            color={isFavorited ? "#FF3D00" : "#fff"}
                        />
                        {/* Removido countFavorites. Se precisar de uma contagem de favoritos deste vídeo,
                            ela deve ser passada via prop 'favoriteCount' do componente pai.
                            Ou, se é a contagem TOTAL de favoritos do usuário, deve ser exibida em outro lugar.
                            A interface favoriteSlice não armazena uma contagem por vídeo, apenas se existe ou não.
                        */}
                        {/* <Text style={styles.actionButtonText}>{countFavorites(videoId).toString()}</Text> */}
                        {/* Se você tem uma prop favoriteCount e quer exibi-la aqui: */}
                        {/* {favoriteCount && <Text style={styles.actionButtonText}>{favoriteCount}</Text>} */}
                        <Text style={styles.actionButtonText}>
                            {isFavorited ? 'Favorito' : 'Favoritar'}
                        </Text>
                    </TouchableOpacity>

                    {/* Comment Button */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleCommentPress}
                        accessibilityLabel="Ver e adicionar comentários"
                    >
                        <Image
                            source={require("@/assets/images/audioPlayerBar/icons8_sms_120px.png")}
                            style={styles.iconButton}
                        />
                        <Text style={styles.actionButtonText}>{commentCount}</Text>
                    </TouchableOpacity>

                    {/* Share Button */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleSharePress}
                        accessibilityLabel="Compartilhar vídeo"
                    >
                        <Ionicons name="share-social-outline" size={23} color="#fff" />
                        <Text style={styles.actionButtonText}>Partilhar</Text>
                    </TouchableOpacity>

                    {/* Download Button */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleDownloadPress} // <-- CHAMAR A NOVA FUNÇÃO AQUI
                        accessibilityLabel="Baixar vídeo"
                    >
                        <Image
                            source={require('@/assets/images/audioPlayerBar/icons8_download_120px_2.png')}
                            style={styles.iconButton}
                        />
                        <Text style={styles.actionButtonText}>Baixar</Text>
                    </TouchableOpacity>

                    {/* Playlist of the all posted videos Button */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handlePlaylistPress}
                        accessibilityLabel="Ver playlist do artista"
                    >
                        <Ionicons name="list" size={23} color="#fff" />
                        <Text style={styles.actionButtonText}>Playlist</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    infoContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#191919',
    },
    artistRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#333',
    },
    artistName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    followedButton: { // <-- NOVO ESTILO para o botão "Seguindo"
        backgroundColor: '#555', // Uma cor mais neutra para indicar que já está seguido
    },
    followersText: {
        color: '#ccc',
        fontSize: 14,
        marginLeft: 5,
        flexShrink: 1,
    },
    followButton: {
        backgroundColor: '#1E90FF',
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderRadius: 20,
        marginLeft: 'auto',
    },
    followButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    mainVideoTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    viewsTimeText: {
        color: '#aaa',
        fontSize: 13,
        marginBottom: 15,
    },
    actionButtonsContent: {
        paddingRight: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        alignItems: 'center',
        marginHorizontal: 15,
    },
    iconButton: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        tintColor: '#fff',
        marginBottom: 5,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
});

export default VideoInfoAndActions;