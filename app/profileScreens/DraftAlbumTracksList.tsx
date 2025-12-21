// app/profileScreens/DraftAlbumTracksList.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Importamos a função específica para Álbuns que criámos no Hook
import { getPendingAlbum } from '@/src/api/uploadContentApi';

export default function DraftAlbumTracksList() {
    // Recebemos albumId em vez de epId
    const { albumId, title } = useLocalSearchParams();
    const router = useRouter();

    const [tracks, setTracks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTracks();
    }, []);

    const fetchTracks = async () => {
        try {
            setLoading(true);
            // Chamada para a API de Álbuns
            const response = await getPendingAlbum();
            if (response.success && response.album && response.album.tracks) {
                setTracks(response.album.tracks);
            }
        } catch (error) {
            console.error("Erro ao carregar faixas do álbum:", error);
        } finally {
            setLoading(false);
        }
    };

    // Componente para cada item da lista (Faixa do Álbum)
    const renderTrackItem = ({ item, index }: { item: any; index: number }) => {
        const trackData = item.track;

        return (
            <View style={styles.trackCard}>
                <View style={styles.trackNumberContainer}>
                    <Text style={styles.trackNumber}>{index + 1}</Text>
                </View>

                <View style={styles.trackInfo}>
                    <Text style={styles.trackTitle} numberOfLines={1}>
                        {trackData?.title || "Sem título"}
                    </Text>

                    <Text style={styles.trackSubtitle} numberOfLines={1}>
                        {trackData?.genre || 'Género não definido'}
                        {trackData?.feat && trackData.feat.length > 0
                            ? ` • feat. ${trackData.feat.join(', ')}`
                            : ''}
                    </Text>
                </View>
                <Ionicons name="musical-note" size={20} color="#fff" style={{ opacity: 0.3 }} />
            </View>
        );
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: (title as string) || 'Álbum', // Título dinâmico
                    headerStyle: { backgroundColor: '#191919' },
                    headerTintColor: '#fff',
                    headerShown: true,
                }}
            />
            <View style={styles.container}>

                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                ) : tracks.length > 0 ? (
                    <View style={{ flex: 1 }}>
                        <Text style={styles.sectionTitle}>Faixas enviadas ({tracks.length})</Text>
                        <FlatList
                            data={tracks}
                            keyExtractor={(item, index) => item?.trackId?.toString() || index.toString()}
                            renderItem={renderTrackItem}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                ) : (
                    /* ESTADO VAZIO */
                    <View style={styles.center}>
                        <Ionicons name="musical-notes" size={90} color="#333" />
                        <Text style={styles.emptyTitle}>Nenhuma faixa enviada ainda</Text>
                        <Text style={styles.emptyText}>
                            As músicas que carregares no rascunho do álbum aparecerão listadas aqui.
                        </Text>
                        <TouchableOpacity
                            style={styles.btnVoltar}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.btnVoltarText}>Voltar para Upload</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 30,
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        maxWidth: 250,
    },
    headerSubtitle: {
        color: '#888',
        fontSize: 14,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
        marginTop: 15,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    listContent: {
        paddingBottom: 40,
    },
    trackCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#222',
    },
    trackNumberContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#222',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    trackNumber: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    trackInfo: {
        flex: 1,
    },
    trackTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
    },
    trackSubtitle: {
        color: '#666',
        fontSize: 13,
        marginTop: 2,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 40,
        lineHeight: 20,
    },
    btnVoltar: {
        marginTop: 25,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        backgroundColor: '#333',
    },
    btnVoltarText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});