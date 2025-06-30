// components/ItemPlayerVideo/VideoItem.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, } from 'react-native';

interface VideoItemProps {
    id: string;
    title: string;
    artist: string;
    thumbnail: string;
}

const VideoItem = ({ id, title, artist, thumbnail }: VideoItemProps) => {

    return (
        <View style={styles.container}>
            {/* O container da imagem da thumbnail */}
            <View style={styles.thumbnailContainer}>
                <Image
                    source={{ uri: thumbnail }}
                    style={[styles.thumbnail]}
                />
            </View>
            {/* Container para as informações do vídeo (título e artista) */}
            <Text style={styles.title}>{title}</Text>
            <View style={styles.infoContainer}>
                <Image
                    source={require('@/assets/images/Default_Profile_Icon/unknown_artist.png')}
                    style={styles.profileImage}
                />
                <Text style={styles.artist}>{artist}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 5,
        height: 200,
        // borderRadius: 8,
        // overflow: 'hidden', // Garante que a imagem e outros conteúdos respeitem o borderRadius.
    },
    thumbnailContainer: {
        // Este container garante que a imagem tenha a proporção correta
        // e o fundo preto enquanto carrega ou se a imagem falhar.
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumbnail: {
        backgroundColor: '#333', // Cor de fundo da imagem enquanto carrega.
        borderRadius: 8, // Borda arredondada para a thumbnail.
        resizeMode: 'cover', // Garante que a imagem preencha o espaço sem deformar.
    },
    // Removidos estilos relacionados a player de vídeo (videoPlayer, playIconOverlay, bufferingOverlay, etc.)
    infoContainer: {
        padding: 15,
        flexDirection: 'row',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 1,
        marginLeft: 15,
    },
    artist: {
        fontSize: 14,
        color: '#b3b3b3',
    },
    profileImage: {
        width: 20,
        height: 20,
        borderRadius: 15, // Makes it circular
        backgroundColor: '#444', // Placeholder color
        marginRight: 5,
    },
});

export default VideoItem;

