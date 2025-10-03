import React from 'react'
import { Stack } from 'expo-router';
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native'
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MonetizationScreen() {
    const router = useRouter()
    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Monetization panel',
                    headerStyle: { backgroundColor: '#191919' },
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

                    <Text style={styles.titleBack}>Monetization panel</Text>
                </View>
                <ScrollView
                    horizontal={false} // Garante que esta rolagem seja vertical
                    style={styles.scroll} // Aplica o estilo de fundo escuro
                    contentContainerStyle={styles.container} // Define padding e crescimento do conteúdo
                    showsHorizontalScrollIndicator={false} //Oculta a barra de rolagem
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20, }}>
                        {/* Ícone do paypal*/}
                        <Image
                            source={require('@/assets/images/4/icons8_paypal_120px_3.png')} // Troque pelo seu ícone
                            style={styles.iconPaypal}
                        />
                        <Text style={{
                            color: '#fff',            // Cor do texto
                            fontSize: 16,            // Tamanho da fonte
                            fontWeight: '600',       // Peso da fonte
                            textAlign: 'center',     // Alinha o texto horizontalmente dentro da área
                        }}>
                            Kiuplay Monetization
                        </Text>
                        <Text
                            style={styles.userHandle}>
                            Vincule sua conta Paypal para
                            vender e comprar Instrumentais
                            de uso exclusivo de estilos variados
                            no Kiuplay!
                        </Text>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#1565C0',
                                paddingVertical: 10,
                                paddingHorizontal: 16,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: '#555',
                                //alignSelf: 'flex-start',
                                marginTop: 15,
                            }}>
                            <Text style={{ color: '#fff', fontSize: 16 }}>Adicionar conta Paypal</Text>
                        </TouchableOpacity>
                    </View>
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
        //paddingHorizontal: 20, // Adiciona 20 de espaçamento interno (padding) nas partes esquerda e direita do componente
    },
    // Estilo do container do conteúdo vertical
    container: {
        flexGrow: 1, // Permite expansão do conteúdo
        // paddingVertical: 40,   // Adiciona 40 de espaçamento interno (padding) nas partes superior e inferior do componente
        paddingHorizontal: 20, // Adiciona 20 de espaçamento interno (padding) nas partes esquerda e direita do componente
    },
    profileContainer: {
        paddingHorizontal: 15,   // Adiciona espaçamento interno horizontal (left/right) dentro da View.
        backgroundColor: '#1e1e1e',   // Define a cor de fundo para um tom escuro (#1e1e1e).
        borderRadius: 20,   // Arredonda os cantos da View com raio de 10.
        //borderTopLeftRadius: 20,
        //borderTopRightRadius: 20,
        padding: 20,   // Adiciona espaçamento interno (padding) uniforme em todos os lados.
        margin: 10,   // Adiciona espaçamento externo (margin) uniforme em todos os lados.
        //marginTop: 3,   // Adiciona um pequeno espaçamento extra no topo (3 unidades).
        width: '100%',   // Faz a largura da View ocupar 100% do contêiner pai.
        // height: '100%',   // Comentado: Se usado, define a altura da View como 40% do contêiner pai.
        alignSelf: 'center',   // Centraliza horizontalmente a View dentro do contêiner pai.
        marginTop: -20
    },
    iconPaypal: {
        width: 70,
        height: 70,
    },
    userHandle: {
        color: '#aaa',
        fontSize: 16,
        marginTop: 2,
        //marginLeft: 15,
        textAlign: 'center',
    },

    // Estilo da barra que envolve o botão
    containerBack: {
        backgroundColor: '#191919',      // Cor de fundo escura
        paddingVertical: 20,             // Espaçamento vertical (topo e baixo)
        // paddingHorizontal: 10,           // Espaçamento lateral (esquerda e direita)
        borderBottomWidth: 1,            // Borda inferior com 1 pixel
        borderColor: '#191919',             // Cor da borda inferior (cinza escuro)
        flexDirection: 'row',            // Organiza os itens em linha (horizontal)
        //alignItems: 'center',            // Alinha verticalmente ao centro
        // marginBottom: 20,
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