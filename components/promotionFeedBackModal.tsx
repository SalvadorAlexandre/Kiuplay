import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ou a biblioteca que usas
import { useTranslation } from '@/src/translations/useTranslation';

interface FeedbackModalProps {
    isVisible: boolean;
    type: 'success' | 'error' | 'confirm'; // Adicionado 'confirm'
    message: string;
    onClose: () => void;
    onConfirm?: () => void; // Função para quando o user aceita apagar
}

export const PromotionFeedbackModal = ({ isVisible, type, message, onClose, onConfirm }: FeedbackModalProps) => {
    const { t } = useTranslation();

    // Lógica para definir ícone e cor
    const getModalConfig = () => {
        switch (type) {
            case 'success': return { icon: "checkmark-circle", color: "#4BB543" };
            case 'error': return { icon: "alert-circle", color: "#FF3333" };
            case 'confirm': return { icon: "help-circle", color: "#FFA500" }; // Cor Laranja para aviso
        }
    };

    const config = getModalConfig();

    return (
        <Modal visible={isVisible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Ionicons name={config.icon as any} size={60} color={config.color} />

                    <Text style={styles.title}>
                        {type === 'confirm' ? t('promotionFeedBackModal.confirmTitle') :
                            type === 'success' ? t('promotionFeedBackModal.successTitle') :
                                t('promotionFeedBackModal.errorTitle')}
                    </Text>

                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        {type === 'confirm' ? (
                            <>
                                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                                    <Text style={styles.buttonText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: "#FF3333" }]}
                                    onPress={onConfirm}
                                >
                                    <Text style={styles.buttonText}>{t('common.delete')}</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: config.color }]}
                                onPress={onClose}
                            >
                                <Text style={styles.buttonText}>
                                    {type === 'success' ? t('promotionFeedBackModal.successButton') : t('promotionFeedBackModal.errorButton')}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        borderColor: '#333'
    },
    title: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 15
    },
    message: {
        color: '#BBB',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20
    },
     button: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16
    },
    buttonContainer: {
        flexDirection: 'row', // Botões lado a lado no modo confirm
        gap: 10,
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#333',
    },
});