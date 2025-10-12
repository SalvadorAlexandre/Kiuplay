import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface ServerOfflineViewProps {
  onReload?: () => void; // função opcional chamada ao clicar em "Recarregar"
}

const ServerOfflineView: React.FC<ServerOfflineViewProps> = ({ onReload }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/icons8_wi-fi_off_125px.png')} // substitua pela imagem real
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>O Servidor local do Kiuplay está offline</Text>
      <Text style={styles.subtitle}>
        Ligue o servidor local e recarregue o Kiuplay para acessar suas músicas.
      </Text>

      <TouchableOpacity style={styles.button} onPress={onReload}>
        <Text style={styles.buttonText}>Recarregar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ServerOfflineView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 25,
    opacity: 0.8,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#bbb',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#1565C0',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});