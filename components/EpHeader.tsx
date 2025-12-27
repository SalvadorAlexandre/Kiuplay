import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ExtendedPlayEP } from '@/src/types/contentType';
import { useAppSelector } from '@/src/redux/hooks';


interface EpHeaderProps {
    currentEp: ExtendedPlayEP;
    isFavorited: boolean;
    onToggleFavorite: () => void;
    onPlayEp: () => void;
    router: any;
    t: any;
}

export const EpHeader = ({ currentEp, isFavorited, onToggleFavorite, onPlayEp, router, t }: EpHeaderProps) => {
    const isConnected = useAppSelector((state) => state.network.isConnected);

    const getDynamicCoverSource = () => {
        if (!isConnected || !currentEp?.cover?.trim()) {
            return require('@/assets/images/Default_Profile_Icon/unknown_track.png');
        }
        return { uri: currentEp.cover };
    };

    const getDynamicUserAvatar = () => {
        if (!isConnected || !currentEp?.artistAvatar?.trim()) {
            return require('@/assets/images/Default_Profile_Icon/unknown_artist.png');
        }
        return { uri: currentEp.artistAvatar };
    };

    const coverSource = getDynamicCoverSource();
    const artistAvatar = getDynamicUserAvatar();

    return (
        <View style={styles.headerContentContainer}>
            <ImageBackground source={coverSource} blurRadius={Platform.OS === 'android' ? 10 : 0} style={styles.imageBackground}>
                <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>

                    <View style={styles.headerBar}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.artistInfo}>
                            <Image source={artistAvatar} style={styles.profileImage} />
                            <Text style={styles.artistMainName} numberOfLines={1}>{currentEp.artist}</Text>
                        </View>
                    </View>

                    <View style={styles.coverAndDetailsSection}>
                        <Image source={coverSource} style={styles.coverImage} />
                        <Text style={styles.title}>{currentEp.title}</Text>
                        <Text style={styles.artistName}>{currentEp.artist}</Text>
                        <Text style={styles.detailText}>
                            {`${currentEp.category.toUpperCase()} • ${currentEp.releaseYear} • ${currentEp.tracks.length} Faixas`}
                        </Text>
                    </View>

                    <LinearGradient colors={['transparent', '#191919']} style={styles.fadeOverlay} />

                    <View style={styles.playButtonContainer}>
                        <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteIconSpacing}>
                            <Ionicons
                                name={isFavorited ? 'heart' : 'heart-outline'}
                                size={34}
                                color={isFavorited ? '#FF3D00' : '#bbb'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onPlayEp}>
                            <Ionicons name="play-circle" size={56} color="#fff" />
                        </TouchableOpacity>
                    </View>

                </BlurView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContentContainer: {
        width: '100%',
    },
    imageBackground: {
        width: '100%',
        height: 450,
        justifyContent: 'flex-start',
        resizeMode: "cover"
    },
    headerBar: {
        marginTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    artistInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
        marginLeft: 19,
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    artistMainName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    coverAndDetailsSection: {
        alignItems: 'center',
        marginTop: 20,
    },
    coverImage: {
        width: 140,
        height: 140,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 3,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    artistName: {
        fontSize: 16,
        color: '#aaa',
        textAlign: 'center',
        marginBottom: 4,
    },
    detailText: {
        fontSize: 14,
        color: '#bbb',
        textAlign: 'center',
    },

    fadeOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 160,
    },

    playButtonContainer: {
        flexDirection: 'row',       // Alinha os itens em linha
        alignItems: 'center',       // Centraliza verticalmente um em relação ao outro
        justifyContent: 'flex-end', // Empurra todo o grupo para a direita da tela
        marginTop: 'auto',          // Joga para o fundo do cabeçalho
        marginBottom: 20,
        paddingHorizontal: 20,
        zIndex: 10,
    },
    favoriteIconSpacing: {
        marginRight: 15,            // Cria o espaço entre o Coração e o Play
    },
});