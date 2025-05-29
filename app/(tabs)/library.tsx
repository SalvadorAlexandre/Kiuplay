import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

export default function LibraryScreen() {
  return (
    // ScrollView pai com rolagem **vertical**
    <ScrollView
      horizontal={false} // Garante que esta rolagem seja vertical
      style={styles.scroll} // Aplica o estilo de fundo escuro
      contentContainerStyle={styles.container} // Define padding e crescimento do conteúdo
    >
      {/* ScrollView filho com rolagem **horizontal** */}
      <ScrollView horizontal>
        <View style={styles.content}>
          {/* Blocos de conteúdo que rolam horizontalmente */}
          <Text style={styles.box}>Conteúdo com rolagem</Text>
          <Text style={styles.box}>Mais conteúdo</Text>
          <Text style={styles.box}>Continue rolando...</Text>
          {/* Pode adicionar mais <Text> aqui para continuar a rolagem horizontal */}
        </View>
      </ScrollView>

      <View style={styles.content}>
        {/* Blocos de conteúdo que rolam verticalmente */}
        <Text style={styles.box}>Conteúdo com rolagem</Text>
        <Text style={styles.box}>Mais conteúdo</Text>
        <Text style={styles.box}>Continue rolando...</Text>
        {/* Pode adicionar mais <Text> aqui para continuar a rolagem horizontal */}
      </View>
    </ScrollView>
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
    paddingVertical: 40,
    paddingHorizontal: 20,
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
});




/*
import { View, Text, StyleSheet } from 'react-native';

export default function LibraryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Library</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
*/

