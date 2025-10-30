// app/profileScreens/monetization/useMonetizationScreen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useTranslation } from '@/src/translations/useTranslation';
import { useMonetizationFlow } from '@/hooks/useMonetizationFlow'; // Seu hook
import { router, Stack } from 'expo-router'
import BottomModal from './WalletModel';
import { useAppSelector } from "@/src/redux/hooks";

export default function UseMonetizationScreen() {
    const {
        userProfile,
        userCurrency,
        activeWallet,
        walletModalVisible,
        hasLinkedWallet,
        checkWalletStatusAndShowModal,
        closeWalletModal,
        wallets,
        clearLinkedWallets,

        formattedBalance,
        formattedPending,
        effectiveWallet,
    } = useMonetizationFlow();

    console.log('🪙 Active wallet:', activeWallet);
    console.log('💰 Effective wallet in screen:', effectiveWallet);
    console.log('💵 Formatted balance:', formattedBalance);

    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    //const { userProfile, userCurrency, activeWallet } = useMonetizationFlow();

    const isConnected = useAppSelector((state) => state.network.isConnected);

    const getDynamicAvatarSource = () => {
        if (isConnected === false || !userProfile.avatar || userProfile.avatar.trim() === "") {
            return require('@/assets/images/Default_Profile_Icon/unknown_artist.png');
        }
        return { uri: userProfile.avatar };
    };

    const avatarUser = getDynamicAvatarSource()


    return (
        <>

            <Stack.Screen
                options={{
                    title: 'KiuWallet',
                    headerStyle: { backgroundColor: '#191919', },
                    headerTintColor: '#fff',
                    //headerTitleStyle: { fontWeight: 'bold' },
                    headerShown: true,
                }}
            />

            <ScrollView
                horizontal={false}
                style={styles.scroll}
                contentContainerStyle={styles.container}
                showsHorizontalScrollIndicator={false}
            >
                {/* Header com Saudação e Ícone da Carteira */}
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        {/* Imagem do Perfil (placeholder) */}
                        <Image
                            source={avatarUser}
                            style={styles.profileImage}
                        />
                        <View>
                            <Text style={styles.greetingText}>{t('monetization.welcomeBack')}</Text>
                            <Text style={styles.userName}>{userProfile?.name || ''}</Text>
                        </View>
                    </View>

                    {/* Indicador da Carteira */}
                    <View>
                        <TouchableOpacity
                            style={styles.walletIndicator}
                            onPress={checkWalletStatusAndShowModal} // ✅ chama o modal dinamicamente
                        >
                            <Ionicons name="wallet-outline" size={22} color="#fff" />
                            <Text style={styles.walletText}>Wallets</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Cartão de Valor Total */}
                <View style={styles.totalValueCard}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardTitleContainer}>
                            <Text style={styles.cardTitle}>{t('monetization.estimatedTotalValue')}</Text>
                            <Ionicons name="information-circle-outline" size={16} color="rgba(255,255,255,0.7)" />
                        </View>
                        <View style={styles.currencySelector}>
                            <Text style={styles.currencyText}>{effectiveWallet.currency || userCurrency}</Text>
                        </View>
                    </View>

                    <Text style={styles.totalAmount}>{formattedBalance}</Text>
                    <Text style={styles.changeAmount}>↑ $8,784.13 (8.78%)</Text>

                    {/* ✅ REMOVIDO: Placeholder para o gráfico (chartPlaceholder) */}

                    {/* Botões de Ação saque*/}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="arrow-down-circle-outline" size={20} color="#FFF" />
                            <Text style={styles.actionButtonText}>{t('monetization.credit')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity onPress={clearLinkedWallets}>
                    <Text style={styles.seeAllText}>Limpar contas vinculadas</Text>
                </TouchableOpacity>


                {/* Seção Transactions */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t('monetization.transactions')}</Text>
                    </View>

                    {(effectiveWallet.transactions?.length ?? 0) === 0 ? (
                        <Text style={{ color: '#aaa', padding: 12 }}>
                            {t('monetization.noTransactions')}
                        </Text>
                    ) : (
                        <FlatList
                            data={effectiveWallet.transactions}
                            keyExtractor={(tx) => tx.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.transactionItem}>
                                    <View style={styles.transactionIconContainer}>
                                        <Ionicons name="receipt-outline" size={20} color="#FFF" />
                                    </View>
                                    <View style={styles.transactionDetails}>
                                        <Text style={styles.transactionType}>{item.type}</Text>
                                        <Text style={styles.transactionDate}>
                                            {new Date(item.date).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <Text style={styles.transactionValue}>
                                        {new Intl.NumberFormat(effectiveWallet.region ?? 'en-US', {
                                            style: 'currency',
                                            currency: effectiveWallet.currency ?? 'USD',
                                        }).format(item.amount)}
                                    </Text>
                                </View>
                            )}
                        />
                    )}
                </View>
                <View style={{ height: 50 }} />
            </ScrollView>

            <BottomModal visible={walletModalVisible} onClose={closeWalletModal}>
                {hasLinkedWallet ? (
                    <>
                        <Text style={styles.modalTitle}>Minhas Contas Vinculadas</Text>
                        <FlatList
                            data={wallets}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.walletItem}>
                                    <Text style={styles.walletName}>{item.provider}</Text>
                                    <Text style={styles.walletBalance}>{item.balance}</Text>
                                </View>
                            )}
                        />
                    </>
                ) : (
                    <>
                        <Text style={styles.modalTitle}>Nenhuma conta vinculada</Text>
                        <TouchableOpacity
                            style={styles.linkButton}
                            onPress={() => {
                                closeWalletModal();
                                router.push('/profileScreens/monetization/linkWalletAccountScreen');
                            }}
                        >
                            <Ionicons name="card-outline" size={20} color="#fff" />
                            <Text style={styles.linkButtonText}>Vincular conta</Text>
                        </TouchableOpacity>
                    </>
                )}
            </BottomModal>
        </>

    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: '#191919',
        padding: 16,
    },
    container: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingHorizontal: 20,
        marginBottom: 20,
        //marginTop: 30,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#ccc',
    },
    greetingText: {
        color: '#D0D0D0',
        fontSize: 14,
    },
    userName: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerIcons: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 15,
    },
    totalValueCard: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        //marginHorizontal: 20,
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#fff'
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardTitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginRight: 5,
    },
    currencySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    currencyText: {
        color: '#FFF',
        marginLeft: 5,
        marginRight: 5,
        fontWeight: 'bold',
    },
    totalAmount: {
        color: '#FFF',
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    changeAmount: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 20, // Adicionado margin para compensar o gráfico removido
    },
    // ✅ REMOVIDOS: chartPlaceholder e chartImage styles

    actionButtons: {
        //flexDirection: 'row',
        //justifyContent: 'space-around',
        marginTop: 10, // Ajustado um pouco para cima
    },
    actionButton: {
        backgroundColor: '#1E90FF',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
        alignItems: 'center',
        minWidth: 90,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    actionButtonText: {
        color: '#FFF',
        marginLeft: 5,
        fontWeight: '600',
    },
    section: {
        //marginHorizontal: 20,
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    seeAllText: {
        color: '#FF69B4',
        fontWeight: '600',
    },
    assetsContainer: {
        paddingBottom: 10,
    },
    assetCard: {
        backgroundColor: '#2A2A2A',
        width: 150,
        height: 120,
        borderRadius: 15,
        padding: 15,
        marginRight: 15,
        justifyContent: 'space-between',
    },
    assetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    assetName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    assetValue: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
    },
    transactionIconContainer: {
        backgroundColor: '#3F3F3F',
        borderRadius: 20,
        padding: 8,
        marginRight: 15,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionType: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    transactionDate: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },
    transactionValue: {
        color: '#28A745',
        fontSize: 16,
        fontWeight: 'bold',
    },


    walletIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#222',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 12,
    },
    walletText: {
        color: '#FFF',
        marginLeft: 6,
        fontWeight: '600',
        fontSize: 14,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 16,
    },
    walletItem: {
        backgroundColor: '#222',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    walletName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    walletBalance: {
        color: '#00FF88',
        fontSize: 16,
        fontWeight: '600',
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2A2A2A',
        borderRadius: 19,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 20,
    },
    linkButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});