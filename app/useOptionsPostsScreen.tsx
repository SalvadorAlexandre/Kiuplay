{/*TELA ONDE APARECEM A LISTA DOS TIPOS DE POSTAGEM*/ }
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { router, } from 'expo-router';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
} from 'react-native';


export default function OptionsListPostScreen() {
    //hooks para o btn postar single----------------------------------------------
    const [scaleValuePostSingle] = useState(new Animated.Value(1))
    const handlePressInPostSingle = () => {
        Animated.spring(scaleValuePostSingle, { toValue: 0.96, useNativeDriver: true, }).start()
    }
    const handlePressOutPostSingle = () => {
        Animated.spring(scaleValuePostSingle, { toValue: 1, useNativeDriver: true, }).start()
    }
    //---------------------------------------------------------------------------------------

    //hooks para o btn postar EP----------------------------------------------
    const [scaleValuePostEP] = useState(new Animated.Value(1))
    const handlePressInPostEP = () => {
        Animated.spring(scaleValuePostEP, { toValue: 0.96, useNativeDriver: true, }).start()
    }
    const handlePressOutPostEP = () => {
        Animated.spring(scaleValuePostEP, { toValue: 1, useNativeDriver: true, }).start()
    }
    //---------------------------------------------------------------------------------------

    //hooks para o btn postar Album----------------------------------------------
    const [scaleValuePostAlbum] = useState(new Animated.Value(1))
    const handlePressInPostAlbum = () => {
        Animated.spring(scaleValuePostAlbum, { toValue: 0.96, useNativeDriver: true, }).start()
    }
    const handlePressOutPostAlbum = () => {
        Animated.spring(scaleValuePostAlbum, { toValue: 1, useNativeDriver: true, }).start()
    }
    //---------------------------------------------------------------------------------------

    //hooks para o btn postar Beat----------------------------------------------
    const [scaleValuePostBeat] = useState(new Animated.Value(1))
    const handlePressInPostBeat = () => {
        Animated.spring(scaleValuePostBeat, { toValue: 0.96, useNativeDriver: true, }).start()
    }
    const handlePressOutPostBeat = () => {
        Animated.spring(scaleValuePostBeat, { toValue: 1, useNativeDriver: true, }).start()
    }
    //---------------------------------------------------------------------------------------


    return (
        <View style={styles.container}>

            <View style={{
                backgroundColor: '#fff',
                marginBottom: 10,
                marginTop: 10,
                alignItems: 'center',
                justifyContent: 'center',
                width: "100%", // Defina o tamanho desejado para a View
                height: 300, // Defina a altura desejada para a View
                overflow: 'hidden', // Garante que a imagem não ultrapasse a View
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
            }}>
                <Image
                    source={require('@/assets/images/4/essential-10.png')}
                    style={{ width: '100%', height: '100%' }} // Preenche toda a View
                    resizeMode="cover" // Ajusta a imagem para cobrir toda a área
                />
            </View>


            {/*View do botão postar Single-----------------------------------------------------------------*/}
            <Animated.View style={[
                styles.buttonContainer,
                { transform: [{ scale: scaleValuePostSingle }] } // Animação de clique
            ]}>
                <TouchableOpacity
                    onPressIn={handlePressInPostSingle}    // Aciona ao pressionar
                    onPressOut={handlePressOutPostSingle} // Aciona ao soltar 
                    onPress={() => router.push('/usePostFaixaScreen')} // Ação
                    style={styles.buttonContent} // Estilo interno
                >
                    {/* Ícone esquerdo (ícone de upload) */}
                    <Image
                        source={require('@/assets/images/2/icons8_musical_120px.png')} // Troque pelo seu ícone
                        style={styles.iconLeft}
                    />

                    {/* Texto do botão */}
                    <Text style={styles.buttonText}>Criar post de faixa single</Text>

                    {/* Ícone seta para direita */}
                    <Ionicons name="chevron-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </Animated.View>
            {/*-----------------------------------------------------------------------------------------------*/}


            {/*View do botão postar EP-----------------------------------------------------------------*/}
            <Animated.View style={[
                styles.buttonContainer,
                { transform: [{ scale: scaleValuePostEP }] } // Animação de clique
            ]}>
                <TouchableOpacity
                    onPressIn={handlePressInPostEP}    // Aciona ao pressionar
                    onPressOut={handlePressOutPostEP} // Aciona ao soltar 
                    onPress={() => router.push('/usePostEPScreen')} // Ação
                    style={styles.buttonContent} // Estilo interno
                >
                    {/* Ícone esquerdo (ícone de upload) */}
                    <Image
                        source={require('@/assets/images/2/icons8_music_record_120px.png')} // Troque pelo seu ícone
                        style={styles.iconLeft}
                    />

                    {/* Texto do botão */}
                    <Text style={styles.buttonText}>Criar post de Extended Play (EP)</Text>

                    {/* Ícone seta para direita */}
                    <Ionicons name="chevron-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </Animated.View>
            {/*---------------------------------------------------------------------------------------------*/}


            {/*View do botão postar Album-----------------------------------------------------------------*/}
            <Animated.View style={[
                styles.buttonContainer,
                { transform: [{ scale: scaleValuePostAlbum }] } // Animação de clique
            ]}>
                <TouchableOpacity
                    onPressIn={handlePressInPostAlbum}    // Aciona ao pressionar
                    onPressOut={handlePressOutPostAlbum} // Aciona ao soltar 
                    onPress={() => router.push('/usePostAlbumScreen')} // Ação
                    style={styles.buttonContent} // Estilo interno
                >
                    {/* Ícone esquerdo (ícone de upload) */}
                    <Image
                        source={require('@/assets/images/2/icons8_music_album_120px.png')} // Troque pelo seu ícone
                        style={styles.iconLeft}
                    />

                    {/* Texto do botão */}
                    <Text style={styles.buttonText}>Criar post de Album</Text>

                    {/* Ícone seta para direita */}
                    <Ionicons name="chevron-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </Animated.View>
            {/*----------------------------------------------------------------------------------*/}

            {/*View do botão postar beat-----------------------------------------------------------------*/}
            <Animated.View style={[
                styles.buttonContainer,
                { transform: [{ scale: scaleValuePostBeat }] } // Animação de clique
            ]}>
                <TouchableOpacity
                    onPressIn={handlePressInPostBeat}    // Aciona ao pressionar
                    onPressOut={handlePressOutPostBeat} // Aciona ao soltar 
                    onPress={() => router.push('/usePostBeatScreen')} // Ação
                    style={styles.buttonContent} // Estilo interno
                >
                    {/* Ícone esquerdo (ícone de upload) */}
                    <Image
                        source={require('@/assets/images/2/icons8_vox_player_120px.png')} // Troque pelo seu ícone
                        style={styles.iconLeft}
                    />

                    {/* Texto do botão */}
                    <Text style={styles.buttonText}>Criar post de Beat</Text>

                    {/* Ícone seta para direita */}
                    <Ionicons name="chevron-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </Animated.View>
            {/*----------------------------------------------------------------------------------------------*/}


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Faz com que o componente ocupe todo o espaço disponível dentro do contêiner flex
        backgroundColor: '#191919', // Fundo preto (modo dark)
    },
    buttonContainer: {
        marginBottom: 5,
        width: '100%',
        // borderRadius: 10,
        backgroundColor: '#1e1e1e',
        overflow: 'hidden',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    iconLeft: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    buttonText: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        //fontWeight: 'bold',
    },
})
