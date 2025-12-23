// app/promoteContentScreens/setup-promotion.tsx
import React, { useState, useMemo, useEffect } from 'react';
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
//import { MOCKED_PROFILE } from '@/src/types/contentServer';
import { Promotion } from '@/src/types/contentType';
import { useUserLocation } from '@/hooks/localization/useUserLocalization'; // ✅ IMPORTA O HOOK
import { useTranslation } from '@/src/translations/useTranslation'

// Importações para a biblioteca de data
import { Calendar } from 'react-native-calendars';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import "dayjs/locale/pt-br"; // localização em português


// Adicione/Verifique estas importações:
import { useAppSelector } from '@/src/redux/hooks';
import { selectCurrentUserId, selectUserById } from '@/src/redux/userSessionAndCurrencySlice';

// Estenda o Day.js com os plugins necessários
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
//dayjs.locale("pt-br");


// IMPORTAÇÕES DO REDUX
import { useAppDispatch } from '@/src/redux/hooks';
import { addPromotion } from '@/src/redux/promotionsSlice';

//const userProfile = MOCKED_PROFILE[0];

// Tipagem para os itens de conteúdo
type ContentItem = { id: string; title: string; cover?: string | null };

export default function SetupPromotionScreen() {

    const { t } = useTranslation()

    // Usa o hook de localização aqui
    //const { locale } = useUserLocation();
    //const local = dayjs.locale(locale?.toLowerCase?.() || "pt-br");
    const router = useRouter();
    const { contentId, contentType } = useLocalSearchParams();
    const dispatch = useAppDispatch();
    const isConnected = useAppSelector((state) => state.network.isConnected);
    const currentUserId = useAppSelector(selectCurrentUserId);
    const userProfile = useAppSelector(selectUserById(currentUserId!));

    // 1. Estados da Promoção
    const [adTitle, setAdTitle] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().add(7, 'day'));

    const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'success'>('idle');

    const isDateRangeInvalid = useMemo(() => {
        return !startDate || !endDate || startDate.isSameOrAfter(endDate, 'day');
    }, [startDate, endDate]);

    // LÓGICA ATUALIZADA: O botão fica desabilitado se o título, a mensagem, as datas ou o status não estiverem corretos.
    const isButtonDisabled = useMemo(() => {
        // 1. Verifica se o título não está vazio
        const isTitleEmpty = !adTitle.trim();

        // 2. Verifica se a mensagem não está vazia (Nova condição que você pediu)
        const isMessageEmpty = !customMessage.trim();

        // 3. Verifica se as datas são inválidas ou se falta alguma
        // (A variável isDateRangeInvalid já deve conter !startDate || !endDate || startDate >= endDate)

        // O botão fica DESABILITADO se qualquer uma dessas for verdadeira:
        return isTitleEmpty || isMessageEmpty || isDateRangeInvalid || publishStatus === 'publishing';

    }, [adTitle, customMessage, isDateRangeInvalid, publishStatus]);

    const selectedContent = useMemo(() => {
        let contentList: ContentItem[] = [];

        // As chaves agora batem com o que vem do params (Redux)
        switch (contentType) {
            case 'singles':
                contentList = userProfile.singles || [];
                break;
            case 'eps':
                contentList = userProfile.eps || [];
                break;
            case 'albums':
                contentList = userProfile.albums || [];
                break;
            case 'exclusiveBeats':
                contentList = userProfile.exclusiveBeats || [];
                break;
            case 'freeBeats':
                contentList = userProfile.freeBeats || [];
                break;
            default:
                console.log("DEBUG: contentType não mapeado ->", contentType);
                break;
        }
        return contentList.find(item => item.id === contentId) || null;
    }, [contentId, contentType, userProfile]);

    // Este efeito vai rodar sempre que o selectedContent mudar
    useEffect(() => {
        if (selectedContent?.title && !adTitle) {
            setAdTitle(selectedContent.title);
        }
    }, [selectedContent]);

    /**======================================== */
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
            router.replace("/profileScreens/usePostPromoteScreen");

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
                <Stack.Screen
                    options={{
                        title: t('setupPromotion.errorTitle'),
                        headerStyle: { backgroundColor: '#191919' },
                        headerTintColor: '#fff',
                        headerShown: true,
                    }}
                />
                <Text style={styles.errorText}>{t('setupPromotion.errorContentNotFound')}</Text>
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

    const getDynamicAvatarUser = () => {
        // Verificamos se há conexão, se o perfil existe e se tem avatar
        if (isConnected === false || !userProfile?.avatar || userProfile.avatar.trim() === "") {
            return require("@/assets/images/Default_Profile_Icon/icon_profile_white_120px.png");
        }
        return { uri: userProfile.avatar };
    };

    const getDynamicCover = () => {
        // Verificamos se há conexão, se o perfil existe e se tem avatar
        if (isConnected === false || !userProfile?.avatar || userProfile.avatar.trim() === "") {
            return require("@/assets/images/Default_Profile_Icon/unknown_track.png");
        }
        return { uri: userProfile.avatar };
    };

    const coverContent = getDynamicCover();
    const avatarUser = getDynamicAvatarUser();


    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: t('setupPromotion.title'),
                    headerStyle: { backgroundColor: '#191919' },
                    headerTintColor: '#fff',
                }}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                horizontal={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Título dinâmico do conteúdo selecionado */}
                <View style={styles.headerInfoContainer}>
                    <Text style={styles.headerInfoText}>
                        {t('setupPromotion.preparingToPromote')}:
                        <Text style={styles.contentHighlight}> '{selectedContent?.title}'</Text>
                    </Text>
                </View>

                <View style={{ height: 1, backgroundColor: '#7c7c7cff', marginVertical: 20 }} />

                {/* 1. Informações da Promoção */}
                <Text style={styles.sectionTitle}>{t('setupPromotion.section1')}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={t('setupPromotion.adTitlePlaceholder')}
                    placeholderTextColor="#888"
                    value={adTitle}
                    onChangeText={setAdTitle}
                />
                <TextInput
                    style={[styles.input, styles.messageInput]}
                    placeholder={t('setupPromotion.messagePlaceholder')}
                    placeholderTextColor="#888"
                    multiline
                    numberOfLines={3}
                    maxLength={100}
                    value={customMessage}
                    onChangeText={setCustomMessage}
                />

                {/* --- RENDERIZAÇÃO CONDICIONAL DA DICA DE MENSAGEM --- */}
                {!customMessage.trim() && (
                    <View style={styles.infoCardOrange}>
                        <View style={styles.infoTitleRow}>
                            <Ionicons name="bulb-outline" size={20} color="#FF9800" />
                            <Text style={styles.infoTitleOrange}>
                                {t('setupPromotion.tips.title')}
                            </Text>
                        </View>
                        <Text style={styles.infoBody}>
                            {t('setupPromotion.tips.body')}
                        </Text>
                    </View>
                )}

                <View style={{ height: 1, backgroundColor: '#7c7c7cff', marginVertical: 20 }} />

                {/* 2. Configuração da Campanha */}
                <Text style={styles.sectionTitle}>{t('setupPromotion.section2')}</Text>
                <View style={styles.startEndContainerData}>
                    <View style={styles.dateView}>
                        <Ionicons name="calendar" size={28} color="#fff" />
                        <Text style={{ color: "#1E90FF", marginTop: 5, fontSize: 16 }}>
                            {t('setupPromotion.startDateLabel')}: {startDate ? startDate.format("DD/MM/YYYY") : "—"}
                        </Text>
                    </View>

                    <View style={styles.dateView}>
                        <Ionicons name="calendar" size={28} color="#fff" />
                        <Text style={{ color: "#FF6347", marginTop: 5, fontSize: 16, marginBottom: 10 }}>
                            {t('setupPromotion.endDateLabel')}: {endDate ? endDate.format("DD/MM/YYYY") : "—"}
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
                    style={{ borderRadius: 12, backgroundColor: "#2b2b2b", marginBottom: 10 }}
                />

                <View style={{ height: 1, backgroundColor: '#7c7c7cff', marginVertical: 20 }} />

                {/* 3. Resumo da Promoção (Preview) */}
                <Text style={styles.sectionTitle}>{t('setupPromotion.section3')}</Text>
                <View style={styles.previewContainer}>
                    <View style={styles.previewHeader}>
                        <Image source={avatarUser} style={styles.previewAvatar} />
                        <View>
                            {/* adTitle agora reflete o campo Promotion.title */}
                            <Text style={styles.previewTitle} numberOfLines={1}>
                                {adTitle || t('setupPromotion.previewTitlePlaceholder')}
                            </Text>
                            <Text style={styles.previewArtist}>{userProfile.name}</Text>
                        </View>
                    </View>

                    <View style={styles.previewBody}>
                        <Image source={coverContent} style={styles.previewImage} />

                        {/* customMessage agora reflete o campo Promotion.message */}
                        {customMessage.trim() ? (
                            <Text style={styles.previewMessage}>{customMessage}</Text>
                        ) : (
                            <Text style={styles.previewMessagePlaceholder}>
                                {t('setupPromotion.previewMessagePlaceholder')}
                            </Text>
                        )}

                        <Text style={[styles.previewDates, isDateRangeInvalid && styles.errorDates]}>
                            {isDateRangeInvalid
                                ? t('setupPromotion.invalidDateRange')
                                : t('setupPromotion.promotionActiveRange', {
                                    startDate: startDate?.format('DD/MM/YYYY'),
                                    endDate: endDate?.format('DD/MM/YYYY')
                                })}
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
                        <Text style={styles.publishButtonText}>{t('setupPromotion.publishButton')}</Text>
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
        //fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
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
        //fontWeight: 'bold',
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
        //fontWeight: 'bold',
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
        //fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },

    headerInfoContainer: {
        //marginBottom: 20,
        padding: 15,
        backgroundColor: '#2b2b2b', // Um cinza levemente mais claro que o fundo
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#1E90FF', // Uma barra azul lateral para dar destaque
    },
    headerInfoText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '500',
    },
    contentHighlight: {
        color: '#1E90FF', // O título da música em destaque azul
        fontWeight: 'bold',
    },

    infoCardOrange: {
        backgroundColor: 'rgba(255, 152, 0, 0.1)', // Laranja suave atrás
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 152, 0, 0.3)',
        marginTop: 5, // Ajustado para ficar próximo ao input
        marginBottom: 5,
    },
    infoTitleOrange: {
        color: '#FF9800',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
    // Reutilizando os que você já tem
    infoTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoBody: {
        color: '#ccc',
        fontSize: 16,
        lineHeight: 20,
    },
});