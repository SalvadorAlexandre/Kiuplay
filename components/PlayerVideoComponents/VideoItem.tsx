// components/ItemPlayerVideo/VideoItem.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

interface VideoItemProps {
    id: string;
    title: string;
    artist: string;
    thumbnail: string;
    // Adicione a duração do vídeo como uma nova prop
    duration?: string; // Opcional, caso nem todos os vídeos tenham duração definida
}

const VideoItem = ({ id, title, artist, thumbnail, duration = '0:00' }: VideoItemProps) => {
    const { width } = Dimensions.get('window');
    // A thumbnail terá uma largura fixa ou baseada em uma proporção menor da tela
    const thumbnailWidth = width * 0.35; // Exemplo: 35% da largura da tela
    const thumbnailHeight = thumbnailWidth * (9 / 16); // Proporção 16:9

    return (
        <View style={styles.container}>
            {/* O container da imagem da thumbnail (esquerda) */}
            <View style={[styles.thumbnailContainer, { width: thumbnailWidth, height: thumbnailHeight }]}>
                <Image
                    source={{ uri: thumbnail }}
                    style={[styles.thumbnail, { width: thumbnailWidth, height: thumbnailHeight }]}
                    resizeMode="cover"
                    onError={(e) => console.log('Erro ao carregar thumbnail:', e.nativeEvent.error)}
                />
                {/* Duração do vídeo sobreposta na thumbnail */}
                {duration !== '0:00' && (
                    <View style={styles.durationOverlay}>
                        <Text style={styles.durationText}>{duration}</Text>
                    </View>
                )}
            </View>

            {/* Container para as informações do vídeo (direita) */}
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={2}>{title}</Text>
                <Text style={styles.viewsTimeText} numberOfLines={1}>8 mil visualizações há 3 semanas</Text>
                <View style={styles.artistInfo}>
                    <Image
                        source={require('@/assets/images/Default_Profile_Icon/unknown_artist.png')}
                        style={styles.profileImage}
                    />
                    <Text style={styles.artist} numberOfLines={1}>{artist}</Text>
                
                </View>
                
                
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', // Alinha os itens lado a lado (thumbnail à esquerda, info à direita)
        //marginBottom: 3,
        backgroundColor: '#1a1a1a',
        //borderRadius: 8,
        overflow: 'hidden', // Garante que a borda arredondada se aplique
        alignItems: 'flex-start', // Alinha os itens ao topo do container
        padding: 10, // Adiciona um padding interno ao item
    },
    thumbnailContainer: {
        backgroundColor: '#000', // Cor de fundo da thumbnail enquanto carrega
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10, // Espaço entre a thumbnail e o texto
        borderRadius: 8, // Borda arredondada para o container da thumbnail
        overflow: 'hidden', // Importante para o borderRadius funcionar com a imagem
        position: 'relative', // Para posicionar a duração por cima
    },
    thumbnail: {
        resizeMode: 'cover',
        borderRadius: 8, // Borda arredondada para a imagem
        // As dimensões são passadas inline
    },
    durationOverlay: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fundo escuro semi-transparente
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    durationText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    infoContainer: {
        flex: 1, // Permite que este container ocupe todo o espaço restante
        justifyContent: 'flex-start', // Alinha o conteúdo ao topo
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4, // Espaço entre o título e as informações do artista
    },
    artistInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        marginTop: 13,
    },
    artist: {
        fontSize: 14,
        color: '#b3b3b3',
        marginLeft: 5,
    },
    profileImage: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#444',
    },
    viewsTimeText: { // Exemplo de estilo caso queira adicionar views/tempo separadamente
        color: '#b3b3b3',
        fontSize: 12,
    }
});

export default VideoItem;

