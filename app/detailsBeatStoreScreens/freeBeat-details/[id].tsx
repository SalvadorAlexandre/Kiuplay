// app/detailsBeatStoreScreens/freeBeat-details/[id].tsx
import React, { useCallback, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    ImageBackground,
    Platform,
    SafeAreaView,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { toggleFavoriteFreeBeat } from '@/src/redux/favoriteFreeBeatsSlice';
import { setPlaylistAndPlayThunk, Track } from '@/src/redux/playerSlice';
import { BlurView } from 'expo-blur';
import { FreeBeat } from '@/src/types/contentType';
import { getBeatById } from '@/src/api';
import { useTranslation } from '@/src/translations/useTranslation';
import { useUserLocation } from '@/hooks/localization/useUserLocalization';
import { formatDate } from '@/hooks/useFormateDateTime';

export default function feeBeatDetailsScreen() {
    const { t } = useTranslation();
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { locale } = useUserLocation();

    // 1. Estados (Devem estar no topo)
    const [currentFreeBeat, setCurrentFreeBeat] = useState<FreeBeat | null>(null);
    const [loading, setLoading] = useState(true);

    // 2. Seletores Redux (Devem estar no topo)
    // Altere de:

    const favoriteFreeBeats = useAppSelector((state) => state.favoriteFreeBeats.items);
    const isConnected = useAppSelector((state) => state.network.isConnected);

    // 3. Efeito de Busca (useEffect)
    useEffect(() => {
        const fetchBeat = async () => {
            if (!id) return;

            setLoading(true);
            // Não precisamos de try/catch aqui porque a tua getBeatById já trata os erros
            const result = await getBeatById(id as string);

            if (result.success && result.data) {
                // AQUI ESTÁ A CORREÇÃO:
                // Acedemos a result.data (que é o BeatStoreFeedItem) e convertemos para FreeBeat
                setCurrentFreeBeat(result.data as unknown as FreeBeat);
            } else {
                // Opcional: Tratar erro visualmente
                console.error("Erro na API:", result.error);
            }

            setLoading(false);
        };

        fetchBeat();
    }, [id]);

    // 4. Lógica derivada
    const isCurrentSingleFavorited = currentFreeBeat

    // Handler atualizado
    const handleToggleFavorite = useCallback(() => {
        if (!currentFreeBeat) return;
        // O toggle resolve tudo: se existe remove, se não existe adiciona
        dispatch(toggleFavoriteFreeBeat(currentFreeBeat));
    }, [dispatch, currentFreeBeat]);

    const handlePlaySingle = useCallback(async () => {
        if (!currentFreeBeat?.uri) {
            Alert.alert("Erro", "URI da música não disponível para reprodução.");
            return;
        }
        dispatch(setPlaylistAndPlayThunk({
            newPlaylist: [currentFreeBeat as unknown as Track],
            startIndex: 0,
            shouldPlay: true,
        }));
    }, [dispatch, currentFreeBeat]);

    const handleOpenComments = useCallback(() => {
        if (!currentFreeBeat) return;
        router.push({
            pathname: '/commentScreens/musics/[musicId]',
            params: {
                musicId: currentFreeBeat.id,
                musicTitle: currentFreeBeat.title,
                artistName: currentFreeBeat.artist,
                albumArtUrl: currentFreeBeat.cover || '',
                commentCount: currentFreeBeat.commentCount?.toString() || '0',
                contentType: 'freebeat',
            },
        });
    }, [router, currentFreeBeat]);

    const handleShareSingle = useCallback(() => {
        if (!currentFreeBeat) return;
        router.push({
            pathname: '/shareScreens/music/[musicId]',
            params: {
                musicId: currentFreeBeat.id,
                musicTitle: currentFreeBeat.title,
                artistName: currentFreeBeat.artist,
                albumArtUrl: currentFreeBeat.cover || '',
            },
        });
    }, [router, currentFreeBeat]);

    // 6. VERIFICAÇÕES CONDICIONAIS (Fim da lista de Hooks)
    if (loading) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: '#1e1e1e', justifyContent: 'center', alignItems: 'center' }]}>
                <Stack.Screen options={{ headerShown: false }} />

                {/* O Spinner/ActivityIndicator */}
                <ActivityIndicator
                    size="large"
                    color="#fff" // Ou a cor principal da tua App (ex: #FFD700 para Gold)
                    style={{ marginBottom: 15 }}
                />

                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>
                    {t('freeBeatdetails.loadingBeats')}
                </Text>
            </View>
        );
    }


    if (!currentFreeBeat) {
        return (
            <View style={styles.errorContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <Text style={styles.errorText}>{t('freeBeatdetails.notFound')}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>{t('freeBeatdetails.backButton')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // 7. Preparação de Assets (O beat já existe aqui)
    const coverSource = (isConnected && currentFreeBeat.cover)
        ? { uri: currentFreeBeat.cover }
        : require('@/assets/images/Default_Profile_Icon/unknown_track.png');

    const artistAvatarSrc = (isConnected && currentFreeBeat.artistAvatar)
        ? { uri: currentFreeBeat.artistAvatar }
        : require('@/assets/images/Default_Profile_Icon/unknown_artist.png');

    return (
        <ImageBackground
            source={coverSource}
            blurRadius={Platform.OS === 'android' ? 10 : 0}
            style={styles.imageBackground}

        >
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
                <SafeAreaView style={styles.safeArea}>
                    <Stack.Screen options={{ headerShown: false }} />

                    <View style={styles.headerBar}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.artistInfo}>
                            <Image source={artistAvatarSrc} style={styles.profileImage} />
                            <Text style={styles.artistMainName} numberOfLines={1}>
                                {currentFreeBeat.artist}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.viewContent}>
                        <TouchableOpacity style={{ width: '100%', }} onPress={handlePlaySingle}>

                            <View style={styles.coverContainer}>
                                <Image source={coverSource} style={styles.coverImage} />
                            </View>

                            {/* LAYOUT DE DETALHES DA MÚSICA */}
                            <View style={styles.detailsContainer}>
                                <Text style={styles.title}>{currentFreeBeat.title}</Text>
                                <Text style={styles.artistName}>{currentFreeBeat.artist}</Text>
                                <Text style={styles.detailText}>{`Producer - ${currentFreeBeat.producer}`}</Text>
                                <Text style={styles.detailText}>{`Genre - ${currentFreeBeat.genre}`}</Text>
                                <Text style={styles.detailText}>
                                    {`Since - ${formatDate(currentFreeBeat.createdAt, { locale })}`}
                                </Text>
                                <Text style={styles.detailText}>{`${currentFreeBeat.bpm} BPM`}</Text>
                                <Text style={styles.detailText}>{`${currentFreeBeat.viewsCount} Plays`}</Text>
                            </View>

                        </TouchableOpacity>
                        {/* FIM DO LAYOUT */}

                        <View style={styles.containerBtnActionsRow}>
                            <TouchableOpacity style={styles.actionButtonsRow} onPress={handleToggleFavorite}>
                                <Ionicons
                                    name={isCurrentSingleFavorited ? 'heart' : 'heart-outline'}
                                    size={24}
                                    color={isCurrentSingleFavorited ? '#FF3D00' : '#fff'}
                                />
                                {currentFreeBeat.favoritesCount !== undefined && (
                                    <Text style={styles.btnActionCountText}>{currentFreeBeat.favoritesCount.toString()}</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButtonsRow} onPress={handleOpenComments}>
                                <Ionicons name="chatbox-outline" size={24} color="#fff" />
                                {currentFreeBeat.commentCount !== undefined && (
                                    <Text style={styles.btnActionCountText}>{currentFreeBeat.commentCount.toString()}</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButtonsRow} onPress={handleShareSingle}>
                                <Ionicons name="share-social-outline" size={24} color="#fff" />
                                {currentFreeBeat.shareCount !== undefined && (
                                    <Text style={styles.btnActionCountText}>{currentFreeBeat.shareCount.toString()}</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionButtonsRow}
                            //onPress={handleDownloadPress}
                            >
                                <Ionicons name="download" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                </SafeAreaView>
            </BlurView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: "cover",
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    errorContainer: {
        flex: 1,
        backgroundColor: '#191919',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    headerBar: {
        width: '100%',
        marginTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    artistInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
        paddingHorizontal: 15,
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        resizeMode: 'cover',
    },
    artistMainName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    viewContent: {
        marginTop: 40,
        alignItems: 'center', // Centraliza o conteúdo principal
    },
    coverContainer: {
        width: '100%',
        alignItems: 'center', // Centraliza a imagem da capa
        marginBottom: 20,
    },
    coverImage: {
        width: 200,
        height: 200,
        borderRadius: 12,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    // NOVO: Container para as informações textuais
    detailsContainer: {
        width: '100%', // Ocupa a largura total
        alignItems: 'center', // Alinha o texto à esquerda
        marginBottom: 20,
        paddingHorizontal: 10, // Um pouco de padding lateral para o texto
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'left', // Alinhado à esquerda
        marginBottom: 5,
    },
    artistName: {
        fontSize: 15,
        color: '#aaa',
        textAlign: 'left', // Alinhado à esquerda
        marginBottom: 3,
    },
    detailText: {
        fontSize: 15,
        color: '#bbb',
        textAlign: 'left', // Alinhado à esquerda
        marginBottom: 3,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
    containerBtnActionsRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        gap: 30,
    },
    btnActionCountText: {
        color: '#fff',
        fontSize: 15,
        marginLeft: 6,
    },
    backButton: {
        marginTop: 20,
        padding: 10,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});