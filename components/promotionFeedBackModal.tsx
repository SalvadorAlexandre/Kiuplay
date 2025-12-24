import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ou a biblioteca que usas
import { useTranslation } from '@/src/translations/useTranslation';

interface FeedbackModalProps {
    isVisible: boolean;
    type: 'success' | 'error';
    message: string;
    onClose: () => void;
}

export const PromotionFeedbackModal = ({ isVisible, type, message, onClose }: FeedbackModalProps) => {
    const isSuccess = type === 'success';
    const { t } = useTranslation();
    return (
        <Modal visible={isVisible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Ionicons
                        name={isSuccess ? "checkmark-circle" : "alert-circle"}
                        size={60}
                        color={isSuccess ? "#4BB543" : "#FF3333"}
                    />

                    {/* Título Traduzido */}
                    <Text style={styles.title}>
                        {isSuccess ? t('promotionFeedBackModal.successTitle') : t('promotionFeedBackModal.errorTitle')}
                    </Text>

                    <Text style={styles.message}>{message}</Text>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: isSuccess ? "#4BB543" : "#333" }]}
                        onPress={onClose}
                    >
                        {/* Texto do Botão Traduzido */}
                        <Text style={styles.buttonText}>
                            {isSuccess ? t('promotionFeedBackModal.successButton') : t('promotionFeedBackModal.errorButton')}
                        </Text>
                    </TouchableOpacity>
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
        width: '100%',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center'
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16
    }
});