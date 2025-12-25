// app/contentCardBeatStoreScreens/exclusiveBeat-details/[id].tsx
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
import { addFavoriteMusic, removeFavoriteMusic } from '@/src/redux/favoriteMusicSlice';
import { setPlaylistAndPlayThunk, Track } from '@/src/redux/playerSlice';
import { BlurView } from 'expo-blur';
import { ExclusiveBeat } from '@/src/types/contentType';
import { getBeatById } from '@/src/api'; // Certifique-core que este import está correto
import { useTranslation } from '@/src/translations/useTranslation';
import { formatBeatPrice } from '@/hooks/useFormatBeatPrice';
import { processBeatPurchaseThunk } from '@/src/redux/beatPurchaseThunks';

export default function exclusiveBeatDetailsScreen() {
    const { t } = useTranslation();
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    // 1. Seletores Redux (Devem estar no topo)
    const purchasedBeats = useAppSelector((state) => state.purchases.items);
    const favoritedMusics = useAppSelector((state) => state.favoriteMusic.musics);
    const isConnected = useAppSelector((state) => state.network.isConnected);

    // 2. Estados (Devem estar no topo)
    const [currentExclusiveBeat, setCurrentExclusiveBeat] = useState<ExclusiveBeat | null>(null);
    const [loading, setLoading] = useState(true);

    // 3. Efeito de Busca (useEffect)
    useEffect(() => {
        const fetchBeat = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await getBeatById(id as string);
                setCurrentExclusiveBeat(data as ExclusiveBeat);
            } catch (error) {
                console.error("Erro ao buscar beat exclusivo:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBeat();
    }, [id]);

    // 4. Lógica derivada (Memoização e Variáveis de apoio)
    // Nota: Precisamos de verificações de segurança aqui porque o beat pode ser null inicialmente
    const isCurrentSingleFavorited = currentExclusiveBeat
        ? favoritedMusics.some(music => music.id === currentExclusiveBeat.id)
        : false;

    const formattedPrice = currentExclusiveBeat
        ? formatBeatPrice(
            currentExclusiveBeat.price,
            currentExclusiveBeat.region || 'en-US',
            currentExclusiveBeat.currency || 'USD'
        )
        : "";

    // 5. Handlers (useCallback deve estar ANTES dos returns condicionais)
    const handleToggleFavorite = useCallback(() => {
        if (!currentExclusiveBeat) return;
        if (isCurrentSingleFavorited) {
            dispatch(removeFavoriteMusic(currentExclusiveBeat.id));
        } else {
            dispatch(addFavoriteMusic(currentExclusiveBeat));
        }
    }, [dispatch, currentExclusiveBeat, isCurrentSingleFavorited]);

    const handlePlaySingle = useCallback(async () => {
        if (!currentExclusiveBeat?.uri) {
            Alert.alert(t('common.error'), t('exclusiveBeatDetails.errorPlay'));
            return;
        }
        dispatch(setPlaylistAndPlayThunk({
            newPlaylist: [currentExclusiveBeat as unknown as Track],
            startIndex: 0,
            shouldPlay: true,
        }));
    }, [dispatch, currentExclusiveBeat, t]);

    const handlePurchase = useCallback(() => {
        if (!currentExclusiveBeat) return;

        const performPurchase = () => {
            dispatch(processBeatPurchaseThunk(currentExclusiveBeat))
                .unwrap()
                .then(() => Alert.alert(t('exclusiveBeatDetails.purchaseSuccessTitle'), t('exclusiveBeatDetails.purchaseSuccessMessage')))
                .catch(() => Alert.alert("Falha na Compra", "Tente novamente."));
        };

        Alert.alert(
            t("exclusiveBeatDetails.purchaseConfirmTitle"),
            t('exclusiveBeatDetails.confirmPurchaseMessage', {
                title: currentExclusiveBeat.title,
                price: formattedPrice,
            }),
            [
                { text: t('exclusiveBeatDetails.cancel'), style: 'cancel' },
                { text: t('exclusiveBeatDetails.confirm'), onPress: performPurchase },
            ]
        );
    }, [dispatch, currentExclusiveBeat, formattedPrice, t]);

    // 6. AGORA SIM: Verificações condicionais de renderização (Fim da lista de Hooks)
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
                    {t('exclusiveBeatDetails.loadingBeats')}
                </Text>
            </View>
        );
    }

    if (!currentExclusiveBeat) {
        return (
            <View style={styles.errorContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <Text style={styles.errorText}>{t('exclusiveBeatDetails.notFound')}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>{t('exclusiveBeatDetails.back')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // 7. Preparação de Assets (O beat já existe aqui)
    const isBoughtByCurrentUser = purchasedBeats.some(beat => beat.id === currentExclusiveBeat.id);

    const coverSource = (isConnected && currentExclusiveBeat.cover)
        ? { uri: currentExclusiveBeat.cover }
        : require('@/assets/images/Default_Profile_Icon/unknown_track.png');

    const artistAvatarSrc = (isConnected && currentExclusiveBeat.artistAvatar)
        ? { uri: currentExclusiveBeat.artistAvatar }
        : require('@/assets/images/Default_Profile_Icon/unknown_artist.png');


    return (
        <ImageBackground source={coverSource} blurRadius={Platform.OS === 'android' ? 10 : 0} style={styles.imageBackground}>
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
                <SafeAreaView style={styles.safeArea}>
                    <Stack.Screen options={{ headerShown: false }} />

                    {/* Header */}
                    <View style={styles.headerBar}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.artistInfo}>
                            <Image source={artistAvatarSrc} style={styles.profileImage} />
                            <Text style={styles.artistMainName} numberOfLines={1}>{currentExclusiveBeat.artist}</Text>
                        </View>
                    </View>

                    <View style={styles.viewContent}>
                        <TouchableOpacity style={{ width: '100%' }} onPress={handlePlaySingle}>
                            <View style={styles.coverContainer}>
                                <Image source={coverSource} style={styles.coverImage} />
                            </View>

                            <View style={styles.detailsContainer}>
                                <Text style={styles.title}>{currentExclusiveBeat.title}</Text>
                                <Text style={styles.artistName}>{currentExclusiveBeat.artist}</Text>
                                <Text style={styles.detailText}>{currentExclusiveBeat.typeUse} • {currentExclusiveBeat.bpm} BPM</Text>
                                <Text style={styles.detailText}>
                                    {currentExclusiveBeat.category} • {currentExclusiveBeat.createdAt || t('exclusiveBeatDetails.unknownYear')}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* Botões de Ação */}
                        <View style={styles.containerBtnActionsRow}>
                            {isBoughtByCurrentUser ? (
                                <TouchableOpacity
                                    style={[styles.buttonBuy, styles.buttonDownload]}
                                    onPress={() => Alert.alert("Download", "Iniciando...")}
                                >
                                    <Ionicons name="download" size={20} color="#fff" style={{ marginRight: 8 }} />
                                    <Text style={styles.textBuy}>{t('exclusiveBeatDetails.downloadButton')}</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.buttonBuy} onPress={handlePurchase}>
                                    <Text style={styles.textBuy}>
                                        {t('exclusiveBeatDetails.buyButton', { price: formattedPrice })}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {!isBoughtByCurrentUser && (
                                <TouchableOpacity style={styles.actionButtonsRow} onPress={handleToggleFavorite}>
                                    <Ionicons
                                        name={isCurrentSingleFavorited ? 'heart' : 'heart-outline'}
                                        size={24}
                                        color={isCurrentSingleFavorited ? '#FF3D00' : '#fff'}
                                    />
                                    {currentExclusiveBeat.favoritesCount !== undefined && (
                                        <Text style={styles.btnActionCountText}>{currentExclusiveBeat.favoritesCount.toLocaleString()}</Text>
                                    )}
                                </TouchableOpacity>
                            )}
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
        resizeMode: 'stretch',
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
        resizeMode: 'stretch',
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
    buttonBuy: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginHorizontal: 10,
        backgroundColor: '#1565C0',
    },
    textBuy: {
        color: '#fff',
        fontSize: 19,
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
        gap: 10,
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
    buttonDownload: {
        backgroundColor: '#4CAF50', // Por exemplo, verde para download
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        //flex: 1, // Para que ele preencha o espaço quando o botão Curtir estiver oculto
    },
});