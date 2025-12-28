// app/detailsBeatStoreScreens/exclusiveBeat-details/[id].tsx
// app/detailsBeatStoreScreens/exclusiveBeat-details/[id].tsx
import React, { useCallback, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    SafeAreaView,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';

// Redux Actions
import { toggleFavoriteExclusiveBeat } from '@/src/redux/favoriteExclusiveBeatsSlice';
import { setPlaylistAndPlayThunk, Track } from '@/src/redux/playerSlice';

import { BlurView } from 'expo-blur';
import { ExclusiveBeat } from '@/src/types/contentType';
import { getBeatById } from '@/src/api/feedApi'; 
import { useTranslation } from '@/src/translations/useTranslation';
import { formatBeatPrice } from '@/hooks/useFormatBeatPrice';

export default function ExclusiveBeatDetailsScreen() {
    const { t } = useTranslation();
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Seletores Redux
    const favoriteExclusiveBeats = useAppSelector((state) => state.favoriteExclusiveBeats.items);
    const isConnected = useAppSelector((state) => state.network.isConnected);

    // Estados
    const [currentExclusiveBeat, setCurrentExclusiveBeat] = useState<ExclusiveBeat | null>(null);
    const [loading, setLoading] = useState(true);

    // Busca de Dados
    useEffect(() => {
        const fetchBeat = async () => {
            if (!id) return;
            setLoading(true);
            const response = await getBeatById(id as string);
            if (response.success && response.data) {
                setCurrentExclusiveBeat(response.data as unknown as ExclusiveBeat);
            }
            setLoading(false);
        };
        fetchBeat();
    }, [id]);

    // Lógica de Favoritos
    const isCurrentBeatFavorited = currentExclusiveBeat
        ? favoriteExclusiveBeats.some(beat => beat.id === currentExclusiveBeat.id)
        : false;

    const handleToggleFavorite = useCallback(() => {
        if (!currentExclusiveBeat) return;
        dispatch(toggleFavoriteExclusiveBeat(currentExclusiveBeat));
    }, [dispatch, currentExclusiveBeat]);

    // Lógica de Play
    const handlePlaySingle = useCallback(() => {
        if (!currentExclusiveBeat?.uri) return;
        dispatch(setPlaylistAndPlayThunk({
            newPlaylist: [currentExclusiveBeat as unknown as Track],
            startIndex: 0,
            shouldPlay: true,
        }));
    }, [dispatch, currentExclusiveBeat]);

    // Formatação de Preço
    const formattedPrice = currentExclusiveBeat
        ? formatBeatPrice(
            currentExclusiveBeat.price,
            currentExclusiveBeat.region || 'en-US',
            currentExclusiveBeat.currency || 'USD'
        )
        : "";

    if (loading) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: '#1e1e1e' }]}>
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>{t('exclusiveBeatDetails.loadingBeats')}</Text>
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

                    <View style={styles.headerBar}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.artistInfo}>
                            <Image source={artistAvatarSrc} style={styles.profileImage} />
                            <Text style={styles.artistMainName} numberOfLines={1}>
                                {currentExclusiveBeat.artist}
                            </Text>
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
                                <Text style={styles.detailText}>
                                    {currentExclusiveBeat.typeUse} • {currentExclusiveBeat.bpm} BPM
                                </Text>
                                <Text style={styles.detailText}>
                                    {currentExclusiveBeat.category} • {currentExclusiveBeat.releaseYear || t('exclusiveBeatDetails.unknownYear')}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.containerBtnActionsRow}>
                            <TouchableOpacity 
                                style={[
                                    styles.buttonBuy, 
                                    !currentExclusiveBeat.isAvailableForSale && { backgroundColor: '#444' }
                                ]} 
                                disabled={!currentExclusiveBeat.isAvailableForSale}
                            >
                                <Text style={styles.textBuy}>
                                    {currentExclusiveBeat.isAvailableForSale 
                                        ? t('exclusiveBeatDetails.buyButton', { price: formattedPrice })
                                        : t('exclusiveBeatDetails.soldStatus')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButtonsRow} onPress={handleToggleFavorite}>
                                <Ionicons
                                    name={isCurrentBeatFavorited ? 'heart' : 'heart-outline'}
                                    size={28}
                                    color={isCurrentBeatFavorited ? '#FF3D00' : '#fff'}
                                />
                                {currentExclusiveBeat.favoritesCount !== undefined && (
                                    <Text style={styles.btnActionCountText}>
                                        {currentExclusiveBeat.favoritesCount.toLocaleString()}
                                    </Text>
                                )}
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
    loadingText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        marginTop: 15,
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
        alignItems: 'center',
    },
    coverContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    coverImage: {
        width: 220,
        height: 220,
        borderRadius: 12,
        resizeMode: 'stretch',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    detailsContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 5,
    },
    artistName: {
        fontSize: 16,
        color: '#aaa',
        textAlign: 'center',
        marginBottom: 3,
    },
    detailText: {
        fontSize: 15,
        color: '#bbb',
        textAlign: 'center',
        marginBottom: 3,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonBuy: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginHorizontal: 10,
        backgroundColor: '#1565C0',
    },
    textBuy: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    containerBtnActionsRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 15,
    },
    btnActionCountText: {
        color: '#fff',
        fontSize: 16,
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