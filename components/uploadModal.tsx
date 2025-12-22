//components/uploadModal
import React from 'react';
import { View, Text, Modal, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/src/translations/useTranslation'

type UploadModalProps = {
  visible: boolean;
  progress: number;
  status: 'idle' | 'success' | 'error';
  message: string;
  onClose: () => void;
};

export const UploadModal = ({ visible, progress, status, message, onClose }: UploadModalProps) => {

  const { t } = useTranslation()

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* ESTADO: CARREGANDO (IDLE) */}
          {status === 'idle' && (
            <View style={styles.content}>
              <Text style={styles.title}>{t('uploadModal.uploadingTitle')}</Text>
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.progressText}>{progress}%</Text>
              </View>
              <Text style={styles.messageText}>{t('uploadModal.waitingMessage')}</Text>
            </View>
          )}

          {/* ESTADO: SUCESSO */}
          {status === 'success' && (
            <View style={styles.content}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(76, 175, 80, 0.2)' }]}>
                <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
              </View>
              <Text style={styles.statusTitle}>{t('uploadModal.successTitle')}</Text>
              <Text style={styles.messageText}>{message}</Text>

              <TouchableOpacity style={styles.btnAction} onPress={onClose}>
                <Text style={styles.btnActionText}>{t('uploadModal.btnContinue')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ESTADO: ERRO */}
          {status === 'error' && (
            <View style={styles.content}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 82, 82, 0.2)' }]}>
                <Ionicons name="alert-circle" size={60} color="#FF5252" />
              </View>
              <Text style={[styles.statusTitle, { color: '#FF5252' }]}>{t('uploadModal.errorTitle')}</Text>
              <Text style={styles.messageText}>{message}</Text>

              <TouchableOpacity style={[styles.btnAction, { backgroundColor: '#FF5252' }]} onPress={onClose}>
                <Text style={styles.btnActionText}>{t('uploadModal.btnRetry')}</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)', // Um pouco mais escuro para foco total
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  container: {
    width: '100%',
    maxWidth: 320,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#1E1E1E', // Cinza profundo
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333'
  },
  content: {
    width: '100%',
    alignItems: 'center'
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  statusTitle: {
    color: '#4CAF50',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },
  loaderContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10
  },
  messageText: {
    color: '#BBB',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20
  },
  btnAction: {
    width: '100%',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  btnActionText: {
    color: '#000', // Texto preto no botão verde para alto contraste
    fontSize: 16,
    fontWeight: 'bold'
  }
});