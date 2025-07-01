// components/PlayerVideoComponents/VideoPlayer.tsx
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av'; // Certifique-se que esta importação está correta para sua configuração de vídeo

export interface VideoPlayerCoreProps {
    videoUrl: string;
    playerWidth: number;
    playerHeight: number;
}

const VideoPlayerCore = ({ videoUrl, playerWidth, playerHeight }: VideoPlayerCoreProps) => {
    return (
        <View style={[styles.videoPlayerContainer, ]}>
            {Platform.OS === "web" ? (
                <video
                    key={videoUrl}
                    src={videoUrl}
                    controls
                    autoPlay
                    style={{
                        width: "100%",
                        height: 250,
                        objectFit: "cover",
                    }}
                />
            ) : (
                <Video
                    key={videoUrl}
                    style={styles.video}
                    source={{ uri: videoUrl }}
                    useNativeControls // Use this for native controls, or remove if you want custom controls
                    resizeMode={ResizeMode.COVER}
                    shouldPlay
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    videoPlayerContainer: {
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
});

export default VideoPlayerCore;
