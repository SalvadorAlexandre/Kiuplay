//app/TabProfileBeatScreens/ExclusiveBeatForSale/[id].tsx
import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, StyleSheet, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';


import { formatBeatPrice } from '@/hooks/useFormatBeatPrice'; // função de formatação
import { MOCKED_PROFILE, mockUserProfile } from '@/src/types/contentServer';

export default function UserExclusiveBeatDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { t } = useTranslation();

    // 🟩 Buscar o beat com base no ID
    const userProfile = MOCKED_PROFILE.find(profile => profile.id === mockUserProfile.id);

    const currentExclusiveBeat = useMemo(() => {
        return (userProfile?.exclusiveBeats ?? []).find(b => b.id === id);
    }, [id, userProfile]);

    // 🛑 Caso o beat não seja encontrado
    if (!currentExclusiveBeat) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{t('exclusiveBeatDetails.beatNotFound')}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>{t('exclusiveBeatDetails.goBack')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // 🪙 Formatar o preço com base na região e moeda do beat
    const formattedPrice = formatBeatPrice(
        currentExclusiveBeat.price,
        currentExclusiveBeat.region,
        currentExclusiveBeat.currency
    );

    // 🎨 Fontes das imagens
    const coverSource = { uri: currentExclusiveBeat.cover };
    const artistAvatarSrc = { uri: mockUserProfile.avatar || 'https://placehold.co/100x100' };

    // ⚙️ Ações principais
    const handleEditBeat = () => {
        Alert.alert('Editar Beat', 'Função de edição em desenvolvimento.');
    };

    const handleToggleAvailability = () => {
        const newStatus = !currentExclusiveBeat.isAvailableForSale;
        Alert.alert(
            newStatus ? 'Ativar Venda' : 'Desativar Venda',
            `O beat será marcado como ${newStatus ? 'disponível' : 'indisponível'} para venda.`
        );
    };

    const handleRemoveBeat = () => {
        Alert.alert(
            'Remover Beat',
            'Tem certeza que deseja remover este beat?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Remover', onPress: () => Alert.alert('Beat removido!') },
            ]
        );
    };

    return (
        <ImageBackground
            source={coverSource}
            blurRadius={Platform.OS === 'android' ? 10 : 0}
            style={styles.imageBackground}
           
        >
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
                <SafeAreaView style={styles.safeArea}>
                    <Stack.Screen options={{ headerShown: false }} />

                    {/* 🔙 Top bar */}
                    <View style={styles.headerBar}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.artistInfo}>
                            <Image source={artistAvatarSrc} style={styles.profileImage} />
                            <Text style={styles.artistMainName} numberOfLines={1}>
                                {mockUserProfile.name}
                            </Text>
                        </View>
                    </View>

                    {/* 🎵 Conteúdo principal */}
                    <View style={styles.viewContent}>
                        <View style={styles.coverContainer}>
                            <Image source={coverSource} style={styles.coverImage} />
                        </View>

                        {/* 📜 Informações detalhadas */}
                        <View style={styles.detailsContainer}>
                            <Text style={styles.title}>{currentExclusiveBeat.title}</Text>
                            <Text style={styles.artistName}>{currentExclusiveBeat.artist}</Text>

                            {currentExclusiveBeat.producer && (
                                <Text style={styles.detailText}>
                                    Produzido por {currentExclusiveBeat.producer}
                                </Text>
                            )}

                            <Text style={styles.detailText}>
                                {currentExclusiveBeat.typeUse} • {currentExclusiveBeat.bpm} BPM
                            </Text>

                            <Text style={styles.detailText}>
                                {currentExclusiveBeat.category.charAt(0).toUpperCase() + currentExclusiveBeat.category.slice(1)} • {currentExclusiveBeat.releaseYear || 'Ano desconhecido'}
                            </Text>

                            <Text style={styles.detailText}>
                                {currentExclusiveBeat.genre || 'Género indefinido'} • {currentExclusiveBeat.region}
                            </Text>

                            <Text style={styles.detailText}>
                                Preço: {formattedPrice}
                            </Text>

                            <Text style={[styles.detailText, { color: currentExclusiveBeat.isAvailableForSale ? '#4CAF50' : '#FF3D00' }]}>
                                {currentExclusiveBeat.isAvailableForSale
                                    ? 'Disponível para venda'
                                    : 'Indisponível para venda'}
                            </Text>

                            <Text style={styles.detailText}>
                                {(currentExclusiveBeat.viewsCount || 0).toLocaleString()} Plays • {(currentExclusiveBeat.favoritesCount || 0).toLocaleString()} Likes
                            </Text>
                        </View>

                        {/* 🔘 Ações do usuário */}
                        <View style={styles.containerBtnActionsRow}>
                            <TouchableOpacity
                                style={[styles.buttonBuy, { backgroundColor: '#1976D2' }]}
                                onPress={handleEditBeat}
                            >
                                <Ionicons name="create-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
                                <Text style={styles.textBuy}>Editar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.buttonBuy, { backgroundColor: '#FFA000' }]}
                                onPress={handleToggleAvailability}
                            >
                                <Ionicons
                                    name={currentExclusiveBeat.isAvailableForSale ? 'pause-outline' : 'play-outline'}
                                    size={20}
                                    color="#fff"
                                    style={{ marginRight: 6 }}
                                />
                                <Text style={styles.textBuy}>
                                    {currentExclusiveBeat.isAvailableForSale ? 'Desativar venda' : 'Ativar venda'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.buttonBuy, { backgroundColor: '#D32F2F' }]}
                                onPress={handleRemoveBeat}
                            >
                                <Ionicons name="trash-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
                                <Text style={styles.textBuy}>Remover</Text>
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
        resizeMode: "cover"
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
        alignItems: 'center',
    },
    coverContainer: {
        width: '100%',
        alignItems: 'center',
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
    detailsContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'left',
        marginBottom: 5,
    },
    artistName: {
        fontSize: 15,
        color: '#aaa',
        textAlign: 'left',
        marginBottom: 3,
    },
    detailText: {
        fontSize: 15,
        color: '#bbb',
        textAlign: 'left',
        marginBottom: 3,
    },
    containerBtnActionsRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        gap: 10,
    },
    buttonBuy: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    textBuy: {
        color: '#fff',
        fontSize: 16,
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