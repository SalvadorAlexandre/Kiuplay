// components/PlayerVideoComponents/VideoPlayer.tsx
import React, { useState } from 'react'; // Import useState
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
} from 'react-native';
import { Video, ResizeMode } from 'react-native-video';
import { Ionicons } from '@expo/vector-icons';
import type { VideoData } from '@/app/(tabs)/VideoClipes';


const VideoPlayer = ({ videoUrl, title, artist, thumbnail, id }: VideoData) => {
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    const [isFavorited, setIsFavorited] = useState(false) //Estado para o btn favorito
    const toggleFavorite = () => {
        setIsFavorited(!isFavorited)
    }

    //const { width } = Dimensions.get('window')
    //const height = width * (9 / 16)
    return (
        <View style={styles.container}>
            <View style={[styles.videoPlayerContainer]}>
                {Platform.OS === "web" ? (
                    <video
                        key={videoUrl} // Reinicia quando mudar
                        src={videoUrl} // Aqui é src direto
                        controls
                        autoPlay
                        style={{
                            width: "100%",
                            height: 200,
                           // aspectRatio: 16 / 9, // Mantém proporção
                            //borderRadius: 8,
                        }}
                    />
                ) : (
                    <Video
                        key={videoUrl}
                        style={[styles.video]}
                        source={{ uri: videoUrl }}
                        //NativeControls
                        resizeMode={ResizeMode.COVER}
                        //shouldPlay
                    />
                )}
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.artistRow}>
                    <Image
                        source={require('@/assets/images/Default_Profile_Icon/unknown_artist.png')}
                        style={styles.profileImage}
                    />
                    <Text style={styles.artistName}>{artist}</Text>
                    <Text style={{ color: '#b3b3b3', fontSize: 14, flex: 1, }} numberOfLines={1}> | 500 mil seguidores</Text>
                    <TouchableOpacity style={styles.followButton} onPress={() => { /* Follow logic */ }}>
                        <Text style={styles.followButtonText}>Seguir</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.mainVideoTitle}>{title}</Text>
                <Text style={{ color: '#b3b3b3', fontSize: 14, flex: 1, marginBottom: 5, }} numberOfLines={1}>8 mil visualizações há 3 semanas</Text>
                <View style={{ flexDirection: 'row', }}>
                    {/* Action Buttons (Likes, Dislikes, Download, Share, Playlist) */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ width: '100%' }}
                    >
                        <View style={{ flexDirection: 'row', }}>
                            {/* Like Button */}
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => {
                                    setLiked(!liked);
                                    setDisliked(false);
                                }}
                            >
                                <Image
                                    source={
                                        liked
                                            ? require('@/assets/images/videoItems/icons8_facebook_like_120px_1 - Copia.png')
                                            : require('@/assets/images/videoItems/icons8_facebook_like_120px - Copia.png')
                                    }
                                    style={[
                                        styles.iconButton,
                                        { tintColor: liked ? '#1E90FF' : '#fff' }, // Highlight when liked
                                    ]}
                                />
                                <Text style={styles.actionButtonText}>12.1K</Text>
                            </TouchableOpacity>

                            {/* Dislike Button */}
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => {
                                    setDisliked(!disliked);
                                    setLiked(false);
                                }}
                            >
                                <Image
                                    source={
                                        disliked
                                            ? require('@/assets/images/videoItems/icons8_facebook_like_120px_1.png') // Assuming this is your "disliked" icon
                                            : require('@/assets/images/videoItems/icons8_facebook_like_120px.png') // Assuming this is your "not disliked" icon
                                    }
                                    style={[
                                        styles.iconButton,
                                        { tintColor: disliked ? '#fff' : '#fff' }, // Rotate for dislike, tinting can be adjusted
                                    ]}
                                />
                                <Text style={styles.actionButtonText}>2</Text>
                            </TouchableOpacity>

                            {/* Curtir Button */}
                            <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
                                <Ionicons
                                    name={
                                        isFavorited ? "heart" : "heart-outline"}
                                    size={23} color={isFavorited ? "#FF3D00" : "#fff"
                                    }
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
                            <TouchableOpacity style={styles.actionButton} onPress={() => { /* Comment logic */ }}>
                                <Image
                                    source={require('@/assets/images/audioPlayerBar/icons8_sms_120px.png')}
                                    style={styles.iconButton}
                                />
                                <Text style={styles.actionButtonText}>Coment.</Text> {/* Adicione texto ou remova se for só ícone */}
                            </TouchableOpacity>

                            {/* Share Button */}
                            <TouchableOpacity style={styles.actionButton} onPress={() => { /* Share logic */ }}>
                                <Ionicons name="share-social-outline" size={23} color="#fff" />
                                <Text style={styles.actionButtonText}>Compart.</Text> {/* Adicione texto ou remova se for só ícone */}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} onPress={() => { /* Add to playlist logic */ }}>
                                <Ionicons name="list" size={23} color="#fff" />
                                <Text style={styles.actionButtonText}>Playlist</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </View>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#191919',
    },
    videoPlayerContainer: {
        width: '100%',
       // backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        //height: 200,
    },
    video: {
        width: '100%',
        height: 150,
        //aspectRatio: 16 / 9,
    },
    infoContainer: {
        padding: 10,
        backgroundColor: '#191919',
    },
    mainVideoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
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
        borderRadius: 15, // Makes it circular
        backgroundColor: '#444', // Placeholder color
    },
    artistName: {
        color: '#fff',
        fontSize: 14,
    },
    actionButton: {
        paddingVertical: 7,
        paddingHorizontal: 15,
        borderRadius: 19,
        backgroundColor: '#333',
        marginHorizontal: 8,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5,
        marginLeft: -1,
        //alignSelf: 'flex-start',
        
    },
    iconButton: {
        width: 23,
        height: 23,
        resizeMode: 'contain',
    },
    actionButtonText: {
        color: '#b3b3b3',
        fontSize: 12,
    },
    followButton: {
        backgroundColor: '#1E90FF',
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignItems: 'center',
    },
    followButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
    },
});

export default VideoPlayer;
