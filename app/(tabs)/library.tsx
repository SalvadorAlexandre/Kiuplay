import React from 'react';
import TopTabBarLibrary from '@/components/topTabBarLibraryScreen';
import { useSelectedMusic, TypeMusic } from '@/hooks/useSelectedMusic'
import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function LibraryScreen() {

  //Hook que verifica se um btn das librarys está checked
  const { selectedLibraryContent, setSelectedLibraryContent } = useSelectedMusic()
  /**
     * Função auxiliar que verifica se um tipo de conteúdo está atualmente selecionado.
     * @param current - Conteúdo atualmente selecionado.
     * @param type - Tipo a ser verificado.
     * @returns true se for o mesmo tipo, false caso contrário.
     */
  const isSelected = (current: TypeMusic, type: TypeMusic): boolean => {
    return current === type;
  };
  return (

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
        {/*BTN para buscar musicas na cloud*/}
        <TouchableOpacity
          style={[
            styles.buttonPlayCloud,
            isSelected(selectedLibraryContent, 'cloud') &&
            styles.workButtonSelected //Aplica o outro estilo quando estiver checked
          ]}
          onPress={() => setSelectedLibraryContent('cloud')}>
         
          <Image
            source={require('@/assets/images/4/icons8_sound_cloud_120px_1.png')}
            style={{ width: 40, height: 40, marginBottom: -10,}}
          />
        </TouchableOpacity>

        {/*BTN para buscar musicas no dispositivo*/}
        <TouchableOpacity
          style={[
            styles.buttonPlayLocal,
            isSelected(selectedLibraryContent, 'local') &&
            styles.workButtonSelected //Aplica o outro estilo quando estiver checked
          ]}
          onPress={() => setSelectedLibraryContent('local')}>
        
          <Image
            source={require('@/assets/images/4/icons8_music_folder_120px.png')}
            style={{ width: 40, height: 40, marginTop: -10,}}
          />
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
  buttonPlayLocal: {
    flex: 1, // ocupa 50% da caixa
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: -20,
  },
  buttonPlayCloud: {
    flex: 1, // ocupa 50% da caixa
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: -20,
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
    // paddingHorizontal: 16,
    height: 100,
    width: 70,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  workButtonSelected: {
    backgroundColor: '#7F7F7F',
  },
});






