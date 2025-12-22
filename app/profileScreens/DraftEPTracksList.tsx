//app/profileScreens/DraftEPTracksList.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPendingEP } from '@/src/api/uploadContentApi'; // Reutilizando para pegar as tracks
import { useTranslation } from '@/src/translations/useTranslation';

export default function DraftTracksList() {
    const { epId, title } = useLocalSearchParams();
    const router = useRouter();

    const [tracks, setTracks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const { t } = useTranslation()

    useEffect(() => {
        fetchTracks();
    }, []);

    const fetchTracks = async () => {
        try {
            setLoading(true);
            const response = await getPendingEP(); // Busca o rascunho atual
            if (response.success && response.ep && response.ep.tracks) {
                setTracks(response.ep.tracks);
            }
        } catch (error) {
            console.error("Erro ao carregar faixas:", error);
        } finally {
            setLoading(false);
        }
    };

    // Componente para cada item da lista
    const renderTrackItem = ({ item, index }: { item: any; index: number }) => {
        // Acedemos ao objeto interno 'track'
        const trackData = item.track;

        return (
            <View style={styles.trackCard}>
                <View style={styles.trackNumberContainer}>
                    <Text style={styles.trackNumber}>{index + 1}</Text>
                </View>

                <View style={styles.trackInfo}>
                    <Text style={styles.trackTitle} numberOfLines={1}>
                        {trackData?.title || t('draftTracksList.noTitle')}
                    </Text>

                    {/* Mostra o gênero e, se houver feats, mostra-os também */}
                    <Text style={styles.trackSubtitle} numberOfLines={1}>
                        {trackData?.genre || t('draftTracksList.noGenre')}
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
                    title: (title as string) || t('draftTracksList.defaultTitle'),
                    headerStyle: { backgroundColor: '#191919' },
                    headerTintColor: '#fff',
                    headerShown: true, // Mostra o cabeçalho superior
                    //headerTitleStyle: { fontWeight: 'bold' },
                }}
            />
            <View style={styles.container}>

                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                ) : tracks.length > 0 ? (
                    <View style={{ flex: 1 }}>
                        <Text style={styles.sectionTitle}>{t('draftTracksList.sectionTitle', { count: tracks.length })}</Text>
                        <FlatList
                            data={tracks}
                            // Se o trackId falhar, usa o índice do array como string
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
                        <Text style={styles.emptyTitle}>{t('draftTracksList.emptyTitle')}</Text>
                        <Text style={styles.emptyText}>
                            {t('draftTracksList.emptyText')}
                        </Text>
                        <TouchableOpacity
                            style={styles.btnVoltar}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.btnVoltarText}>{t('draftTracksList.btnBack')}</Text>
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