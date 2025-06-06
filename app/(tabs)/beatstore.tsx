import React from 'react';
import TopTabBarBeatStore from '@/components/topTabBarBeatStoreScreen';
import {
  ScrollView,
  View,
  Text,
  StyleSheet
} from 'react-native';

export default function BeatStoreScreen() {
  return (
    // ScrollView pai com rolagem **vertical**

    <View style={{ flex: 1, backgroundColor: '#191919' }}>
      {/* Topo fixo */}
      <TopTabBarBeatStore />
      <ScrollView
        horizontal={false} // Garante que esta rolagem seja vertical
        style={styles.scroll} // Aplica o estilo de fundo escuro
        contentContainerStyle={styles.container} // Define padding e crescimento do conteúdo
        showsHorizontalScrollIndicator={false} //Oculta a barra de rolagem
      >
        {/* Conteúdo da tela */}
        <Text style={{ color: '#fff', margin: 20 }}>Conteúdo aqui...</Text>
        {/* Pode colocar seus blocos, listas, etc */}
      </ScrollView>

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
    // paddingHorizontal: 20,
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