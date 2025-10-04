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
    ActivityIndicator,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCKED_PROFILE } from '@/src/types/contentServer';
import { Promotion } from '@/src/types/contentType';

// Importações para a biblioteca de data
import { Calendar } from 'react-native-calendars';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import "dayjs/locale/pt-br"; // localização em português

// Estenda o Day.js com os plugins necessários
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("pt-br");


// IMPORTAÇÕES DO REDUX
import { useAppDispatch } from '@/src/redux/hooks';
import { addPromotion } from '@/src/redux/promotionsSlice';

const userProfile = MOCKED_PROFILE[0];

// Tipagem para os itens de conteúdo
type ContentItem = { id: string; title: string; cover?: string | null };

// Imagem padrão
const defaultCoverSource = require("@/assets/images/Default_Profile_Icon/unknown_track.png");

export default function SetupPromotionScreen() {
    const router = useRouter();
    const { contentId, contentType } = useLocalSearchParams();
    const dispatch = useAppDispatch();

    // 1. Estados da Promoção
    const [adTitle, setAdTitle] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().add(7, 'day'));

    const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'success'>('idle');

    const isDateRangeInvalid = useMemo(() => {
        return !startDate || !endDate || startDate.isSameOrAfter(endDate, 'day');
    }, [startDate, endDate]);

    // LÓGICA ATUALIZADA: O botão fica desabilitado se o título, as datas ou o status não estiverem corretos.
    const isButtonDisabled = useMemo(() => {
        return !adTitle.trim() || isDateRangeInvalid || publishStatus === 'publishing';
    }, [adTitle, isDateRangeInvalid, publishStatus]);

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

    const getCoverSource = () => {
        if (selectedContent?.cover && selectedContent.cover.trim() !== '') {
            return { uri: selectedContent.cover };
        }
        return defaultCoverSource;
    };

    const publishPromotion = async () => {
        if (!adTitle.trim()) return;
        if (!startDate || !endDate || startDate.isSameOrAfter(endDate)) return;

        setPublishStatus("publishing");

        try {
            // Determina status dinamicamente
            let status: Promotion["status"] = "pending";
            const now = dayjs();

            if (startDate.isSameOrBefore(now) && endDate.isSameOrAfter(now)) {
                status = "active";
            } else if (endDate.isBefore(now)) {
                status = "expired";
            }

            const newPromotion: Promotion = {
                id: `promo_${Date.now()}`,
                contentId: contentId as string,
                contentType: (contentType as Promotion["contentType"]) || "single",
                promoterId: userProfile.id,
                title: adTitle,
                message: customMessage.trim() || undefined,
                thumbnail: selectedContent?.cover || undefined,
                artistAvatar: userProfile.avatar || undefined,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                targetAudience: "all",
                notify: true,
                createdAt: new Date().toISOString(),
                category: "promotion",
                status, // calculado dinamicamente
            };

            dispatch(addPromotion(newPromotion));

            setPublishStatus("success");

            setAdTitle('')
            setCustomMessage('')
            setStartDate(dayjs())
            setEndDate(dayjs().add(7, 'day'))


            // Navega direto sem Alert
            router.push("/profileScreens/usePostPromoteScreen");

            // volta para idle depois de 1s
            setTimeout(() => setPublishStatus("idle"), 1000);
        } catch (error) {
            console.error("Erro ao publicar promoção:", error);
            setPublishStatus("idle");
        }
    };

    if (!selectedContent) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ title: 'Erro' }} />
                <Text style={styles.errorText}>Conteúdo não encontrado para promoção.</Text>
            </View>
        );
    }

    const markedDates = useMemo(() => {
        const marked: Record<string, any> = {};
        if (startDate) {
            marked[startDate.format('YYYY-MM-DD')] = {
                selected: true,
                startingDay: true,
                color: '#1E90FF',
                textColor: '#fff',
            };
        }
        if (startDate && endDate && !startDate.isSame(endDate)) {
            const endString = endDate.format('YYYY-MM-DD');
            marked[endString] = {
                selected: true,
                endingDay: true,
                color: '#FF6347',
                textColor: '#fff',
            };
            let currentDate = startDate.add(1, 'day');
            while (currentDate.isBefore(endDate)) {
                marked[currentDate.format('YYYY-MM-DD')] = {
                    selected: true,
                    color: 'rgba(30, 144, 255, 0.2)',
                    textColor: '#fff',
                };
                currentDate = currentDate.add(1, 'day');
            }
        }
        return marked;
    }, [startDate, endDate]);

    const onDayPress = (day: { dateString: string }) => {
        const selectedDay = dayjs(day.dateString);

        if (startDate && endDate) {
            setStartDate(selectedDay);
            setEndDate(null);
        } else if (startDate) {
            if (selectedDay.isBefore(startDate)) {
                setEndDate(startDate);
                setStartDate(selectedDay);
            } else {
                setEndDate(selectedDay);
            }
        } else {
            setStartDate(selectedDay);
            setEndDate(null);
        }
    };


    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Configurar Promoção',
                    headerStyle: { backgroundColor: '#191919' },
                    headerTintColor: '#fff',
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
                    numberOfLines={3}
                    value={customMessage}
                    onChangeText={setCustomMessage}
                />

                {/* 2. Configuração da Campanha */}
                <Text style={styles.sectionTitle}>2. Configurar início e término da Campanha</Text>
                <View style={styles.startEndContainerData}>
                    <View style={styles.dateView}>
                        <Ionicons name="calendar-outline" size={28} color="#fff" />
                        <Text style={{ color: "#1E90FF", marginTop: 5, fontSize: 16 }}>
                            Início: {startDate ? startDate.format("DD/MM/YYYY") : "—"}
                        </Text>
                    </View>

                    <View style={styles.dateView}>
                        <Ionicons name="calendar-outline" size={28} color="#fff" />
                        <Text style={{ color: "#FF6347", marginTop: 5, fontSize: 16, marginBottom: 10 }}>
                            Fim: {endDate ? endDate.format("DD/MM/YYYY") : "—"}
                        </Text>
                    </View>
                </View>

                <Calendar
                    initialDate={startDate?.format('YYYY-MM-DD')}
                    markedDates={markedDates}
                    markingType={'period'}
                    onDayPress={onDayPress}
                    theme={{
                        backgroundColor: '#191919',
                        calendarBackground: '#191919',
                        monthTextColor: '#fff',
                        dayTextColor: '#fff',
                        textDisabledColor: '#555',
                        arrowColor: '#fff',
                        todayTextColor: '#1E90FF',
                    }}
                    style={{ borderRadius: 12, backgroundColor: "#2b2b2b" }}
                />
                <View style={styles.audienceContainer}>
                    <Image
                        source={require('@/assets/images/Default_Profile_Icon/unknown_artist.png')}
                        style={styles.audienceImage}
                    />
                    <View style={styles.audienceTextContainer}>
                        <Text style={styles.audienceTitle}>Será visto por Seguidores...</Text>
                        <Text style={styles.audienceDescription}>
                            Esta promoção será vista por todos seus Seguidores.
                        </Text>
                    </View>
                </View>

                {/* 3. Resumo da Promoção (Preview) */}
                <Text style={styles.sectionTitle}>3. Resumo da Promoção</Text>
                <View style={styles.previewContainer}>
                    <View style={styles.previewHeader}>
                        <Image source={getCoverSource()} style={styles.previewAvatar} />
                        <View>
                            {/* adTitle agora reflete o campo Promotion.title */}
                            <Text style={styles.previewTitle} numberOfLines={1}>
                                {adTitle || 'Prévia do Título da Promoção'}
                            </Text>
                            <Text style={styles.previewArtist}>{userProfile.name}</Text>
                        </View>
                    </View>

                    <View style={styles.previewBody}>
                        <Image source={getCoverSource()} style={styles.previewImage} />

                        {/* customMessage agora reflete o campo Promotion.message */}
                        {customMessage.trim() ? (
                            <Text style={styles.previewMessage}>{customMessage}</Text>
                        ) : (
                            <Text style={styles.previewMessagePlaceholder}>
                                Sua mensagem personalizada aparecerá aqui.
                            </Text>
                        )}

                        <Text style={[styles.previewDates, isDateRangeInvalid && styles.errorDates]}>
                            {isDateRangeInvalid ? (
                                "A data de término não pode ser igual ou anterior à de início."
                            ) : (
                                `Promoção ativa de ${startDate?.format('DD/MM/YYYY')} a ${endDate?.format('DD/MM/YYYY')}`
                            )}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* 4. Botão de Ação */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[styles.publishButton, isButtonDisabled && styles.disabledButton]}
                    onPress={publishPromotion}
                    disabled={isButtonDisabled || publishStatus === 'success'}
                >
                    {publishStatus === 'idle' && (
                        <Text style={styles.publishButtonText}>Publicar Promoção</Text>
                    )}
                    {publishStatus === 'publishing' && (
                        <ActivityIndicator color="#fff" size="small" />
                    )}
                    {publishStatus === 'success' && (
                        <Ionicons name="checkmark-circle" size={28} color="#fff" />
                    )}
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
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20,
        marginBottom: 5,
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
        justifyContent: 'center',
        minHeight: 50,
    },
    publishButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#555',
    },
    errorText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
    },
    errorDates: {
        color: 'red',
        fontWeight: 'bold',
    },

    startEndContainerData: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    dateView: {
        alignItems: 'center',
        backgroundColor: '#2b2b2b',
        padding: 15,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
    },

    audienceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: '#2b2b2b',
        borderRadius: 12,
        marginVertical: 15,
    },
    audienceImage: {
        width: 50,
        height: 50,
        marginRight: 10,
        resizeMode: 'contain',
    },
    audienceTextContainer: {
        flex: 1,
    },
    audienceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    audienceDescription: {
        fontSize: 14,
        color: '#aaa',
    },
});