import React from 'react';
import TopTabBarLibrary from '@/components/topTabBarLibraryScreen';
import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function LibraryScreen() {
  return (
    // ScrollView pai com rolagem **vertical**

    <View style={{ flex: 1, backgroundColor: '#191919' }}>
      {/* Topo fixo */}
      <TopTabBarLibrary />

      {/* Conteúdo scrollável */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Conteúdo da tela */}
        <Text style={{ color: '#fff', margin: 20 }}>Conteúdo aqui...</Text>
        {/* Pode colocar seus blocos, listas, etc */}
      </ScrollView>

      {/* Botões flutuantes fixos */}
      <View style={styles.floatingBox}>
        <TouchableOpacity style={styles.buttonPlayLocaCloud}>
          <Text style={styles.buttonText}>Local</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity style={styles.buttonPlayLocaCloud}>
          <Text style={styles.buttonText}>Cloud</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  // Estilo do scroll vertical (pai)
  scroll: {
    flex: 1,
    backgroundColor: '#191919', // Fundo preto (modo dark)

  },
  // Estilo do container do conteúdo vertical
  container: {
    flexGrow: 1, // Permite expansão do conteúdo
    //paddingVertical: 40,
    //paddingHorizontal: 20,

  },
  // Estilo do conteúdo horizontal
  content: {
    flexDirection: 'row', // Os blocos ficam lado a lado
  },
  // Estilo dos blocos de texto
  box: {
    width: 200,
    height: 200,
    marginRight: 20,
    backgroundColor: '#1e1e1e', // Cor mais clara que o fundo para contraste
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 200, // Centraliza verticalmente o texto
  },
  button: {
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
    marginRight: 15,
  },

  buttonPlayLocaCloud: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  floatingBox: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },

  separator: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 8,
  },
});






