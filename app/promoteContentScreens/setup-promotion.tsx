// app/promoteContentScreens/setup-promotion.tsx
import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    Platform,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCKED_PROFILE } from '@/src/types/contentServer';
import DateTimePicker from '@react-native-community/datetimepicker'; // Para selecionar datas

const userProfile = MOCKED_PROFILE[0];

// Tipagem para os itens de conteúdo
type ContentItem = { id: string; title: string; cover?: string | null };
type TabName = 'Singles' | 'Extended Play' | 'Álbuns' | 'Exclusive Beats' | 'Free Beats';

// Imagem padrão
const defaultCoverSource = require("@/assets/images/Default_Profile_Icon/unknown_track.png");


export default function SetupPromotionScreen() {
    const router = useRouter();
    const { contentId, contentType } = useLocalSearchParams();

    // 1. Estados da Promoção
    const [adTitle, setAdTitle] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 7)));
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    // Busca o item de conteúdo selecionado
    const selectedContent = useMemo(() => {
        let contentList: ContentItem[] = [];
        switch (contentType) {
            case 'Singles':
                contentList = userProfile.singles || [];
                break;
            case 'Extended Play':
                contentList = userProfile.eps || [];
                break;
            case 'Álbuns':
                contentList = userProfile.albums || [];
                break;
            case 'Exclusive Beats':
                contentList = userProfile.exclusiveBeats || [];
                break;
            case 'Free Beats':
                contentList = userProfile.freeBeats || [];
                break;
            default:
                break;
        }
        return contentList.find(item => item.id === contentId) || null;
    }, [contentId, contentType]);

    // Lógica para obter a capa do conteúdo ou a imagem padrão
    const getCoverSource = () => {
        // A lógica de verificação de conexão seria necessária, mas para este mock, assumimos que a imagem pode ser carregada
        if (selectedContent?.cover && selectedContent.cover.trim() !== '') {
            return { uri: selectedContent.cover };
        }
        return defaultCoverSource;
    };

    const publishPromotion = () => {
        if (!adTitle.trim()) {
            Alert.alert('Erro', 'Por favor, insira um título para o anúncio.');
            return;
        }

        if (startDate >= endDate) {
            Alert.alert('Erro', 'A data de término deve ser posterior à data de início.');
            return;
        }

        // Lógica para "publicar" a promoção (mock)
        const promotionData = {
            id: `promo_${Date.now()}`,
            contentId: selectedContent?.id,
            contentType,
            adTitle,
            customMessage,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            status: 'publicada',
        };
        console.log('Promoção Publicada:', promotionData);

        // Alerta de sucesso e navegação de volta
        Alert.alert('Sucesso!', 'Sua promoção foi publicada com sucesso.', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    };

    if (!selectedContent) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ title: 'Erro' }} />
                <Text style={styles.errorText}>Conteúdo não encontrado para promoção.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Configurar Promoção',
                    headerStyle: { backgroundColor: '#191919' },
                    headerTintColor: '#fff',
                    //headerBackTitleVisible: false,
                }}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                horizontal={false}
                contentContainerStyle={styles.scrollContent}
            >

                {/* 1. Informações da Promoção */}
                <Text style={styles.sectionTitle}>1. Informações da Promoção</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Título do anúncio (ex: Novo Single: 'Ritmo Urbano')"
                    placeholderTextColor="#888"
                    value={adTitle}
                    onChangeText={setAdTitle}
                />
                <TextInput
                    style={[styles.input, styles.messageInput]}
                    placeholder="Mensagem personalizada (opcional)"
                    placeholderTextColor="#888"
                    multiline
                    numberOfLines={4}
                    value={customMessage}
                    onChangeText={setCustomMessage}
                />

                {/* 2. Configuração da Campanha */}
                <Text style={styles.sectionTitle}>2. Configuração da Campanha</Text>
                <View style={styles.datePickerContainer}>
                    <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateInput}>
                        <Ionicons name="calendar-outline" size={20} color="#fff" />
                        <Text style={styles.dateText}>Início: {startDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateInput}>
                        <Ionicons name="calendar-outline" size={20} color="#fff" />
                        <Text style={styles.dateText}>Término: {endDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                </View>
                {showStartDatePicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowStartDatePicker(false);
                            if (selectedDate) setStartDate(selectedDate);
                        }}
                    />
                )}
                {showEndDatePicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowEndDatePicker(false);
                            if (selectedDate) setEndDate(selectedDate);
                        }}
                    />
                )}
                <Text style={styles.audienceText}>Público Alvo: Todos</Text>

                {/* 3. Resumo da Promoção (Preview) */}
                <Text style={styles.sectionTitle}>3. Resumo da Promoção</Text>
                <View style={styles.previewContainer}>
                    <View style={styles.previewHeader}>
                        <Image source={getCoverSource()} style={styles.previewAvatar} />
                        <View>
                            <Text style={styles.previewTitle} numberOfLines={1}>{adTitle || 'Prévia do Título do Anúncio'}</Text>
                            <Text style={styles.previewArtist}>{userProfile.name}</Text>
                        </View>
                    </View>
                    <View style={styles.previewBody}>
                        <Image source={getCoverSource()} style={styles.previewImage} />
                        {customMessage.trim() ? (
                            <Text style={styles.previewMessage}>{customMessage}</Text>
                        ) : (
                            <Text style={styles.previewMessagePlaceholder}>Sua mensagem personalizada aparecerá aqui.</Text>
                        )}
                        <Text style={styles.previewDates}>
                            Promoção ativa de {startDate.toLocaleDateString()} a {endDate.toLocaleDateString()}
                        </Text>
                    </View>
                </View>

            </ScrollView>

            {/* 4. Botão de Ação */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.publishButton} onPress={publishPromotion}>
                    <Text style={styles.publishButtonText}>Publicar Promoção</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919',
    },
    scrollContent: {
        padding: 15,
        paddingBottom: 100, // Espaço para o bottom bar
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20,
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#2b2b2b',
        color: '#fff',
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 10,
    },
    messageInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    thumbnailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    thumbnailLabel: {
        color: '#fff',
        fontSize: 16,
        marginRight: 10,
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2b2b2b',
        padding: 15,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
    },
    dateText: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
    },
    audienceText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    previewContainer: {
        backgroundColor: '#2b2b2b',
        borderRadius: 12,
        padding: 15,
    },
    previewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    previewAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    previewTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    previewArtist: {
        color: '#aaa',
        fontSize: 14,
    },
    previewBody: {
        alignItems: 'center',
    },
    previewImage: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 8,
        marginBottom: 10,
    },
    previewMessage: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    previewMessagePlaceholder: {
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 10,
    },
    previewDates: {
        color: '#aaa',
        fontSize: 14,
        textAlign: 'center',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#191919',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#2b2b2b',
    },
    publishButton: {
        backgroundColor: '#1E90FF',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    publishButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
    },
});