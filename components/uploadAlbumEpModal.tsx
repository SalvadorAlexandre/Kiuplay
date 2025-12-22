import React from 'react';
import {
    Modal,
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/src/translations/useTranslation'

interface StatusModalProps {
    visible: boolean;
    type: 'loading' | 'success' | 'error' | 'confirm';
    message: string;
    onClose?: () => void;
    onConfirm?: () => void;
    progress?: number; // Para mostrar % do upload
}

export const StatusAlbumEpModal = ({ visible, type, message, onClose, onConfirm, progress }: StatusModalProps) => {


    const { t } = useTranslation()


    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>

                    {type === 'loading' && (
                        <>
                            <ActivityIndicator size="large" color="#4CAF50" />
                            {progress !== undefined && <Text style={styles.progressText}>{progress}%</Text>}
                        </>
                    )}

                    {type === 'success' && <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />}
                    {type === 'error' && <Ionicons name="alert-circle" size={60} color="#FF5252" />}
                    {type === 'confirm' && <Ionicons name="help-circle" size={60} color="#0199ffff" />}

                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        {type === 'confirm' ? (
                            <>
                                <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={onClose}>
                                    <Text style={styles.btnText}>{t('commonModals.no')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn, styles.btnConfirm]} onPress={onConfirm}>
                                    <Text style={styles.btnText}> {t('commonModals.yesDelete')}</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            type !== 'loading' && (
                                <TouchableOpacity style={styles.btnClose} onPress={onClose}>
                                    <Text style={styles.btnText}>{t('commonModals.ok')}</Text>
                                </TouchableOpacity>
                            )
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
    container: { width: '80%', backgroundColor: '#1A1A1A', borderRadius: 20, padding: 25, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
    message: { color: '#FFF', fontSize: 16, textAlign: 'center', marginVertical: 20, fontWeight: '500' },
    progressText: { color: '#FFF', marginTop: 10, fontWeight: 'bold' },
    buttonContainer: { flexDirection: 'row', gap: 10 },
    btn: { paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10, minWidth: 100, alignItems: 'center' },
    btnCancel: { backgroundColor: '#333' },
    btnConfirm: { backgroundColor: '#FF5252' },
    btnClose: { backgroundColor: '#333', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10 },
    btnText: { color: '#000', fontWeight: 'bold' }
});