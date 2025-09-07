//app/profileScreens/usePromoteScreen.tsx
import React from 'react'
import { Stack } from 'expo-router';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native'



export default function PromoteUserScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Promover Arte',
          headerStyle: { backgroundColor: '#191919', },
          headerTintColor: '#fff',
          //headerTitleStyle: { fontWeight: 'bold' },
          headerShown: true,
        }}
      />
      <View style={{ flex: 1, backgroundColor: '#191919' }}>

        {/*<TopTabBarInsights />*/}
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
})