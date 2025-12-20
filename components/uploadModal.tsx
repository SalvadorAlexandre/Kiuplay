import React from 'react';
import { View, Text, Modal, ActivityIndicator, StyleSheet } from 'react-native';

type UploadModalProps = {
  visible: boolean;
  progress: number;
  status: 'idle' | 'success' | 'error';
  message: string;
  onClose: () => void;
};

export const UploadModal = ({ visible, progress, status, message, onClose }: UploadModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {status === 'idle' && (
            <>
              <Text style={styles.title}>Uploading...</Text>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.progressText}>{progress}%</Text>
            </>
          )}
          {status === 'success' && <Text style={styles.successText}>{message}</Text>}
          {status === 'error' && <Text style={styles.errorText}>{message}</Text>}
          {(status === 'success' || status === 'error') && (
            <Text style={styles.closeText} onPress={onClose}>Close</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex:1,
    backgroundColor:'rgba(0,0,0,0.7)',
    justifyContent:'center',
    alignItems:'center'
  },
  container:{
    width:300,
    padding:20,
    borderRadius:10,
    backgroundColor:'#222',
    alignItems:'center'
  },
  title:{ color:'#fff', fontSize:18, marginBottom:10 },
  progressText:{ color:'#fff', marginTop:10 },
  successText:{ color:'green', fontSize:16 },
  errorText:{ color:'red', fontSize:16 },
  closeText:{ color:'#fff', marginTop:20, textDecorationLine:'underline' }
});