import React from 'react'
import { Stack } from 'expo-router';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


export default function InsightsUserScreen() {
  const router = useRoute()


  return (
    <>
      <Stack.Screen
        options={{
          title: 'Seus Insights',
          headerStyle: { backgroundColor: '#191919', },
          headerTintColor: '#fff',
          //headerTitleStyle: { fontWeight: 'bold' },
          headerShown: false,
        }}
      />
      <View style={{ flex: 1, backgroundColor: '#191919' }}>

        <View style={styles.containerBack}>
          {/* Botão de pesquisa*/}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.buttonBack}>
            {/* Ícone de notificações*/}
            <Ionicons
              name='arrow-back'
              size={24}
              color='#fff'
            />
          </TouchableOpacity>
          <Text style={styles.titleBack}>Seus Insights</Text>

        </View>
        <ScrollView
          horizontal={false} // Garante que esta rolagem seja vertical
          style={styles.scroll} // Aplica o estilo de fundo escuro
          contentContainerStyle={styles.container} // Define padding e crescimento do conteúdo
          showsHorizontalScrollIndicator={false} //Oculta a barra de rolagem
        >

        </ScrollView>
      </View>
    </>


  )
}

const styles = StyleSheet.create({
  // Estilo do scroll vertical (pai)
  scroll: {
    flex: 1, // Faz com que o componente ocupe todo o espaço disponível dentro do contêiner flex
    backgroundColor: '#191919', // Fundo preto (modo dark)
  },
  // Estilo do container do conteúdo vertical
  container: {
    flexGrow: 1, // Permite expansão do conteúdo
    //paddingVertical: 40,   // Adiciona 40 de espaçamento interno (padding) nas partes superior e inferior do componente
    paddingHorizontal: 20, // Adiciona 20 de espaçamento interno (padding) nas partes esquerda e direita do componente
  },

  // Estilo da barra que envolve o botão
  containerBack: {
    backgroundColor: '#191919',      // Cor de fundo escura
    paddingVertical: 20,             // Espaçamento vertical (topo e baixo)
    //paddingHorizontal: 10,           // Espaçamento lateral (esquerda e direita)
    borderBottomWidth: 1,            // Borda inferior com 1 pixel
    borderColor: '#191919',             // Cor da borda inferior (cinza escuro)
    flexDirection: 'row',            // Organiza os itens em linha (horizontal)
    //alignItems: 'center',            // Alinha verticalmente ao centro
    marginBottom: 20,
  },
  buttonBack: {
    //backgroundColor: '#333',
    marginLeft: 10,
  },

  titleBack: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 14,
    flex: 1,
    //textAlign: 'center',
  },
})