import React from 'react';
import TopTabBarBeatStore from '@/components/topTabBarBeatStoreScreen';
import useBeatStoreTabs from '@/hooks/useBeatStoreTabs'
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function BeatStoreScreen() {

  const { activeTab, handleTabChange, } = useBeatStoreTabs() // Estado para controlar as tabs

  return (
    // ScrollView pai com rolagem **vertical**

    <View style={{ flex: 1, backgroundColor: '#191919' }}>
      {/* Topo fixo */}
      <TopTabBarBeatStore />


      <View style={styles.tabsContainer}>
        {['feeds', 'curtidas', 'seguindo'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => handleTabChange(tab as 'feeds' | 'curtidas' | 'seguindo')}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>


      <ScrollView
        horizontal={false} // Garante que esta rolagem seja vertical
        style={styles.scroll} // Aplica o estilo de fundo escuro
        contentContainerStyle={styles.container} // Define padding e crescimento do conteúdo
        showsHorizontalScrollIndicator={false} //Oculta a barra de rolagem
      >
        {/* Conteúdo da tela */}
        <Text style={{ color: '#fff', margin: 20 }}>Conteúdo aqui...</Text>
        {/* Pode colocar seus blocos, listas, etc */}

        {activeTab === 'feeds' && (
          <View>
            <Text style={{ color: '#fff', margin: 20 }}>Conteúdo de Feeds</Text>
            {/* Lista de feeds, por exemplo */}
          </View>
        )}

        {activeTab === 'curtidas' && (
          <View>
            <Text style={{ color: '#fff', margin: 20 }}>Músicas Curtidas</Text>
            {/* Lista de músicas curtidas */}
          </View>
        )}

        {activeTab === 'seguindo' && (
          <View>
            <Text style={{ color: '#fff', margin: 20 }}>Artistas Seguindo</Text>
            {/* Lista de artistas seguidos */}
          </View>
        )}
        <View style={{ height: 110, }}></View>
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          console.log('Botão da Beat Store pressionado!');
        }}
      >
        <Image
          source={require('@/assets/images/4/sound-waves.png')}
          style={{ width: 50, height: 40, tintColor: '#fff' }}
        />
      </TouchableOpacity>
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
  floatingButton: {
    position: 'absolute',
    bottom: 80,
    right: 25,
    width: 60,
    height: 60,
    backgroundColor: '#1565C0', // Azul vibrante
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  tabsContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
    marginLeft: 10,

    //backgroundColor: '#1e1e1e',
    //justifyContent: 'space-around',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#333',
    marginHorizontal: 10,
  },
  activeTabButton: {
    backgroundColor: '#1565C0',
  },
  tabText: {
    color: '#aaa',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  contentText: {
    color: '#fff',
    fontSize: 16,
  },
});