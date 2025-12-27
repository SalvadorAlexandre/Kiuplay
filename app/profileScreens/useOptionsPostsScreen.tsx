//app/profileScreensuseOptionsPostScreen.ts

{/*TELA ONDE APARECEM A LISTA DOS TIPOS DE POSTAGEM*/ }
import React, { useState, useTransition } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { useTranslation } from '@/src/translations/useTranslation'
import { useCheckDrafts } from '@/hooks/useCheckDraft';

export default function OptionsListPostScreen() {

    const { t } = useTranslation()
    const { hasEPDraft, hasAlbumDraft } = useCheckDrafts();
    //hooks para o btn postar single----------------------------------------------
    const [scaleValuePostSingle] = useState(new Animated.Value(1))
    const handlePressInPostSingle = () => { Animated.spring(scaleValuePostSingle, { toValue: 0.96, useNativeDriver: true, }).start() }
    const handlePressOutPostSingle = () => { Animated.spring(scaleValuePostSingle, { toValue: 1, useNativeDriver: true, }).start() }
    //---------------------------------------------------------------------------------------

    //hooks para o btn postar EP----------------------------------------------
    const [scaleValuePostEP] = useState(new Animated.Value(1))
    const handlePressInPostEP = () => { Animated.spring(scaleValuePostEP, { toValue: 0.96, useNativeDriver: true, }).start() }
    const handlePressOutPostEP = () => { Animated.spring(scaleValuePostEP, { toValue: 1, useNativeDriver: true, }).start() }
    //---------------------------------------------------------------------------------------

    //hooks para o btn postar Album----------------------------------------------
    const [scaleValuePostAlbum] = useState(new Animated.Value(1))
    const handlePressInPostAlbum = () => { Animated.spring(scaleValuePostAlbum, { toValue: 0.96, useNativeDriver: true, }).start() }
    const handlePressOutPostAlbum = () => { Animated.spring(scaleValuePostAlbum, { toValue: 1, useNativeDriver: true, }).start() }
    //---------------------------------------------------------------------------------------

    //hooks para o btn postar Beat----------------------------------------------
    const [scaleValuePostBeat] = useState(new Animated.Value(1))
    const handlePressInPostBeat = () => { Animated.spring(scaleValuePostBeat, { toValue: 0.96, useNativeDriver: true, }).start() }
    const handlePressOutPostBeat = () => { Animated.spring(scaleValuePostBeat, { toValue: 1, useNativeDriver: true, }).start() }
    //---------------------------------------------------------------------------------------

    //hooks para o btn postar Video----------------------------------------------
    const [scaleValuePostVideo] = useState(new Animated.Value(1))
    const handlePressInPostVideo = () => { Animated.spring(scaleValuePostVideo, { toValue: 0.96, useNativeDriver: true, }).start() }
    const handlePressOutPostVideo = () => { Animated.spring(scaleValuePostVideo, { toValue: 1, useNativeDriver: true, }).start() }
    //---------------------------------------------------------------------------------------

    //hooks para o btn postar promotion----------------------------------------------
    const [scaleValuePostPromote] = useState(new Animated.Value(1))
    const handlePressInPostPromote = () => { Animated.spring(scaleValuePostPromote, { toValue: 0.96, useNativeDriver: true, }).start() }
    const handlePressOutPostPromote = () => { Animated.spring(scaleValuePostPromote, { toValue: 1, useNativeDriver: true, }).start() }
    //---------------------------------------------------------------------------------------

    return (

        <>
            <Stack.Screen
                options={{
                    title: t('screens.optionsListPostTitle'),
                    headerStyle: { backgroundColor: '#191919', },
                    headerTintColor: '#fff',
                    //headerTitleStyle: { fontWeight: 'bold' },
                    headerShown: true,
                }}
            />
            <View style={{ flex: 1, backgroundColor: '#191919' }}>

                <ScrollView
                    horizontal={false} // Garante que esta rolagem seja vertical
                    style={styles.scroll} // Aplica o estilo de fundo escuro
                    contentContainerStyle={styles.container} // Define padding e crescimento do conteúdo
                    showsHorizontalScrollIndicator={false} //Oculta a barra de rolagem
                >

                    {/*View do botão postar Single-----------------------------------------------------------------*/}
                    <Animated.View style={[
                        styles.buttonContainer,
                        { transform: [{ scale: scaleValuePostSingle }] } // Animação de clique
                    ]}>
                        <TouchableOpacity
                            onPressIn={handlePressInPostSingle}    // Aciona ao pressionar
                            onPressOut={handlePressOutPostSingle} // Aciona ao soltar 
                            onPress={() => router.push('/profileScreens/usePostFaixaScreen')} // Ação
                            style={styles.buttonContent} // Estilo interno
                        >
                            {/* Ícone esquerdo (ícone de upload) */}
                            <Image
                                source={require('@/assets/images/2/icons8_musical_120px.png')} // Troque pelo seu ícone
                                style={styles.iconLeft}
                            />

                            {/* Texto do botão */}
                            <Text style={styles.buttonText}>{t('screens.buttons.postSingle')}</Text>

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
                            onPress={() => router.push('/profileScreens/usePostEPScreen')} // Ação
                            style={styles.buttonContent} // Estilo interno
                        >
                            {/* Ícone esquerdo (ícone de upload) */}
                            <Image
                                source={require('@/assets/images/2/icons8_music_record_120px.png')} // Troque pelo seu ícone
                                style={styles.iconLeft}
                            />

                            {/* Texto do botão */}
                            <Text style={styles.buttonText}>{t('screens.buttons.postEP')}</Text>

                            {/* INDICADOR DE RASCUNHO PENDENTE */}
                            {hasEPDraft && <View style={styles.dotBadge} />}

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
                            onPress={() => router.push('/profileScreens/usePostAlbumScreen')} // Ação
                            style={styles.buttonContent} // Estilo interno
                        >
                            {/* Ícone esquerdo (ícone de upload) */}
                            <Image
                                source={require('@/assets/images/2/icons8_music_album_120px.png')} // Troque pelo seu ícone
                                style={styles.iconLeft}
                            />

                            {/* Texto do botão */}
                            <Text style={styles.buttonText}>{t('screens.buttons.postAlbum')}</Text>

                            {/* INDICADOR DE RASCUNHO PENDENTE */}
                            {hasAlbumDraft && <View style={styles.dotBadge} />}

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
                            onPress={() => router.push('/profileScreens/usePostBeatScreen')} // Ação
                            style={styles.buttonContent} // Estilo interno
                        >
                            {/* Ícone esquerdo (ícone de upload) */}
                            <Image
                                source={require('@/assets/images/2/icons8_vox_player_120px.png')} // Troque pelo seu ícone
                                style={styles.iconLeft}
                            />

                            {/* Texto do botão */}
                            <Text style={styles.buttonText}>{t('screens.buttons.postBeat')}</Text>


                            {/* Ícone seta para direita */}
                            <Ionicons name="chevron-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                    </Animated.View>
                    {/*----------------------------------------------------------------------------------------------*/}


                    {/*View do botão promover obra-----------------------------------------------------------------*/}
                    <Animated.View style={[
                        styles.buttonContainer,
                        { transform: [{ scale: scaleValuePostVideo }] } // Animação de clique
                    ]}>
                        <TouchableOpacity
                            onPressIn={handlePressInPostPromote}    // Aciona ao pressionar
                            onPressOut={handlePressOutPostPromote} // Aciona ao soltar 
                            onPress={() => router.push('/profileScreens/usePostPromoteScreen')}
                            style={styles.buttonContent} // Estilo interno
                        >
                            {/* Ícone esquerdo (ícone de upload) */}
                            <Image
                                source={require('@/assets/images/2/icons8_sound_surround_120px_1.png')} // Troque pelo seu ícone
                                style={styles.iconLeft}
                            />

                            {/* Texto do botão */}
                            < Text style={styles.buttonText} >{t('screens.buttons.postPromote')}</Text>

                            {/* Ícone seta para direita */}
                            <Ionicons name="chevron-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                    </Animated.View>
                    {/*----------------------------------------------------------------------------------------------*/}

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
        //paddingHorizontal: 20, // Adiciona 20 de espaçamento interno (padding) nas partes esquerda e direita do componente
    },
    buttonContainer: {
        marginBottom: 5,
        width: '100%',
        // borderRadius: 10,
        //backgroundColor: '#1e1e1e',
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
    dotBadge: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#007AFF', // Azul sistema
        position: 'absolute',
        right: 45, // Ajusta este valor para ficar logo antes da seta (chevron)
        top: '50%',
        marginTop: -5, // Metade da altura para centralizar verticalmente
        borderWidth: 1.5,
        borderColor: '#191919', // Cria um "aro" para destacar no fundo escuro
    }
})